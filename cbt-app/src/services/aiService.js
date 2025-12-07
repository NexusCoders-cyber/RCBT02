const GROK_API_KEY = import.meta.env.VITE_GROK_API_KEY || ''
const CEREBRAS_API_KEY = import.meta.env.VITE_CEREBRAS_API_KEY || ''

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'

const DB_NAME = 'jamb-cbt-offline'
const DB_VERSION = 2
const AI_CACHE_STORE = 'ai_cache'

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
      if (!database.objectStoreNames.contains('questions')) {
        database.createObjectStore('questions', { keyPath: 'cacheKey' })
      }
      if (!database.objectStoreNames.contains(AI_CACHE_STORE)) {
        database.createObjectStore(AI_CACHE_STORE, { keyPath: 'cacheKey' })
      }
    }
  })
}

async function getCachedResponse(cacheKey) {
  try {
    const database = await openDB()
    return new Promise((resolve) => {
      const transaction = database.transaction(AI_CACHE_STORE, 'readonly')
      const store = transaction.objectStore(AI_CACHE_STORE)
      const request = store.get(cacheKey)
      
      request.onsuccess = () => {
        const result = request.result
        if (result && result.response) {
          const cacheAge = Date.now() - result.timestamp
          if (cacheAge < 24 * 60 * 60 * 1000) {
            resolve(result.response)
            return
          }
        }
        resolve(null)
      }
      request.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

async function cacheResponse(cacheKey, response) {
  try {
    const database = await openDB()
    return new Promise((resolve) => {
      const transaction = database.transaction(AI_CACHE_STORE, 'readwrite')
      const store = transaction.objectStore(AI_CACHE_STORE)
      store.put({ cacheKey, response, timestamp: Date.now() })
      transaction.oncomplete = () => resolve(true)
      transaction.onerror = () => resolve(false)
    })
  } catch {
    return false
  }
}

const SYSTEM_PROMPT = `You are an educational AI assistant for a JAMB CBT (Computer-Based Test) practice application. Your role is to help Nigerian students prepare for their JAMB UTME examinations.

Your responsibilities:
1. Explain concepts from JAMB subjects (English, Mathematics, Physics, Chemistry, Biology, Literature, Government, Commerce, Accounting, Economics, CRK, IRK, Geography, Agricultural Science, History)
2. Help students understand difficult topics and questions
3. Provide clear, concise explanations suitable for secondary school students
4. Give study tips and exam strategies
5. Break down complex problems step by step
6. Relate concepts to everyday examples students can understand

Guidelines:
- Keep explanations clear and educational
- Use simple language appropriate for Nigerian secondary school students
- When explaining math/physics, show step-by-step solutions
- Encourage students and be supportive
- Focus only on educational content related to JAMB subjects
- If asked about non-educational topics, politely redirect to study-related matters
- Be culturally aware and use examples relevant to Nigerian students

Remember: You are here to help students learn and succeed in their JAMB examinations.`

export async function askAI(question, subject = null, context = null) {
  const cacheKey = `ai-${question.substring(0, 50)}-${subject || 'general'}`
  
  const cached = await getCachedResponse(cacheKey)
  if (cached) {
    return cached
  }
  
  if (!navigator.onLine) {
    throw new Error('You are offline. AI assistance requires an internet connection.')
  }
  
  if (!GROK_API_KEY) {
    throw new Error('AI service is not configured.')
  }
  
  let userMessage = question
  if (subject) {
    userMessage = `[Subject: ${subject}] ${question}`
  }
  if (context) {
    userMessage = `Context: ${context}\n\nQuestion: ${question}`
  }
  
  try {
    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-3-latest',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        stream: false,
        temperature: 0.7,
        max_tokens: 1000
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `AI request failed: ${response.status}`)
    }
    
    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'
    
    await cacheResponse(cacheKey, aiResponse)
    
    return aiResponse
  } catch (error) {
    if (error.message.includes('offline')) {
      throw error
    }
    throw new Error(`AI service error: ${error.message}`)
  }
}

export async function explainQuestion(question, options, correctAnswer, subject) {
  const optionsText = Object.entries(options)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
    .join('\n')
  
  const prompt = `Please explain this JAMB ${subject} question and why option "${correctAnswer.toUpperCase()}" is the correct answer:

Question: ${question}

Options:
${optionsText}

Correct Answer: ${correctAnswer.toUpperCase()}

Please provide:
1. A clear explanation of the concept being tested
2. Why the correct answer is right
3. Brief explanation of why other options are wrong
4. Any tips for remembering this type of question`

  return askAI(prompt, subject)
}

export async function getStudyTips(subject) {
  const prompt = `Give me 5 effective study tips specifically for preparing for JAMB ${subject}. Include practical advice that Nigerian students can apply immediately.`
  return askAI(prompt, subject)
}

export async function clarifyTopic(topic, subject) {
  const prompt = `Please explain the topic "${topic}" in ${subject} in a way that a Nigerian secondary school student preparing for JAMB would understand. Include examples where possible.`
  return askAI(prompt, subject)
}

export default {
  askAI,
  explainQuestion,
  getStudyTips,
  clarifyTopic
}
