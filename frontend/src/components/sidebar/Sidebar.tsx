import { useState } from 'react'

const mockCollections = [
  {
    id: '1',
    name: 'GitHub API',
    requests: [
      { id: '1', method: 'GET', name: 'Get User' },
      { id: '2', method: 'GET', name: 'List Repos' },
    ]
  },
  {
    id: '2',
    name: 'Weather API',
    requests: [
      { id: '3', method: 'GET', name: 'Current Weather' },
    ]
  },
]

const methodColors: Record<string, string> = {
  GET: 'text-green-400',
  POST: 'text-blue-400',
  PUT: 'text-yellow-400',
  DELETE: 'text-red-400',
  PATCH: 'text-orange-400',
}

function Sidebar() {
  const [expanded, setExpanded] = useState<string[]>(['1'])

  const toggleCollection = (id: string) => {
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white">API Playground</h1>
      </div>

      {/* New Request Button */}
      <div className="p-3">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
          <span>+</span> New Request
        </button>
      </div>

      {/* Collections */}
      <div className="flex-1 overflow-y-auto px-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider px-2 mb-2">
          Collections
        </p>

        {mockCollections.map(collection => (
          <div key={collection.id} className="mb-1">
            {/* Collection Header */}
            <button
              onClick={() => toggleCollection(collection.id)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-800 text-left"
            >
              <span className="text-gray-400 text-xs">
                {expanded.includes(collection.id) ? '▼' : '▶'}
              </span>
              <span className="text-sm text-gray-300 font-medium">
                {collection.name}
              </span>
            </button>

            {/* Requests */}
            {expanded.includes(collection.id) && (
              <div className="ml-4">
                {collection.requests.map(req => (
                  <button
                    key={req.id}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800 text-left"
                  >
                    <span className={`text-xs font-bold w-12 ${methodColors[req.method]}`}>
                      {req.method}
                    </span>
                    <span className="text-sm text-gray-400">{req.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom - Login */}
      <div className="p-3 border-t border-gray-800">
        <button className="w-full text-gray-400 hover:text-white text-sm py-2 px-3 rounded-lg hover:bg-gray-800">
          Login / Sign Up
        </button>
      </div>
    </div>
  )
}

export default Sidebar