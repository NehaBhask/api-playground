import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => console.log('Auth Service: MongoDB connected!'))
  .catch(err => console.error('Auth Service: MongoDB failed:', err))

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})
const User = mongoose.model('User', userSchema)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' })
})

// Register
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email already registered' })
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// Verify token — called by other services
app.post('/verify', (req, res) => {
  try {
    const { token } = req.body
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
    res.json({ valid: true, userId: decoded.id })
  } catch {
    res.status(401).json({ valid: false, error: 'Invalid token' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`))