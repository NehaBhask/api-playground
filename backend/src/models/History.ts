import mongoose from 'mongoose'

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  method: String,
  url: String,
  status: Number,
  statusText: String,
  responseTime: Number,
  size: String,
  headers: Array,
  params: Array,
  body: String,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('History', historySchema)