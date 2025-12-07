import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Send, Bot, Loader2, Sparkles, 
  BookOpen, Lightbulb, HelpCircle, MessageSquare
} from 'lucide-react'
import { askAI, explainQuestion, getStudyTips, clarifyTopic } from '../services/aiService'
import useStore from '../store/useStore'

export default function AIAssistant({ isOpen, onClose, currentQuestion = null, currentSubject = null }) {
  const { isOnline } = useStore()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [quickAction, setQuickAction] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Hello! I'm Ilom, your JAMB study assistant. I can help you with:

• Explaining difficult concepts
• Breaking down JAMB questions
• Providing study tips
• Clarifying topics in any subject

How can I help you prepare for your exams today?`
      }])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await askAI(userMessage, currentSubject?.name)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Sorry, I couldn't process that request. ${error.message}` 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleExplainQuestion = async () => {
    if (!currentQuestion || isLoading) return

    setQuickAction('explain')
    setIsLoading(true)
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: 'Please explain this question to me.' 
    }])

    try {
      const response = await explainQuestion(
        currentQuestion.question,
        currentQuestion.options,
        currentQuestion.answer,
        currentSubject?.name || currentQuestion.subject || 'General'
      )
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Sorry, I couldn't explain this question. ${error.message}` 
      }])
    } finally {
      setIsLoading(false)
      setQuickAction(null)
    }
  }

  const handleStudyTips = async () => {
    if (isLoading) return

    const subject = currentSubject?.name || 'General Studies'
    setQuickAction('tips')
    setIsLoading(true)
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: `Give me study tips for ${subject}` 
    }])

    try {
      const response = await getStudyTips(subject)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Sorry, I couldn't get study tips. ${error.message}` 
      }])
    } finally {
      setIsLoading(false)
      setQuickAction(null)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat cleared. I\'m Ilom - how can I help you with your JAMB preparation?'
    }])
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-slate-800 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl h-[85vh] sm:h-[600px] flex flex-col border border-slate-700 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-gradient-to-r from-emerald-900/50 to-teal-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Ilom</h3>
                <p className="text-xs text-slate-400">
                  {isOnline ? 'Online' : 'Offline - Limited features'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors text-sm"
              >
                Clear
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {currentQuestion && (
            <div className="p-3 border-b border-slate-700 bg-slate-900/50">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExplainQuestion}
                  disabled={isLoading || !isOnline}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-900/50 text-emerald-400 text-sm font-medium hover:bg-emerald-900/70 transition-colors disabled:opacity-50"
                >
                  <Lightbulb className="w-4 h-4" />
                  Explain Question
                </button>
                <button
                  onClick={handleStudyTips}
                  disabled={isLoading || !isOnline}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-900/50 text-blue-400 text-sm font-medium hover:bg-blue-900/70 transition-colors disabled:opacity-50"
                >
                  <BookOpen className="w-4 h-4" />
                  Study Tips
                </button>
              </div>
            </div>
          )}

          {!currentQuestion && (
            <div className="p-3 border-b border-slate-700 bg-slate-900/50">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleStudyTips}
                  disabled={isLoading || !isOnline}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-900/50 text-blue-400 text-sm font-medium hover:bg-blue-900/70 transition-colors disabled:opacity-50"
                >
                  <BookOpen className="w-4 h-4" />
                  Study Tips
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-md'
                      : 'bg-slate-700 text-slate-100 rounded-bl-md'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-medium text-emerald-400">Ilom</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 p-4 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span className="text-sm text-slate-400">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-700 bg-slate-900/50">
            {!isOnline && (
              <p className="text-xs text-amber-400 mb-2 text-center">
                You are offline. AI features require internet connection.
              </p>
            )}
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your studies..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-700 text-white placeholder-slate-400 border border-slate-600 focus:border-emerald-500 focus:outline-none resize-none"
                rows={1}
                disabled={!isOnline}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || !isOnline}
                className="p-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
