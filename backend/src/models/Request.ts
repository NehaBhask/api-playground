import mongoose from 'mongoose'

const headerSchema = new mongoose.Schema({
  key: String,
  value: String,
  enabled: Boolean
}, { _id: false })

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, default: 'Untitled Request' },
  method: { type: String, default: 'GET' },
  url: { type: String, required: true },
  headers: [headerSchema],
  params: [headerSchema],
  body: { type: String, default: '' },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    default: null
  },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Request', requestSchema)