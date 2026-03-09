import { useRequestStore } from '../../store/requestStore'
import { sendRequest } from '../../api/sendRequest'

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

const methodColors: Record<string, string> = {
  GET: 'text-green-400',
  POST: 'text-blue-400',
  PUT: 'text-yellow-400',
  PATCH: 'text-orange-400',
  DELETE: 'text-red-400',
}

const tabs = ['Params', 'Headers', 'Body']

function RequestPanel() {
  const {
    method, url, headers, params, body, activeTab,
    setMethod, setUrl, setHeaders, setParams, setBody, setActiveTab,
    setResponse, setLoading, setError, loading
  } = useRequestStore()

  const handleSend = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const result = await sendRequest({ method, url, headers, params, body })
      setResponse(result)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response) {
        // Server responded with error status
        setResponse({
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
          time: 0,
          size: '0 B',
          headers: err.response.headers,
        })
      } else {
        setError(err.message || 'Request failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const addHeader = () => setHeaders([...headers, { key: '', value: '', enabled: true }])
  const addParam = () => setParams([...params, { key: '', value: '', enabled: true }])

  return (
    <div className="border-b border-gray-800">

      {/* URL Bar */}
      <div className="flex items-center gap-2 p-3">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={`bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:border-blue-500 ${methodColors[method]}`}
        >
          {METHODS.map(m => (
            <option key={m} value={m} className="text-white">{m}</option>
          ))}
        </select>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Enter request URL..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-semibold min-w-[80px]"
        >
          {loading ? '...' : 'Send'}
        </button>

        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          Save
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 px-3">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-3 max-h-48 overflow-y-auto">

        {activeTab === 'Params' && (
          <div>
            <div className="grid grid-cols-12 gap-2 mb-2 text-xs text-gray-500 px-1">
              <div className="col-span-1"></div>
              <div className="col-span-5">Key</div>
              <div className="col-span-5">Value</div>
            </div>
            {params.map((param, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
                <div className="col-span-1">
                  <input type="checkbox" checked={param.enabled}
                    onChange={(e) => {
                      const updated = [...params]
                      updated[i].enabled = e.target.checked
                      setParams(updated)
                    }}
                    className="accent-blue-500"
                  />
                </div>
                <input value={param.key}
                  onChange={(e) => {
                    const updated = [...params]
                    updated[i].key = e.target.value
                    setParams(updated)
                  }}
                  placeholder="Key"
                  className="col-span-5 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
                <input value={param.value}
                  onChange={(e) => {
                    const updated = [...params]
                    updated[i].value = e.target.value
                    setParams(updated)
                  }}
                  placeholder="Value"
                  className="col-span-5 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
            <button onClick={addParam} className="text-xs text-blue-400 hover:text-blue-300 mt-1">
              + Add Parameter
            </button>
          </div>
        )}

        {activeTab === 'Headers' && (
          <div>
            <div className="grid grid-cols-12 gap-2 mb-2 text-xs text-gray-500 px-1">
              <div className="col-span-1"></div>
              <div className="col-span-5">Key</div>
              <div className="col-span-5">Value</div>
            </div>
            {headers.map((header, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
                <div className="col-span-1">
                  <input type="checkbox" checked={header.enabled}
                    onChange={(e) => {
                      const updated = [...headers]
                      updated[i].enabled = e.target.checked
                      setHeaders(updated)
                    }}
                    className="accent-blue-500"
                  />
                </div>
                <input value={header.key}
                  onChange={(e) => {
                    const updated = [...headers]
                    updated[i].key = e.target.value
                    setHeaders(updated)
                  }}
                  placeholder="Key"
                  className="col-span-5 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
                <input value={header.value}
                  onChange={(e) => {
                    const updated = [...headers]
                    updated[i].value = e.target.value
                    setHeaders(updated)
                  }}
                  placeholder="Value"
                  className="col-span-5 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
            <button onClick={addHeader} className="text-xs text-blue-400 hover:text-blue-300 mt-1">
              + Add Header
            </button>
          </div>
        )}

        {activeTab === 'Body' && (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter request body (JSON)..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono h-32 resize-none"
          />
        )}

      </div>
    </div>
  )
}

export default RequestPanel