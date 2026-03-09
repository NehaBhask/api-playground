import axios from 'axios'

interface RequestConfig {
  method: string
  url: string
  headers: { key: string; value: string; enabled: boolean }[]
  params: { key: string; value: string; enabled: boolean }[]
  body: string
}

interface RequestResponse {
  status: number
  statusText: string
  data: unknown
  time: number
  size: string
  headers: Record<string, string>
}

export const sendRequest = async (config: RequestConfig): Promise<RequestResponse> => {
  const { method, url, headers, params, body } = config

  // Build headers object from enabled headers
  const headersObj: Record<string, string> = {}
  headers.forEach(h => {
    if (h.enabled && h.key.trim()) {
      headersObj[h.key] = h.value
    }
  })

  // Build params object from enabled params
  const paramsObj: Record<string, string> = {}
  params.forEach(p => {
    if (p.enabled && p.key.trim()) {
      paramsObj[p.key] = p.value
    }
  })

  // Parse body for non-GET requests
  let parsedBody = undefined
  if (method !== 'GET' && body.trim()) {
    try {
      parsedBody = JSON.parse(body)
    } catch {
      parsedBody = body
    }
  }

  const startTime = Date.now()

  const response = await axios({
    method: method.toLowerCase(),
    url,
    headers: headersObj,
    params: paramsObj,
    data: parsedBody,
  })

  const time = Date.now() - startTime
  const responseStr = JSON.stringify(response.data)
  const size = responseStr.length > 1024
    ? `${(responseStr.length / 1024).toFixed(1)} KB`
    : `${responseStr.length} B`

  return {
    status: response.status,
    statusText: response.statusText,
    data: response.data,
    time,
    size,
    headers: response.headers as Record<string, string>,
  }
}