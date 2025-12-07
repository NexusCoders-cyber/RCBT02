import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Sun, Moon, Clock, Volume2, Vibrate, Calculator,
  Type, Trash2, AlertTriangle, Check, Info
} from 'lucide-react'
import useStore from '../store/useStore'

export default function Settings() {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    timerEnabled,
    setTimerEnabled,
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    calculatorEnabled,
    setCalculatorEnabled,
    practiceHistory,
    examHistory,
    clearAllData,
  } = useStore()

  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [clearSuccess, setClearSuccess] = useState(false)

  const handleClearData = () => {
    clearAllData()
    setShowClearConfirm(false)
    setClearSuccess(true)
    setTimeout(() => setClearSuccess(false), 3000)
  }

  const totalSessions = practiceHistory.length + examHistory.length

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-slate-400">Customize your experience</p>
            </div>
          </div>

          {clearSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-800 flex items-center gap-3"
            >
              <Check className="w-5 h-5 text-emerald-400" />
              <p className="text-emerald-300">All data has been cleared successfully</p>
            </motion.div>
          )}

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Theme
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                  ${theme === 'light'
                    ? 'border-emerald-500 bg-emerald-900/30'
                    : 'border-slate-600 hover:border-slate-500'
                  }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-white">Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                  ${theme === 'dark'
                    ? 'border-emerald-500 bg-emerald-900/30'
                    : 'border-slate-600 hover:border-slate-500'
                  }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                  <Moon className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-white">Dark</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Type className="w-5 h-5" />
              Font Size
            </h2>
            <div className="flex gap-3">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                    ${fontSize === size
                      ? 'border-emerald-500 bg-emerald-900/30'
                      : 'border-slate-600 hover:border-slate-500'
                    }`}
                >
                  <span className={`font-medium text-white
                    ${size === 'small' ? 'text-sm' : size === 'large' ? 'text-xl' : 'text-base'}`}>
                    Aa
                  </span>
                  <span className="font-medium text-white capitalize text-sm">{size}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 space-y-4 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-2">Exam Settings</h2>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-900/50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Timer</p>
                  <p className="text-sm text-slate-400">Show countdown timer during exams</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={timerEnabled}
                  onChange={(e) => setTimerEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/50 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Calculator</p>
                  <p className="text-sm text-slate-400">Enable for calculation subjects</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={calculatorEnabled}
                  onChange={(e) => setCalculatorEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-900/50 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Sound</p>
                  <p className="text-sm text-slate-400">Play sounds for actions</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-900/50 flex items-center justify-center">
                  <Vibrate className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Vibration</p>
                  <p className="text-sm text-slate-400">Haptic feedback on mobile</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={vibrationEnabled}
                  onChange={(e) => setVibrationEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              Data Management
            </h2>
            
            <div className="p-4 rounded-xl bg-slate-700/50 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-5 h-5 text-blue-400" />
                <p className="font-medium text-white">Storage Info</p>
              </div>
              <p className="text-sm text-slate-400">
                You have <strong className="text-white">{totalSessions}</strong> exam sessions saved locally.
              </p>
            </div>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full p-4 rounded-xl border-2 border-red-800 bg-red-900/20 
                         text-red-300 font-medium hover:bg-red-900/40 
                         transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Clear All Data
            </button>
          </div>

          <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 rounded-2xl p-6 border border-slate-700">
            <h3 className="font-semibold text-white mb-2">About JAMB CBT Practice</h3>
            <p className="text-sm text-slate-400 mb-4">
              A modern CBT practice platform powered by the ALOC API. Practice JAMB questions 
              with official exam format and track your progress.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-slate-700 text-slate-300">
                Version 1.0.0
              </span>
              <a 
                href="https://questions.aloc.com.ng" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
              >
                ALOC API
              </a>
            </div>
          </div>
        </motion.div>

        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Clear All Data?</h3>
                  <p className="text-sm text-slate-400">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-slate-400 mb-6">
                This will permanently delete all your practice history, exam records, and saved progress. 
                Your settings will be reset to defaults.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearData}
                  className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
