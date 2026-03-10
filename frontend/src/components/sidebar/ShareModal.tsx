import { useState } from 'react'
import client from '../../api/client'

interface Props {
  collection: { _id: string; name: string; isShared?: boolean; shareId?: string }
  onClose: () => void
  onUpdate: () => void
}

function ShareModal({ collection, onClose, onUpdate }: Props) {
  const [shareId, setShareId] = useState(collection.shareId || null)
  const [isShared, setIsShared] = useState(collection.isShared || false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = `${window.location.origin}/import/${shareId}`

  const handleShare = async () => {
    setLoading(true)
    try {
      const res = await client.post(`/api/collections/${collection._id}/share`)
      setShareId(res.data.shareId)
      setIsShared(true)
      onUpdate()
    } catch (err) {
      console.error('Failed to share:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUnshare = async () => {
    setLoading(true)
    try {
      await client.post(`/api/collections/${collection._id}/unshare`)
      setShareId(null)
      setIsShared(false)
      onUpdate()
    } catch (err) {
      console.error('Failed to unshare:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">Share Collection</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
        </div>

        {/* Collection name */}
        <div className="bg-gray-800 rounded-xl px-4 py-3 mb-6">
          <p className="text-xs text-gray-500 mb-1">Collection</p>
          <p className="text-white font-semibold">{collection.name}</p>
        </div>

        {!isShared ? (
          <>
            <p className="text-gray-400 text-sm mb-4">
              Generate a public link so anyone can view and import this collection into their account.
            </p>
            <button
              onClick={handleShare}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm"
            >
              {loading ? 'Generating...' : 'Generate Share Link'}
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-3">
              Anyone with this link can view and import this collection:
            </p>

            {/* Share URL */}
            <div className="flex gap-2 mb-4">
              <input
                value={shareUrl}
                readOnly
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <button
              onClick={handleUnshare}
              disabled={loading}
              className="w-full bg-red-900/40 hover:bg-red-900/60 border border-red-800 text-red-400 py-2 rounded-xl text-sm font-medium"
            >
              {loading ? 'Disabling...' : 'Disable Share Link'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ShareModal