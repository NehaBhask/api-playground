import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import axios from 'axios'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => console.log('History Service: MongoDB connected!'))
  .catch(err => console.error('History Service: MongoDB failed:', err))

// Auth middleware
const authMiddleware = async (req: Request, res: Response, next: any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token' })
    const authRes = await axios.post(`${process.env.AUTH_SERVICE_URL}/verify`, { token })
    if (!authRes.data.valid) return res.status(401).json({ error: 'Invalid token' })
    ;(req as any).userId = authRes.data.userId
    next()
  } catch {
    res.status(401).json({ error: 'Auth failed' })
  }
}

// History Model
const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  method: String,
  url: String,
  status: Number,
  statusText: String,
  responseTime: Number,
  size: String,
  headers: Array,
  params: Array,
  body: String,
  createdAt: { type: Date, default: Date.now }
})
const History = mongoose.model('History', historySchema)

// Health
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'history-service' }))

// GET history
app.get('/', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId
  const history = await History.find({ userId }).sort({ createdAt: -1 }).limit(50)
  res.json({ history })
})

// GET stats
app.get('/stats', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId
  const history = await History.find({ userId })
  const totalRequests = history.length
  const successCount = history.filter(h => h.status >= 200 && h.status < 300).length
  const failCount = history.filter(h => h.status >= 400).length
  const successRate = totalRequests === 0 ? 0 : Math.round((successCount / totalRequests) * 100)
  const avgResponseTime = totalRequests === 0 ? 0 :
    Math.round(history.reduce((sum, h) => sum + (h.responseTime || 0), 0) / totalRequests)
  const methodCounts: Record<string, number> = {}
  history.forEach(h => { methodCounts[h.method] = (methodCounts[h.method] || 0) + 1 })
  const urlCounts: Record<string, number> = {}
  history.forEach(h => { urlCounts[h.url] = (urlCounts[h.url] || 0) + 1 })
  const topUrls = Object.entries(urlCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([url, count]) => ({ url, count }))
  res.json({ totalRequests, successCount, failCount, successRate, avgResponseTime, methodCounts, topUrls })
})

// POST save history
app.post('/', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId
  const { method, url, status, statusText, responseTime, size, headers, params, body } = req.body
  const entry = await History.create({ userId, method, url, status, statusText, responseTime, size, headers, params, body })
  res.status(201).json({ entry })
})

// DELETE all history
app.delete('/', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId
  await History.deleteMany({ userId })
  res.json({ message: 'Cleared!' })
})

// DELETE single entry
app.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  await History.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted!' })
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => console.log(`History Service running on port ${PORT}`))