import { create } from 'zustand'

interface Header { key: string; value: string; enabled: boolean }
interface Param { key: string; value: string; enabled: boolean }

interface Response {
  status: number
  statusText: string
  data: unknown
  time: number
  size: string
  headers: Record<string, string>
}

interface RequestStore {
  // Request state
  method: string
  url: string
  headers: Header[]
  params: Param[]
  body: string
  activeTab: string

  // Response state
  response: Response | null
  loading: boolean
  error: string | null

  // Actions
  setMethod: (method: string) => void
  setUrl: (url: string) => void
  setHeaders: (headers: Header[]) => void
  setParams: (params: Param[]) => void
  setBody: (body: string) => void
  setActiveTab: (tab: string) => void
  setResponse: (response: Response | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useRequestStore = create<RequestStore>((set) => ({
  method: 'GET',
  url: 'https://jsonplaceholder.typicode.com/posts',
  headers: [
    { key: 'Content-Type', value: 'application/json', enabled: true },
    { key: '', value: '', enabled: true },
  ],
  params: [{ key: '', value: '', enabled: true }],
  body: '{\n  \n}',
  activeTab: 'Params',
  response: null,
  loading: false,
  error: null,

  setMethod: (method) => set({ method }),
  setUrl: (url) => set({ url }),
  setHeaders: (headers) => set({ headers }),
  setParams: (params) => set({ params }),
  setBody: (body) => set({ body }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setResponse: (response) => set({ response }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))