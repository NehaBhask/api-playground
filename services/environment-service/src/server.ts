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
  .then(() => console.log('Environment Service: MongoDB connected!'))
  .catch(err => console.error('Environment Service: MongoDB failed:', err))

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

// Environment Model
const variableSchema = new mongoose.Schema({ key: String, value: String, enabled: { type: Boolean, default: true } }, { _id: false })
const environmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  variables: [variableSchema],
  createdAt: { type: Date, default: Date.now }
})
const Environment = mongoose.model('Environment', environmentSchema)

// Health
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'environment-service' }))

// GET all environments
app.get('/', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId
  const environments = await Environment.find({ userId }).sort({ createdAt: -1 })
  res.json({ environments })
})

// POST create environment
app.post('/', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId
  const { name, variables } = req.body
  const environment = await Environment.create({ userId, name, variables: variables || [] })
  res.status(201).json({ environment })
})

// PUT update environment
app.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const environment = await Environment.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' })
  res.json({ environment })
})

// DELETE environment
app.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  await Environment.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted!' })
})

const PORT = process.env.PORT || 3004
app.listen(PORT, () => console.log(`Environment Service running on port ${PORT}`))