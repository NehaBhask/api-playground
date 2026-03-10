import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth'
import Collection from '../models/Collection'
import RequestModel from '../models/Request'
import crypto from 'crypto'

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

//POST share a collection- generates a share link
router.post('/:id/share', authMiddleware, async (req: Request, res: Response) => {
  try {
    const shareId = crypto.randomBytes(8).toString('hex')
    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      { isShared: true, shareId },
      { returnDocument: 'after' }
    )
    res.json({ shareId: collection?.shareId })
  } catch {
    res.status(500).json({ error: 'Failed to share collection' })
  }
})

// POST unshare a collection
router.post('/:id/unshare', authMiddleware, async (req: Request, res: Response) => {
  try {
    await Collection.findByIdAndUpdate(req.params.id, { isShared: false, shareId: null })
    res.json({ message: 'Unshared!' })
  } catch {
    res.status(500).json({ error: 'Failed to unshare' })
  }
})

// GET shared collection by shareId — PUBLIC, no auth needed
router.get('/shared/:shareId', async (req: Request, res: Response) => {
  try {
    const collection = await Collection.findOne({
      shareId: req.params.shareId,
      isShared: true
    })
    if (!collection) return res.status(404).json({ error: 'Collection not found or no longer shared' })

    const requests = await RequestModel.find({ collectionId: collection._id })
    res.json({ collection, requests })
  } catch {
    res.status(500).json({ error: 'Failed to fetch shared collection' })
  }
})

router.post('/import/:shareId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    const original = await Collection.findOne({ shareId: req.params.shareId, isShared: true })
    if (!original) return res.status(404).json({ error: 'Collection not found' })

    const requests = await RequestModel.find({ collectionId: original._id })

    // Create new collection for this user
    const newCollection = await Collection.create({
      userId,
      name: `${original.name} (imported)`,
    })
    // Copy all requests
    await Promise.all(requests.map(r => RequestModel.create({
      userId,
      name: r.name,
      method: r.method,
      url: r.url,
      headers: r.headers,
      params: r.params,
      body: r.body,
      collectionId: newCollection._id
    })))

    res.json({ message: 'Collection imported!', collection: newCollection })
  } catch {
    res.status(500).json({ error: 'Failed to import collection' })
  }
})

export default router