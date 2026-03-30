import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import axios from 'axios'
import crypto from 'crypto'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => console.log('Collection Service: MongoDB connected!'))
  .catch(err => console.error('Collection Service: MongoDB failed:', err))

// Auth middleware — calls auth service to verify token
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

// Models
const headerSchema = new mongoose.Schema({ key: String, value: String, enabled: Boolean }, { _id: false })

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, default: 'Untitled Request' },
  method: { type: String, default: 'GET' },
  url: { type: String, required: true },
  headers: [headerSchema],
  params: [headerSchema],
  body: { type: String, default: '' },
  collectionId: { type: mongoose.Schema.Types.ObjectId, default: null },
  createdAt: { type: Date, default: Date.now }
})

const collectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  isShared: { type: Boolean, default: false },
  shareId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
})

const Collection = mongoose.model('Collection', collectionSchema)
const RequestModel = mongoose.model('Request', requestSchema)

// Health
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'collection-service' }))

// GET all collections
app.get('/', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId
  const collections = await Collection.find({ userId }).sort({ createdAt: -1 })
  const requests = await RequestModel.find({ userId }).sort({ createdAt: -1 })
  const result = collections.map(col => ({
    ...col.toObject(),
    requests: requests.filter(r => r.collectionId?.toString() === col._id.toString())
  }))
  const uncategorized = requests.filter(r => !r.collectionId)
  res.json({ collections: result, uncategorized })
})

// POST create collection
app.post('/', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId
  const { name } = req.body
  const collection = await Collection.create({ userId, name })
  res.status(201).json({ collection })
})

// DELETE collection
app.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  await Collection.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted!' })
})

// POST share collection
app.post('/:id/share', authMiddleware, async (req: Request, res: Response) => {
  const shareId = crypto.randomBytes(8).toString('hex')
  const collection = await Collection.findByIdAndUpdate(
    req.params.id,
    { isShared: true, shareId },
    { returnDocument: 'after' }
  )
  res.json({ shareId: collection?.shareId })
})

// POST unshare
app.post('/:id/unshare', authMiddleware, async (req: Request, res: Response) => {
  await Collection.findByIdAndUpdate(req.params.id, { isShared: false, shareId: null })
  res.json({ message: 'Unshared!' })
})

// GET shared collection (public)
app.get('/shared/:shareId', async (req: Request, res: Response) => {
  const collection = await Collection.findOne({ shareId: req.params.shareId, isShared: true })
  if (!collection) return res.status(404).json({ error: 'Not found' })
  const requests = await RequestModel.find({ collectionId: collection._id })
  res.json({ collection, requests })
})

// POST import shared collection
app.post('/import/:shareId', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId
  const original = await Collection.findOne({ shareId: req.params.shareId, isShared: true })
  if (!original) return res.status(404).json({ error: 'Not found' })
  const requests = await RequestModel.find({ collectionId: original._id })
  const newCollection = await Collection.create({ userId, name: `${original.name} (imported)` })
  await Promise.all(requests.map(r => RequestModel.create({
    userId, name: r.name, method: r.method, url: r.url,
    headers: r.headers, params: r.params, body: r.body,
    collectionId: newCollection._id
  })))
  res.json({ message: 'Imported!', collection: newCollection })
})

// POST save request
app.post('/requests', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId
  const { name, method, url, headers, params, body, collectionId } = req.body
  const request = await RequestModel.create({ userId, name, method, url, headers, params, body, collectionId: collectionId || null })
  res.status(201).json({ request })
})

// PUT update request
app.put('/requests/:id', authMiddleware, async (req: Request, res: Response) => {
  const request = await RequestModel.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' })
  res.json({ request })
})

// DELETE request
app.delete('/requests/:id', authMiddleware, async (req: Request, res: Response) => {
  await RequestModel.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted!' })
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => console.log(`Collection Service running on port ${PORT}`))