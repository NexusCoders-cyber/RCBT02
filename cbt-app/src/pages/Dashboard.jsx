import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Rocket, BookOpen, TrendingUp, 
  Trophy, GraduationCap, Bookmark, ChevronRight, Sparkles, Book
} from 'lucide-react'
import useStore from '../store/useStore'
import Dictionary from '../components/Dictionary'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const FeatureCard = ({ to, icon: Icon, title, description, bgColor, textColor, iconBg }) => (
  <Link to={to} className="block group">
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${bgColor} rounded-2xl p-5 h-full transition-all duration-300 group-hover:shadow-lg`}
    >
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-6 h-6 ${textColor}`} />
      </div>
      <h3 className={`font-bold ${textColor} text-lg mb-1`}>{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{description}</p>
    </motion.div>
  </Link>
)

export default function Dashboard() {
  const { practiceHistory, examHistory, bookmarkedQuestions } = useStore()
  const [showDictionary, setShowDictionary] = useState(false)

  const recentExams = [...practiceHistory, ...examHistory]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  const totalPractice = practiceHistory.length
  const totalExams = examHistory.length
  const totalQuestionsPracticed = recentExams.reduce((sum, e) => sum + e.totalQuestions, 0)
  const averageScore = recentExams.length > 0
    ? Math.round(recentExams.reduce((sum, e) => sum + e.overallScore, 0) / recentExams.length)
    : 0

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 p-6">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-white/90 text-sm font-medium">SCORE: {averageScore > 0 ? `${averageScore}%` : 'Start practicing!'}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Welcome to JAMB CBT</h2>
              <p className="text-white/80 text-sm">Master your UTME preparation</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-20">
              <GraduationCap className="w-32 h-32 text-white" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <FeatureCard
              to="/practice"
              icon={Rocket}
              title="Practice For UTME"
              description={`With ${totalQuestionsPracticed > 0 ? totalQuestionsPracticed.toLocaleString() + '+' : '33,550'} questions offline`}
              bgColor="bg-green-100 dark:bg-green-900/30"
              textColor="text-green-700 dark:text-green-400"
              iconBg="bg-green-200 dark:bg-green-800/50"
            />
            <FeatureCard
              to="/exam-setup"
              icon={BookOpen}
              title="Full Exam Mode"
              description="JAMB style exam simulation"
              bgColor="bg-pink-100 dark:bg-pink-900/30"
              textColor="text-pink-700 dark:text-pink-400"
              iconBg="bg-pink-200 dark:bg-pink-800/50"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <FeatureCard
              to="/analytics"
              icon={TrendingUp}
              title="Analytics & History"
              description="Track your progress and results"
              bgColor="bg-cyan-100 dark:bg-cyan-900/30"
              textColor="text-cyan-700 dark:text-cyan-400"
              iconBg="bg-cyan-200 dark:bg-cyan-800/50"
            />
            <FeatureCard
              to="/settings"
              icon={GraduationCap}
              title="Settings"
              description="Customize your experience"
              bgColor="bg-amber-100 dark:bg-amber-900/30"
              textColor="text-amber-700 dark:text-amber-400"
              iconBg="bg-amber-200 dark:bg-amber-800/50"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <Link to="/bookmarks" className="block group">
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 h-full transition-all duration-300 group-hover:shadow-lg border border-amber-200 dark:border-amber-800/30">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 bg-amber-100 dark:bg-amber-800/50 rounded-xl flex items-center justify-center">
                    <Bookmark className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-700 dark:text-amber-400 text-lg">Bookmarks</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      {bookmarkedQuestions.length > 0 
                        ? `${bookmarkedQuestions.length} saved` 
                        : 'Saved questions'}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            <button onClick={() => setShowDictionary(true)} className="block group text-left">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 h-full transition-all duration-300 group-hover:shadow-lg border border-indigo-200 dark:border-indigo-800/30">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-800/50 rounded-xl flex items-center justify-center">
                    <Book className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-700 dark:text-indigo-400 text-lg">Dictionary</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Search word meanings</p>
                  </div>
                </div>
              </div>
            </button>
          </motion.div>

          {recentExams.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                <Link to="/analytics" className="text-emerald-400 text-sm font-medium hover:underline flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentExams.map((exam) => (
                  <motion.div 
                    key={exam.id} 
                    whileHover={{ scale: 1.01 }}
                    className="bg-slate-800 rounded-xl p-4 border border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                          ${exam.mode === 'full' 
                            ? 'bg-emerald-900/50' 
                            : 'bg-blue-900/50'
                          }`}>
                          {exam.mode === 'full' 
                            ? <Trophy className="w-6 h-6 text-emerald-400" />
                            : <BookOpen className="w-6 h-6 text-blue-400" />
                          }
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {exam.mode === 'full' ? 'Full Exam' : exam.subjects[0]}
                          </p>
                          <p className="text-sm text-slate-400">
                            {new Date(exam.date).toLocaleDateString()} • {Math.round(exam.duration / 60)} mins
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${
                          exam.overallScore >= 70 ? 'text-emerald-400' :
                          exam.overallScore >= 50 ? 'text-amber-400' :
                          'text-red-400'
                        }`}>
                          {exam.overallScore}%
                        </p>
                        <p className="text-sm text-slate-400">
                          {exam.totalCorrect}/{exam.totalQuestions}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="pt-4">
            <p className="text-center text-slate-500 text-sm">
              Powered by ALOC API
            </p>
          </motion.div>
        </motion.div>
      </div>
      <Dictionary isOpen={showDictionary} onClose={() => setShowDictionary(false)} />
    </div>
  )
}
