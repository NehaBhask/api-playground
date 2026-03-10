import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth'
import Environment from '../models/Environment'

const router = Router()

// GET all environments
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const environments = await Environment.find({ userId }).sort({ createdAt: -1 })
    res.json({ environments })
  } catch {
    res.status(500).json({ error: 'Failed to fetch environments' })
  }
})

// POST create environment
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { name, variables } = req.body
    const environment = await Environment.create({ userId, name, variables: variables || [] })
    res.status(201).json({ environment })
  } catch {
    res.status(500).json({ error: 'Failed to create environment' })
  }
})

// PUT update environment
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const environment = await Environment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json({ environment })
  } catch {
    res.status(500).json({ error: 'Failed to update environment' })
  }
})

// DELETE environment
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await Environment.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted!' })
  } catch {
    res.status(500).json({ error: 'Failed to delete' })
  }
})

export default router