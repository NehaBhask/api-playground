import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth'
import Collection from '../models/Collection'
import RequestModel from '../models/Request'

const router = Router()

// GET all collections with their requests
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const collections = await Collection.find({ userId }).sort({ createdAt: -1 })
    const requests = await RequestModel.find({ userId }).sort({ createdAt: -1 })

    const result = collections.map(col => ({
      ...col.toObject(),
      requests: requests.filter(r => r.collectionId?.toString() === col._id.toString())
    }))

    // Also get requests not in any collection
    const uncategorized = requests.filter(r => !r.collectionId)

    res.json({ collections: result, uncategorized })
  } catch {
    res.status(500).json({ error: 'Failed to fetch collections' })
  }
})

// POST create collection
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { name } = req.body
    const collection = await Collection.create({ userId, name })
    res.status(201).json({ collection })
  } catch {
    res.status(500).json({ error: 'Failed to create collection' })
  }
})

// DELETE collection
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await Collection.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted!' })
  } catch {
    res.status(500).json({ error: 'Failed to delete' })
  }
})

export default router