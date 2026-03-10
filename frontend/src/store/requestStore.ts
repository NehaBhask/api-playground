import { create } from 'zustand'

interface Header { key: string; value: string; enabled: boolean }
interface Param { key: string; value: string; enabled: boolean }
interface EnvVariable { key: string; value: string; enabled: boolean }

interface Environment {
  _id: string
  name: string
  variables: EnvVariable[]
}

interface Response {
  status: number
  statusText: string
  data: unknown
  time: number
  size: string
  headers: Record<string, string>
}

interface RequestStore {
  method: string
  url: string
  headers: Header[]
  params: Param[]
  body: string
  activeTab: string
  response: Response | null
  loading: boolean
  error: string | null
  savedRequestId: string | null
  requestName: string
  activeEnvironment: Environment | null

  setMethod: (method: string) => void
  setUrl: (url: string) => void
  setHeaders: (headers: Header[]) => void
  setParams: (params: Param[]) => void
  setBody: (body: string) => void
  setActiveTab: (tab: string) => void
  setResponse: (response: Response | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSavedRequestId: (id: string | null) => void
  setRequestName: (name: string) => void
  setActiveEnvironment: (env: Environment | null) => void
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
  savedRequestId: null,
  requestName: 'Untitled Request',
  activeEnvironment: null,

  setMethod: (method) => set({ method }),
  setUrl: (url) => set({ url }),
  setHeaders: (headers) => set({ headers }),
  setParams: (params) => set({ params }),
  setBody: (body) => set({ body }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setResponse: (response) => set({ response }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSavedRequestId: (id) => set({ savedRequestId: id }),
  setRequestName: (name) => set({ requestName: name }),
  setActiveEnvironment: (env) => set({ activeEnvironment: env }),
}))