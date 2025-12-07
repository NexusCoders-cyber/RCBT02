import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import useStore from './store/useStore'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import SubjectSelect from './pages/SubjectSelect'
import PracticeSetup from './pages/PracticeSetup'
import ExamSetup from './pages/ExamSetup'
import Exam from './pages/Exam'
import Results from './pages/Results'
import Review from './pages/Review'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Bookmarks from './pages/Bookmarks'

function App() {
  const { theme, fontSize } = useStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg')
    switch (fontSize) {
      case 'small':
        document.documentElement.classList.add('text-sm')
        break
      case 'large':
        document.documentElement.classList.add('text-lg')
        break
      default:
        document.documentElement.classList.add('text-base')
    }
  }, [fontSize])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {})
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 transition-colors duration-300">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="practice" element={<SubjectSelect />} />
            <Route path="practice-setup" element={<PracticeSetup />} />
            <Route path="exam-setup" element={<ExamSetup />} />
            <Route path="exam" element={<Exam />} />
            <Route path="results" element={<Results />} />
            <Route path="review" element={<Review />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="bookmarks" element={<Bookmarks />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
