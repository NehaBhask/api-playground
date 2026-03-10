import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import client from '../api/client'

interface Request {
  _id: string
  name: string
  method: string
  url: string
}

const methodColors: Record<string, string> = {
  GET: 'text-green-400',
  POST: 'text-blue-400',
  PUT: 'text-yellow-400',
  DELETE: 'text-red-400',
  PATCH: 'text-orange-400',
}

function ImportPage() {
  const { shareId } = useParams()
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [collection, setCollection] = useState<any>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await client.get(`/api/collections/shared/${shareId}`)
        setCollection(res.data.collection)
        setRequests(res.data.requests)
      } catch {
        setError('Collection not found or link has expired.')
      } finally {
        setLoading(false)
      }
    }
    fetchShared()
  }, [shareId])

  const handleImport = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate(`/login?redirect=/import/${shareId}`)
      return
    }
    setImporting(true)
    try {
      await client.post(`/api/collections/import/${shareId}`)
      setImported(true)
    } catch {
      setError('Failed to import. Please try again.')
    } finally {
      setImporting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 text-lg">Loading collection...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 text-lg font-semibold">{error}</p>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-400 hover:text-blue-300 text-sm">
          Go to API Playground →
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">{collection?.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {requests.length} request{requests.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Requests list */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6 max-h-64 overflow-y-auto">
          {requests.length === 0 && (
            <p className="text-gray-600 text-sm text-center">No requests in this collection</p>
          )}
          {requests.map(req => (
            <div key={req._id} className="flex items-center gap-3 py-2 border-b border-gray-700 last:border-0">
              <span className={`text-xs font-bold w-14 ${methodColors[req.method] || 'text-gray-400'}`}>
                {req.method}
              </span>
              <div>
                <p className="text-white text-sm font-medium">{req.name}</p>
                <p className="text-gray-500 text-xs truncate">{req.url}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Import button */}
        {imported ? (
          <div className="text-center">
            <p className="text-green-400 font-semibold mb-4">Collection imported successfully!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold w-full"
            >
              Open API Playground →
            </button>
          </div>
        ) : (
          <button
            onClick={handleImport}
            disabled={importing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold"
          >
            {importing ? 'Importing...' : 'Import into My Account'}
          </button>
        )}

        <p className="text-center text-gray-600 text-xs mt-4">
          Only your account can see the imported collection
        </p>
      </div>
    </div>
  )
}

export default ImportPage