import axios from 'axios'

interface RequestConfig {
  method: string
  url: string
  headers: { key: string; value: string; enabled: boolean }[]
  params: { key: string; value: string; enabled: boolean }[]
  body: string
  environment?: { key: string; value: string; enabled: boolean }[]
}

interface RequestResponse {
  status: number
  statusText: string
  data: unknown
  time: number
  size: string
  headers: Record<string, string>
}

const substituteVariables = (text: string, variables: { key: string; value: string; enabled: boolean }[]): string => {
  let result = text
  variables.forEach(v => {
    if (v.enabled && v.key) {
      result = result.replaceAll(`{{${v.key}}}`, v.value)
    }
  })
  return result
}

export const sendRequest = async (config: RequestConfig): Promise<RequestResponse> => {
  const { method, url, headers, params, body, environment=[] } = config

  const resolvedUrl = substituteVariables(url, environment)

  // Build headers object from enabled headers
  const headersObj: Record<string, string> = {}
  headers.forEach(h => {
    if (h.enabled && h.key.trim()) {
      headersObj[substituteVariables(h.key, environment)] = substituteVariables(h.value, environment)
    }
  })

  // Build params object from enabled params
  const paramsObj: Record<string, string> = {}
  params.forEach(p => {
    if (p.enabled && p.key.trim()) {
      paramsObj[substituteVariables(p.key, environment)] = substituteVariables(p.value, environment)
    }
  })

  // Parse body for non-GET requests
  let parsedBody = undefined
  if (method !== 'GET' && body.trim()) {
    const resolvedBody = substituteVariables(body, environment)
    try {
      parsedBody = JSON.parse(resolvedBody)
    } catch {
      parsedBody = resolvedBody
    }
  }

  const startTime = Date.now()

  const response = await axios({
    method: method.toLowerCase(),
    url: resolvedUrl,
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