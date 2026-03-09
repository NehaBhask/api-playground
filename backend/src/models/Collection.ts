import mongoose from 'mongoose'

const collectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Collection', collectionSchema)