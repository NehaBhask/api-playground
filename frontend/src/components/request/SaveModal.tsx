import { useState } from 'react'
import client from '../../api/client'
import { useRequestStore } from '../../store/requestStore'

interface Props {
  onClose: () => void
  onSaved: () => void
  collections: { _id: string; name: string }[]
}

function SaveModal({ onClose, onSaved, collections }: Props) {
  const { method, url, headers, params, body, setRequestName, setSavedRequestId } = useRequestStore()
  const [name, setName] = useState('Untitled Request')
  const [collectionId, setCollectionId] = useState('')
  const [newCollection, setNewCollection] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      let finalCollectionId = collectionId

      // Create new collection if specified
      if (newCollection.trim()) {
        const colRes = await client.post('/api/collections', { name: newCollection })
        finalCollectionId = colRes.data.collection._id
      }

      const res = await client.post('/api/requests', {
        name,
        method,
        url,
        headers,
        params,
        body,
        collectionId: finalCollectionId || null
      })

      setSavedRequestId(res.data.request._id)
      setRequestName(name)
      onSaved()
      onClose()
    } catch (err) {
      console.error('Failed to save:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-white font-bold text-lg mb-4">Save Request</h2>

        {/* Request Name */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Request Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            placeholder="e.g. Get User Profile"
          />
        </div>

        {/* Collection */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Add to Collection</label>
          <select
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">No Collection</option>
            {collections.map(col => (
              <option key={col._id} value={col._id}>{col.name}</option>
            ))}
          </select>
        </div>

        {/* New Collection */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-1 block">
            Or Create New Collection
          </label>
          <input
            value={newCollection}
            onChange={(e) => setNewCollection(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            placeholder="e.g. GitHub API"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium"
          >
            {loading ? 'Saving...' : 'Save Request'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SaveModal