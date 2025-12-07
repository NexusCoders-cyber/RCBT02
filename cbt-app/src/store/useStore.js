import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const JAMB_SUBJECTS = [
  { id: 'english', name: 'English Language', icon: '📝', color: '#9CA3AF', bgColor: 'bg-gray-200', isCalculation: false },
  { id: 'mathematics', name: 'Mathematics', icon: '🔢', color: '#A855F7', bgColor: 'bg-purple-200', isCalculation: true },
  { id: 'physics', name: 'Physics', icon: '⚡', color: '#EAB308', bgColor: 'bg-yellow-200', isCalculation: true },
  { id: 'chemistry', name: 'Chemistry', icon: '🧪', color: '#22C55E', bgColor: 'bg-green-200', isCalculation: true },
  { id: 'biology', name: 'Biology', icon: '🧬', color: '#EC4899', bgColor: 'bg-pink-200', isCalculation: false },
  { id: 'literature', name: 'Literature in English', icon: '📖', color: '#F97316', bgColor: 'bg-orange-200', isCalculation: false },
  { id: 'government', name: 'Government', icon: '🏛️', color: '#EF4444', bgColor: 'bg-red-200', isCalculation: false },
  { id: 'commerce', name: 'Commerce', icon: '💼', color: '#14B8A6', bgColor: 'bg-teal-200', isCalculation: false },
  { id: 'accounting', name: 'Accounting', icon: '📊', color: '#6366F1', bgColor: 'bg-indigo-200', isCalculation: true },
  { id: 'economics', name: 'Economics', icon: '📈', color: '#06B6D4', bgColor: 'bg-cyan-200', isCalculation: true },
  { id: 'crk', name: 'Christian Religious Studies', icon: '✝️', color: '#F59E0B', bgColor: 'bg-amber-200', isCalculation: false },
  { id: 'irk', name: 'Islamic Religious Studies', icon: '☪️', color: '#10B981', bgColor: 'bg-emerald-200', isCalculation: false },
  { id: 'geography', name: 'Geography', icon: '🌍', color: '#84CC16', bgColor: 'bg-lime-200', isCalculation: false },
  { id: 'agric', name: 'Agricultural Science', icon: '🌾', color: '#22C55E', bgColor: 'bg-green-200', isCalculation: false },
  { id: 'history', name: 'History', icon: '📜', color: '#A16207', bgColor: 'bg-amber-200', isCalculation: false },
]

const YEARS = Array.from({ length: 48 }, (_, i) => 2025 - i)

const useStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',
      fontSize: 'medium',
      timerEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
      calculatorEnabled: true,
      
      subjects: JAMB_SUBJECTS,
      years: YEARS,
      
      currentExam: null,
      examMode: null,
      selectedSubjects: [],
      questions: [],
      currentQuestionIndex: 0,
      currentSubjectIndex: 0,
      answers: {},
      markedForReview: [],
      bookmarkedQuestions: [],
      timeRemaining: 0,
      examStartTime: null,
      examEndTime: null,
      isExamActive: false,
      isExamSubmitted: false,
      showCalculator: false,
      
      practiceHistory: [],
      examHistory: [],
      notifications: [],
      isOnline: true,
      
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setTimerEnabled: (timerEnabled) => set({ timerEnabled }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setVibrationEnabled: (vibrationEnabled) => set({ vibrationEnabled }),
      setCalculatorEnabled: (calculatorEnabled) => set({ calculatorEnabled }),
      toggleCalculator: () => set((state) => ({ showCalculator: !state.showCalculator })),
      setShowCalculator: (show) => set({ showCalculator: show }),
      
      bookmarkQuestion: (question) => {
        set((state) => {
          const exists = state.bookmarkedQuestions.some(q => q.id === question.id)
          if (exists) {
            return {
              bookmarkedQuestions: state.bookmarkedQuestions.filter(q => q.id !== question.id)
            }
          }
          return {
            bookmarkedQuestions: [...state.bookmarkedQuestions, {
              ...question,
              bookmarkedAt: Date.now()
            }]
          }
        })
      },
      
      removeBookmark: (questionId) => {
        set((state) => ({
          bookmarkedQuestions: state.bookmarkedQuestions.filter(q => q.id !== questionId)
        }))
      },
      
      isBookmarked: (questionId) => {
        return get().bookmarkedQuestions.some(q => q.id === questionId)
      },
      
      startPracticeMode: (subject, year, questions, duration) => {
        set({
          examMode: 'practice',
          selectedSubjects: [subject],
          questions: questions.map((q, i) => ({ 
            ...q, 
            id: q.id || `${subject.id}-${year || 'all'}-${q.examtype || 'utme'}-${i}`,
            globalIndex: i, 
            subjectId: subject.id 
          })),
          currentQuestionIndex: 0,
          currentSubjectIndex: 0,
          answers: {},
          markedForReview: [],
          timeRemaining: duration * 60,
          examStartTime: Date.now(),
          isExamActive: true,
          isExamSubmitted: false,
          showCalculator: false,
        })
      },
      
      startFullExamMode: (subjects, questionsMap, duration) => {
        const allQuestions = []
        let globalIndex = 0
        
        subjects.forEach((subject, subjectIdx) => {
          const subjectQuestions = questionsMap[subject.id] || []
          subjectQuestions.forEach((q, qIdx) => {
            allQuestions.push({
              ...q,
              id: q.id || `${subject.id}-exam-${q.examtype || 'utme'}-${qIdx}`,
              globalIndex: globalIndex++,
              subjectId: subject.id,
              subjectIndex: subjectIdx,
            })
          })
        })
        
        set({
          examMode: 'full',
          selectedSubjects: subjects,
          questions: allQuestions,
          currentQuestionIndex: 0,
          currentSubjectIndex: 0,
          answers: {},
          markedForReview: [],
          timeRemaining: duration * 60,
          examStartTime: Date.now(),
          isExamActive: true,
          isExamSubmitted: false,
          showCalculator: false,
        })
      },
      
      setCurrentQuestion: (index) => {
        const questions = get().questions
        if (index >= 0 && index < questions.length) {
          const question = questions[index]
          set({
            currentQuestionIndex: index,
            currentSubjectIndex: question.subjectIndex || 0,
          })
        }
      },
      
      setCurrentSubject: (subjectIndex) => {
        const questions = get().questions
        const selectedSubjects = get().selectedSubjects
        
        if (subjectIndex >= 0 && subjectIndex < selectedSubjects.length) {
          const subject = selectedSubjects[subjectIndex]
          const firstQuestionOfSubject = questions.findIndex(q => q.subjectId === subject.id)
          
          if (firstQuestionOfSubject !== -1) {
            set({
              currentSubjectIndex: subjectIndex,
              currentQuestionIndex: firstQuestionOfSubject,
            })
          }
        }
      },
      
      answerQuestion: (questionIndex, answer) => {
        set((state) => ({
          answers: { ...state.answers, [questionIndex]: answer },
        }))
      },
      
      toggleMarkForReview: (questionIndex) => {
        set((state) => {
          const marked = state.markedForReview.includes(questionIndex)
          return {
            markedForReview: marked
              ? state.markedForReview.filter((i) => i !== questionIndex)
              : [...state.markedForReview, questionIndex],
          }
        })
      },
      
      updateTimeRemaining: (time) => set({ timeRemaining: time }),
      
      submitExam: () => {
        const state = get()
        const result = calculateResult(state)
        
        const examRecord = {
          id: Date.now(),
          mode: state.examMode,
          subjects: state.selectedSubjects.map(s => s.name),
          subjectIds: state.selectedSubjects.map(s => s.id),
          date: new Date().toISOString(),
          duration: Math.floor((Date.now() - state.examStartTime) / 1000),
          ...result,
        }
        
        set((state) => ({
          isExamActive: false,
          isExamSubmitted: true,
          examEndTime: Date.now(),
          currentExam: examRecord,
          showCalculator: false,
          [state.examMode === 'practice' ? 'practiceHistory' : 'examHistory']: [
            examRecord,
            ...(state.examMode === 'practice' ? state.practiceHistory : state.examHistory).slice(0, 49),
          ],
        }))
        
        return examRecord
      },
      
      resetExam: () => {
        set({
          currentExam: null,
          examMode: null,
          selectedSubjects: [],
          questions: [],
          currentQuestionIndex: 0,
          currentSubjectIndex: 0,
          answers: {},
          markedForReview: [],
          timeRemaining: 0,
          examStartTime: null,
          examEndTime: null,
          isExamActive: false,
          isExamSubmitted: false,
          showCalculator: false,
        })
      },
      
      clearAllData: () => {
        set({
          practiceHistory: [],
          examHistory: [],
          bookmarkedQuestions: [],
          notifications: [],
          currentExam: null,
          examMode: null,
          selectedSubjects: [],
          questions: [],
          currentQuestionIndex: 0,
          currentSubjectIndex: 0,
          answers: {},
          markedForReview: [],
          timeRemaining: 0,
          examStartTime: null,
          examEndTime: null,
          isExamActive: false,
          isExamSubmitted: false,
          showCalculator: false,
        })
      },
      
      setOnlineStatus: (isOnline) => set({ isOnline }),
      
      addNotification: (notification) => {
        set((state) => ({
          notifications: [
            {
              id: Date.now(),
              timestamp: Date.now(),
              read: false,
              ...notification,
            },
            ...state.notifications.slice(0, 49),
          ],
        }))
      },
      
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }))
      },
      
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      },
      
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'jamb-cbt-storage',
      partialize: (state) => ({
        theme: state.theme,
        fontSize: state.fontSize,
        timerEnabled: state.timerEnabled,
        soundEnabled: state.soundEnabled,
        vibrationEnabled: state.vibrationEnabled,
        calculatorEnabled: state.calculatorEnabled,
        practiceHistory: state.practiceHistory,
        examHistory: state.examHistory,
        bookmarkedQuestions: state.bookmarkedQuestions,
        notifications: state.notifications,
      }),
    }
  )
)

function calculateResult(state) {
  const { questions, answers, selectedSubjects } = state
  
  let totalCorrect = 0
  let totalWrong = 0
  let totalUnanswered = 0
  
  const subjectResults = {}
  
  selectedSubjects.forEach((subject) => {
    subjectResults[subject.id] = {
      name: subject.name,
      total: 0,
      correct: 0,
      wrong: 0,
      unanswered: 0,
      score: 0,
    }
  })
  
  questions.forEach((question, index) => {
    const userAnswer = answers[index]
    const subjectId = question.subjectId
    
    subjectResults[subjectId].total++
    
    if (userAnswer === undefined || userAnswer === null) {
      totalUnanswered++
      subjectResults[subjectId].unanswered++
    } else if (userAnswer === question.answer) {
      totalCorrect++
      subjectResults[subjectId].correct++
    } else {
      totalWrong++
      subjectResults[subjectId].wrong++
    }
  })
  
  Object.keys(subjectResults).forEach((subjectId) => {
    const result = subjectResults[subjectId]
    result.score = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0
  })
  
  const totalQuestions = questions.length
  const overallScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  
  return {
    totalQuestions,
    totalCorrect,
    totalWrong,
    totalUnanswered,
    overallScore,
    subjectResults,
  }
}

export default useStore
