import { useRequestStore } from '../../store/requestStore'

const getStatusColor = (status: number) => {
  if (status >= 200 && status < 300) return 'bg-green-900 text-green-400'
  if (status >= 300 && status < 400) return 'bg-yellow-900 text-yellow-400'
  if (status >= 400 && status < 500) return 'bg-red-900 text-red-400'
  return 'bg-red-900 text-red-400'
}

const formatJSON = (data: unknown): string => {
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}

const colorizeJSON = (json: string): string => {
  return json
    .replace(/(".*?")(:\s*)/g, '<span class="text-blue-300">$1</span>$2')
    .replace(/:\s*(".*?")/g, ': <span class="text-green-300">$1</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-yellow-300">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span class="text-orange-300">$1</span>')
    .replace(/:\s*(null)/g, ': <span class="text-gray-500">$1</span>')
}

function ResponsePanel() {
  const { response, loading, error } = useRequestStore()

  return (
    <div className="flex-1 overflow-hidden flex flex-col">

      {/* Response Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-800">
        <span className="text-sm text-gray-400 font-medium">Response</span>

        {response && (
          <>
            <span className={`text-xs px-2 py-0.5 rounded font-bold ${getStatusColor(response.status)}`}>
              {response.status} {response.statusText}
            </span>
            <span className="text-xs text-gray-500">{response.time} ms</span>
            <span className="text-xs text-gray-500">{response.size}</span>

            {/* Copy button */}
            <button
              onClick={() => navigator.clipboard.writeText(formatJSON(response.data))}
              className="ml-auto text-xs text-gray-500 hover:text-gray-300 bg-gray-800 px-3 py-1 rounded"
            >
              Copy
            </button>
          </>
        )}
      </div>

      {/* Response Body */}
      <div className="flex-1 overflow-auto p-4">

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400">Sending request...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-900/30 border border-red-800 rounded-xl p-4">
            <p className="text-red-400 font-semibold mb-1">Request Failed</p>
            <p className="text-red-300 text-sm font-mono">{error}</p>
            <p className="text-gray-500 text-xs mt-2">
              Check the URL is correct and the server is running
            </p>
          </div>
        )}

        {/* Response */}
        {response && !loading && (
          <pre
            className="text-sm font-mono text-gray-300 whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: colorizeJSON(formatJSON(response.data)) }}
          />
        )}

        {/* Empty State */}
        {!response && !loading && !error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400 font-medium">Send a request to see the response</p>
              <p className="text-gray-600 text-sm mt-1">Enter a URL above and click Send</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ResponsePanel