import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth'
import RequestModel from '../models/Request'

const router = Router()

// POST save request
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { name, method, url, headers, params, body, collectionId } = req.body
    const request = await RequestModel.create({
      userId, name, method, url, headers, params, body,
      collectionId: collectionId || null
    })
    res.status(201).json({ request })
  } catch {
    res.status(500).json({ error: 'Failed to save request' })
  }
})

// PUT update request
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const request = await RequestModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ request })
  } catch {
    res.status(500).json({ error: 'Failed to update' })
  }
})

// DELETE request
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await RequestModel.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted!' })
  } catch {
    res.status(500).json({ error: 'Failed to delete' })
  }
})

export default router