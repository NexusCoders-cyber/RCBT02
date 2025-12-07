import axios from 'axios'

const API_URL = import.meta.env.VITE_ALOC_API_URL || 'https://questions.aloc.com.ng/api/v2'
const ACCESS_TOKEN = import.meta.env.VITE_ALOC_ACCESS_TOKEN || ''

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

apiClient.interceptors.request.use((config) => {
  if (ACCESS_TOKEN) {
    config.headers['AccessToken'] = ACCESS_TOKEN
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message)
    return Promise.reject(error)
  }
)

const DB_NAME = 'jamb-cbt-offline'
const DB_VERSION = 1
const QUESTIONS_STORE = 'questions'

let db = null

async function openDB() {
  if (db) return db
  
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result
      if (!database.objectStoreNames.contains(QUESTIONS_STORE)) {
        database.createObjectStore(QUESTIONS_STORE, { keyPath: 'cacheKey' })
      }
    }
  })
}

async function getCachedQuestions(cacheKey) {
  try {
    const database = await openDB()
    return new Promise((resolve) => {
      const transaction = database.transaction(QUESTIONS_STORE, 'readonly')
      const store = transaction.objectStore(QUESTIONS_STORE)
      const request = store.get(cacheKey)
      
      request.onsuccess = () => {
        const result = request.result
        if (result && result.questions && result.questions.length > 0) {
          resolve(result.questions)
        } else {
          resolve(null)
        }
      }
      request.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

async function cacheQuestions(cacheKey, questions) {
  try {
    const database = await openDB()
    return new Promise((resolve) => {
      const transaction = database.transaction(QUESTIONS_STORE, 'readwrite')
      const store = transaction.objectStore(QUESTIONS_STORE)
      store.put({ cacheKey, questions, timestamp: Date.now() })
      transaction.oncomplete = () => resolve(true)
      transaction.onerror = () => resolve(false)
    })
  } catch {
    return false
  }
}

const questionCache = new Map()

const getCacheKey = (subject, count, year, type) => {
  return `${subject}-${count}-${year || 'all'}-${type || 'utme'}`
}

async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await apiClient.get(url)
      return response
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
    }
  }
}

export const alocAPI = {
  async getQuestion(subject, year = null) {
    try {
      let url = `/q?subject=${subject}&type=utme`
      if (year) {
        url += `&year=${year}`
      }
      const response = await fetchWithRetry(url, 2, 500)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch question: ${error.message}`)
    }
  },

  async getMultipleQuestions(subject, count = 40, year = null) {
    const cacheKey = getCacheKey(subject, count, year, 'utme')
    
    if (questionCache.has(cacheKey)) {
      const cached = questionCache.get(cacheKey)
      if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
        return cached.data
      }
    }
    
    try {
      let url = `/q/${count}?subject=${subject}&type=utme`
      if (year) {
        url += `&year=${year}`
      }
      
      const response = await fetchWithRetry(url, 3, 1000)
      const questions = response.data.data || response.data || []
      
      const formattedQuestions = Array.isArray(questions) 
        ? questions.map((q, index) => formatQuestion(q, index, subject))
        : [formatQuestion(questions, 0, subject)]
      
      questionCache.set(cacheKey, {
        data: formattedQuestions,
        timestamp: Date.now(),
      })
      
      await cacheQuestions(cacheKey, formattedQuestions)
      
      return formattedQuestions
    } catch (error) {
      const cachedData = await getCachedQuestions(cacheKey)
      if (cachedData) {
        return cachedData
      }
      throw new Error(`Failed to fetch questions: ${error.message}`)
    }
  },

  async getBulkQuestions(subject, count = 40) {
    const cacheKey = `bulk-${subject}-${count}`
    
    try {
      const url = `/m?subject=${subject}&type=utme`
      const response = await fetchWithRetry(url, 3, 1000)
      let questions = response.data.data || response.data || []
      
      if (!Array.isArray(questions)) {
        questions = [questions]
      }
      
      const formattedQuestions = questions
        .slice(0, count)
        .map((q, index) => formatQuestion(q, index, subject))
      
      await cacheQuestions(cacheKey, formattedQuestions)
      
      return formattedQuestions
    } catch (error) {
      const cachedData = await getCachedQuestions(cacheKey)
      if (cachedData) {
        return cachedData.slice(0, count)
      }
      throw new Error(`Failed to fetch bulk questions: ${error.message}`)
    }
  },

  async getSubjectMetrics() {
    try {
      const response = await apiClient.get('/metrics/subjects')
      return response.data
    } catch (error) {
      console.warn('Could not fetch metrics:', error.message)
      return null
    }
  },

  clearCache() {
    questionCache.clear()
  },
}

function formatQuestion(question, index, subject) {
  if (!question) return null
  
  const options = {}
  if (question.option) {
    options.a = question.option.a || ''
    options.b = question.option.b || ''
    options.c = question.option.c || ''
    options.d = question.option.d || ''
    if (question.option.e) {
      options.e = question.option.e
    }
  }
  
  return {
    id: question.id || index,
    index: index,
    question: question.question || '',
    options: options,
    answer: question.answer?.toLowerCase() || '',
    section: question.section || '',
    image: question.image || null,
    solution: question.solution || question.explanation || '',
    examtype: question.examtype || 'utme',
    examyear: question.examyear || '',
    subject: subject,
  }
}

export async function loadQuestionsForExam(subjects, onProgress = null) {
  const questionsMap = {}
  let loadedSubjects = 0
  
  for (const subject of subjects) {
    const isEnglish = subject.id === 'english'
    const count = isEnglish ? 60 : 40
    const cacheKey = `exam-${subject.id}-${count}`
    
    try {
      let questions = []
      
      try {
        questions = await alocAPI.getMultipleQuestions(subject.id, count)
      } catch {
        const cachedData = await getCachedQuestions(cacheKey)
        if (cachedData && cachedData.length > 0) {
          questions = cachedData
        }
      }
      
      if (questions.length < count) {
        try {
          const bulkQuestions = await alocAPI.getBulkQuestions(subject.id, count)
          const existingIds = new Set(questions.map(q => q.id))
          
          bulkQuestions.forEach(q => {
            if (!existingIds.has(q.id) && questions.length < count) {
              questions.push(q)
              existingIds.add(q.id)
            }
          })
        } catch {
          const bulkCacheKey = `bulk-${subject.id}-${count}`
          const cachedBulk = await getCachedQuestions(bulkCacheKey)
          if (cachedBulk) {
            const existingIds = new Set(questions.map(q => q.id))
            cachedBulk.forEach(q => {
              if (!existingIds.has(q.id) && questions.length < count) {
                questions.push(q)
                existingIds.add(q.id)
              }
            })
          }
        }
      }
      
      if (questions.length > 0) {
        await cacheQuestions(cacheKey, questions)
      }
      
      questionsMap[subject.id] = questions.slice(0, count)
      loadedSubjects++
      
      if (onProgress) {
        onProgress({
          loaded: loadedSubjects,
          total: subjects.length,
          subject: subject.name,
          questionCount: questions.length,
        })
      }
    } catch (error) {
      console.error(`Error loading questions for ${subject.name}:`, error)
      
      const cachedData = await getCachedQuestions(cacheKey)
      if (cachedData && cachedData.length > 0) {
        questionsMap[subject.id] = cachedData.slice(0, count)
      } else {
        questionsMap[subject.id] = []
      }
    }
  }
  
  return questionsMap
}

export async function loadPracticeQuestions(subject, count = 40, year = null) {
  const cacheKey = `practice-${subject.id}-${count}-${year || 'all'}`
  
  try {
    let questions = await alocAPI.getMultipleQuestions(subject.id, count, year)
    
    if (questions.length < count) {
      try {
        const bulkQuestions = await alocAPI.getBulkQuestions(subject.id, count)
        const existingIds = new Set(questions.map(q => q.id))
        
        bulkQuestions.forEach(q => {
          if (!existingIds.has(q.id) && questions.length < count) {
            questions.push(q)
          }
        })
      } catch {
        // Ignore bulk fetch errors
      }
    }
    
    if (questions.length > 0) {
      await cacheQuestions(cacheKey, questions)
    }
    
    return questions.slice(0, count)
  } catch (error) {
    const cachedData = await getCachedQuestions(cacheKey)
    if (cachedData && cachedData.length > 0) {
      return cachedData.slice(0, count)
    }
    
    console.error(`Error loading practice questions:`, error)
    throw error
  }
}

export async function searchDictionary(word) {
  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      timeout: 10000,
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Word not found in dictionary')
    }
    throw new Error('Failed to search dictionary. Please try again.')
  }
}

export async function checkOnlineStatus() {
  return navigator.onLine
}

export default alocAPI
