import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Check, X, 
  Eye, Grid, Home, Bot, Lightbulb 
} from 'lucide-react'
import useStore from '../store/useStore'
import AIAssistant from '../components/AIAssistant'
import { VoiceReaderCompact } from '../components/VoiceReader'
import { explainQuestion } from '../services/aiService'

export default function Review() {
  const navigate = useNavigate()
  const { 
    questions, 
    answers, 
    selectedSubjects, 
    currentExam, 
    isExamSubmitted,
    resetExam 
  } = useStore()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showNavGrid, setShowNavGrid] = useState(false)
  const [filter, setFilter] = useState('all')
  const [showAI, setShowAI] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [loadingExplanation, setLoadingExplanation] = useState(false)

  useEffect(() => {
    if (!isExamSubmitted || questions.length === 0) {
      navigate('/')
    }
  }, [isExamSubmitted, questions, navigate])

  if (!isExamSubmitted || questions.length === 0) return null

  const filteredQuestions = questions.map((q, idx) => ({ ...q, originalIndex: idx })).filter((q, idx) => {
    if (filter === 'all') return true
    if (filter === 'correct') return answers[idx] === q.answer
    if (filter === 'wrong') return answers[idx] !== undefined && answers[idx] !== q.answer
    if (filter === 'unanswered') return answers[idx] === undefined
    return true
  })

  const currentQuestion = filteredQuestions[currentIndex]
  const userAnswer = answers[currentQuestion?.originalIndex]
  const isCorrect = userAnswer === currentQuestion?.answer
  const isUnanswered = userAnswer === undefined

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleGoToQuestion = (idx) => {
    setCurrentIndex(idx)
    setShowNavGrid(false)
  }

  const getQuestionStatus = (q) => {
    const answer = answers[q.originalIndex]
    if (answer === undefined) return 'unanswered'
    if (answer === q.answer) return 'correct'
    return 'wrong'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'correct':
        return 'bg-green-500 text-white border-green-500'
      case 'wrong':
        return 'bg-red-500 text-white border-red-500'
      default:
        return 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600'
    }
  }

  const handleExit = () => {
    resetExam()
    navigate('/')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleExit}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Review Answers</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Question {currentIndex + 1} of {filteredQuestions.length}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNavGrid(true)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'correct', 'wrong', 'unanswered'].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentIndex(0); }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors capitalize
                ${filter === f
                  ? f === 'correct' ? 'bg-green-600 text-white'
                    : f === 'wrong' ? 'bg-red-600 text-white'
                    : f === 'unanswered' ? 'bg-slate-600 text-white'
                    : 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
            >
              {f} ({questions.filter((q, idx) => {
                if (f === 'all') return true
                if (f === 'correct') return answers[idx] === q.answer
                if (f === 'wrong') return answers[idx] !== undefined && answers[idx] !== q.answer
                if (f === 'unanswered') return answers[idx] === undefined
                return true
              }).length})
            </button>
          ))}
        </div>

        {currentQuestion && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className={`card p-6 border-2 ${
                isUnanswered 
                  ? 'border-slate-300 dark:border-slate-600' 
                  : isCorrect 
                    ? 'border-green-500' 
                    : 'border-red-500'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {isUnanswered ? (
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium">
                        Not Answered
                      </span>
                    ) : isCorrect ? (
                      <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-sm font-medium flex items-center gap-1">
                        <Check className="w-4 h-4" /> Correct
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-sm font-medium flex items-center gap-1">
                        <X className="w-4 h-4" /> Wrong
                      </span>
                    )}
                    {currentQuestion.examyear && (
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        JAMB {currentQuestion.examyear}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <VoiceReaderCompact question={currentQuestion} />
                    <button
                      onClick={() => setShowAI(true)}
                      className="p-2 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 transition-all"
                      title="AI Assistant"
                    >
                      <Bot className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div 
                  className="text-lg text-slate-900 dark:text-white leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
                />

                {currentQuestion.image && (
                  <div className="mb-6">
                    <img 
                      src={currentQuestion.image} 
                      alt="Question diagram" 
                      className="max-w-full h-auto rounded-lg mx-auto"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  {Object.entries(currentQuestion.options).map(([key, value]) => {
                    if (!value) return null
                    const isUserAnswer = userAnswer === key
                    const isCorrectAnswer = currentQuestion.answer === key
                    
                    let optionClass = 'border-slate-200 dark:border-slate-700'
                    if (isCorrectAnswer) {
                      optionClass = 'border-green-500 bg-green-50 dark:bg-green-900/30'
                    } else if (isUserAnswer && !isCorrectAnswer) {
                      optionClass = 'border-red-500 bg-red-50 dark:bg-red-900/30'
                    }
                    
                    return (
                      <div
                        key={key}
                        className={`p-4 rounded-xl border-2 flex items-start gap-4 ${optionClass}`}
                      >
                        <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                          ${isCorrectAnswer
                            ? 'bg-green-500 text-white'
                            : isUserAnswer
                              ? 'bg-red-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                          {isCorrectAnswer ? <Check className="w-4 h-4" /> : 
                           isUserAnswer ? <X className="w-4 h-4" /> : key.toUpperCase()}
                        </span>
                        <span 
                          className="text-slate-700 dark:text-slate-200 flex-1"
                          dangerouslySetInnerHTML={{ __html: value }}
                        />
                        {isCorrectAnswer && (
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">
                            Correct Answer
                          </span>
                        )}
                        {isUserAnswer && !isCorrectAnswer && (
                          <span className="text-xs font-medium text-red-600 dark:text-red-400">
                            Your Answer
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>

                {currentQuestion.solution && (
                  <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Explanation
                    </p>
                    <p 
                      className="text-blue-800 dark:text-blue-200"
                      dangerouslySetInnerHTML={{ __html: currentQuestion.solution }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          
          <button
            onClick={handleExit}
            className="btn-primary flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Exit Review
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= filteredQuestions.length - 1}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showNavGrid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
            onClick={() => setShowNavGrid(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white dark:bg-slate-800 w-full sm:w-auto sm:max-w-lg sm:rounded-2xl rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Question Navigator</h3>
                <button
                  onClick={() => setShowNavGrid(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">Correct</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">Wrong</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded bg-slate-300 dark:bg-slate-600"></div>
                  <span className="text-slate-600 dark:text-slate-400">Unanswered</span>
                </div>
              </div>

              <div className="grid grid-cols-10 gap-1">
                {filteredQuestions.map((q, idx) => {
                  const status = getQuestionStatus(q)
                  return (
                    <button
                      key={idx}
                      onClick={() => handleGoToQuestion(idx)}
                      className={`question-nav-btn ${getStatusColor(status)} ${
                        idx === currentIndex ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AIAssistant 
        isOpen={showAI} 
        onClose={() => setShowAI(false)} 
        currentQuestion={currentQuestion}
        currentSubject={selectedSubjects[0]}
      />
    </div>
  )
}
