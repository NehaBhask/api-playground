import mongoose from 'mongoose'

const variableSchema = new mongoose.Schema({
  key: String,
  value: String,
  enabled: { type: Boolean, default: true }
}, { _id: false })

const environmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  variables: [variableSchema],
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Environment', environmentSchema)