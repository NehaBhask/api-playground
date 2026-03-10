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

// GET stats
router.get('/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const history = await History.find({ userId })

    const totalRequests = history.length
    const successCount = history.filter(h => h.status >= 200 && h.status < 300).length
    const failCount = history.filter(h => h.status >= 400).length
    const successRate = totalRequests === 0 ? 0 : Math.round((successCount / totalRequests) * 100)
    const avgResponseTime = totalRequests === 0 ? 0 :
      Math.round(history.reduce((sum, h) => sum + (h.responseTime || 0), 0) / totalRequests)

    // Most used methods
    const methodCounts: Record<string, number> = {}
    history.forEach(h => {
      methodCounts[h.method] = (methodCounts[h.method] || 0) + 1
    })

    // Most called URLs (top 5)
    const urlCounts: Record<string, number> = {}
    history.forEach(h => {
      urlCounts[h.url] = (urlCounts[h.url] || 0) + 1
    })
    const topUrls = Object.entries(urlCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([url, count]) => ({ url, count }))

    res.json({
      totalRequests,
      successCount,
      failCount,
      successRate,
      avgResponseTime,
      methodCounts,
      topUrls
    })
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' })
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