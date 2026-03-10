import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth'
import History from '../models/History'

const router = Router()

// GET history
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const history = await History.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50) // last 50 requests
    res.json({ history })
  } catch {
    res.status(500).json({ error: 'Failed to fetch history' })
  }
})

// POST save to history
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { method, url, status, statusText, responseTime, size, headers, params, body } = req.body
    const entry = await History.create({
      userId, method, url, status, statusText, responseTime, size, headers, params, body
    })
    res.status(201).json({ entry })
  } catch {
    res.status(500).json({ error: 'Failed to save history' })
  }
})

// DELETE all history
router.delete('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    await History.deleteMany({ userId })
    res.json({ message: 'History cleared!' })
  } catch {
    res.status(500).json({ error: 'Failed to clear history' })
  }
})

// DELETE single history entry
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await History.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted!' })
  } catch {
    res.status(500).json({ error: 'Failed to delete' })
  }
})

export default router