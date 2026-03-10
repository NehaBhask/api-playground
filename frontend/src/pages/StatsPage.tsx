import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'

interface Stats {
  totalRequests: number
  successCount: number
  failCount: number
  successRate: number
  avgResponseTime: number
  methodCounts: Record<string, number>
  topUrls: { url: string; count: number }[]
}

const methodColors: Record<string, string> = {
  GET: 'bg-green-900 text-green-400',
  POST: 'bg-blue-900 text-blue-400',
  PUT: 'bg-yellow-900 text-yellow-400',
  DELETE: 'bg-red-900 text-red-400',
  PATCH: 'bg-orange-900 text-orange-400',
}

function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await client.get('/api/history/stats')
        setStats(res.data)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Loading stats...</p>
    </div>
  )

  if (!stats) return null

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">API Stats</h1>
            <p className="text-gray-500 mt-1">Your API testing analytics</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm"
          >
            ← Back to Playground
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Requests', value: stats.totalRequests, color: 'border-blue-800' },
            { label: 'Success Rate', value: `${stats.successRate}%`, color: 'border-green-800' },
            { label: 'Failed', value: stats.failCount, color: 'border-red-800' },
            { label: 'Avg Response', value: `${stats.avgResponseTime}ms`, color: 'border-yellow-800' },
          ].map(stat => (
            <div key={stat.label} className={`bg-gray-900 border ${stat.color} rounded-2xl p-5`}>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Method Breakdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">HTTP Methods Used</h2>
            {Object.keys(stats.methodCounts).length === 0 ? (
              <p className="text-gray-600 text-sm">No requests yet</p>
            ) : (
              <div className="flex flex-col gap-3">
                {Object.entries(stats.methodCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([method, count]) => {
                    const pct = Math.round((count / stats.totalRequests) * 100)
                    return (
                      <div key={method}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${methodColors[method] || 'bg-gray-800 text-gray-400'}`}>
                            {method}
                          </span>
                          <span className="text-gray-400 text-sm">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>

          {/* Top URLs */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Most Called APIs</h2>
            {stats.topUrls.length === 0 ? (
              <p className="text-gray-600 text-sm">No requests yet</p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats.topUrls.map(({ url, count }, i) => (
                  <div key={url} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
                    <span className="text-gray-600 font-bold text-sm w-5">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 text-xs font-mono truncate">{url}</p>
                    </div>
                    <span className="text-blue-400 text-sm font-bold">{count}x</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Success vs Fail bar */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-6">
          <h2 className="text-lg font-bold mb-4">Success vs Failed Requests</h2>
          <div className="flex rounded-full overflow-hidden h-6 mb-3">
            {stats.totalRequests > 0 ? (
              <>
                <div
                  className="bg-green-600 flex items-center justify-center text-xs font-bold text-white transition-all"
                  style={{ width: `${stats.successRate}%` }}
                >
                  {stats.successRate > 10 ? `${stats.successRate}%` : ''}
                </div>
                <div
                  className="bg-red-600 flex items-center justify-center text-xs font-bold text-white transition-all"
                  style={{ width: `${100 - stats.successRate}%` }}
                >
                  {100 - stats.successRate > 10 ? `${100 - stats.successRate}%` : ''}
                </div>
              </>
            ) : (
              <div className="bg-gray-800 w-full" />
            )}
          </div>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-2 text-green-400">
              <span className="w-3 h-3 rounded-full bg-green-600 inline-block"></span>
              Success ({stats.successCount})
            </span>
            <span className="flex items-center gap-2 text-red-400">
              <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
              Failed ({stats.failCount})
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default StatsPage