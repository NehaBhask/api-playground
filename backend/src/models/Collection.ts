import mongoose from 'mongoose'

const collectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  isShared: { type: Boolean, default: false },
  shareId: { type: String, default: null }, // unique share token
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Collection', collectionSchema)