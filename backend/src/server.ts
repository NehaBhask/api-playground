import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './db'
import authRoutes from './routes/auth'
import collectionRoutes from './routes/collections'
import requestRoutes from './routes/requests'
import historyRoutes from './routes/history'
import environmentRoutes from './routes/environment'

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: ['http://localhost:5173','http://localhost:8080'] }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/collections', collectionRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/environments', environmentRoutes)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API Playground backend running!' })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})