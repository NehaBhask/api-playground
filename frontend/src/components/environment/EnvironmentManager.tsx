import { useState, useEffect } from 'react'
import client from '../../api/client'
import { useRequestStore } from '../../store/requestStore'

interface Variable {
  key: string
  value: string
  enabled: boolean
}

interface Environment {
  _id: string
  name: string
  variables: Variable[]
}

function EnvironmentManager({ onClose }: { onClose: () => void }) {
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [selected, setSelected] = useState<Environment | null>(null)
  const [newEnvName, setNewEnvName] = useState('')
  const [creating, setCreating] = useState(false)
  const { setActiveEnvironment, activeEnvironment } = useRequestStore()

  const fetchEnvironments = async () => {
    try {
      const res = await client.get('/api/environments')
      setEnvironments(res.data.environments)
      if (res.data.environments.length > 0 && !selected) {
        setSelected(res.data.environments[0])
      }
    } catch (err) {
      console.error('Failed to fetch environments:', err)
    }
  }

  useEffect(() => {
    fetchEnvironments()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreateEnv = async () => {
    if (!newEnvName.trim()) return
    setCreating(true)
    try {
      const res = await client.post('/api/environments', {
        name: newEnvName,
        variables: [{ key: '', value: '', enabled: true }]
      })
      setEnvironments([...environments, res.data.environment])
      setSelected(res.data.environment)
      setNewEnvName('')
    } catch (err) {
      console.error('Failed to create environment:', err)
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateVariables = async (variables: Variable[]) => {
    if (!selected) return
    try {
      const res = await client.put(`/api/environments/${selected._id}`, { variables })
      setSelected(res.data.environment)
      setEnvironments(environments.map(e =>
        e._id === selected._id ? res.data.environment : e
      ))
    } catch (err) {
      console.error('Failed to update variables:', err)
    }
  }

  const handleDeleteEnv = async (id: string) => {
    if (!confirm('Delete this environment?')) return
    await client.delete(`/api/environments/${id}`)
    const updated = environments.filter(e => e._id !== id)
    setEnvironments(updated)
    setSelected(updated[0] || null)
    if (activeEnvironment?._id === id) setActiveEnvironment(null)
  }

  const addVariable = () => {
    if (!selected) return
    const updated = [...selected.variables, { key: '', value: '', enabled: true }]
    setSelected({ ...selected, variables: updated })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateVariable = (i: number, field: 'key' | 'value' | 'enabled', value: any) => {
    if (!selected) return
    const updated = [...selected.variables]
    updated[i] = { ...updated[i], [field]: value }
    setSelected({ ...selected, variables: updated })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">Environments</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Left — Environment List */}
          <div className="w-48 border-r border-gray-800 p-3 flex flex-col gap-1 overflow-y-auto">
            {environments.map(env => (
              <div
                key={env._id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group ${
                  selected?._id === env._id ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'
                }`}
                onClick={() => setSelected(env)}
              >
                <span className="text-sm font-medium truncate">{env.name}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteEnv(env._id) }}
                  className="opacity-0 group-hover:opacity-100 text-red-400 text-xs ml-1"
                >
                  🗑️
                </button>
              </div>
            ))}

            {/* New Environment Input */}
            <div className="mt-2">
              <input
                value={newEnvName}
                onChange={(e) => setNewEnvName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateEnv()}
                placeholder="New environment..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleCreateEnv}
                disabled={creating}
                className="w-full mt-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-1.5 rounded-lg text-xs font-medium"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Right — Variables Editor */}
          <div className="flex-1 p-4 overflow-y-auto">
            {!selected ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600 text-sm">Create an environment to get started</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">{selected.name}</h3>
                  <div className="flex gap-2">
                    {/* Set Active button */}
                    <button
                      onClick={() => {
                        setActiveEnvironment(
                          activeEnvironment?._id === selected._id ? null : selected
                        )
                      }}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                        activeEnvironment?._id === selected._id
                          ? 'bg-green-700 text-green-200'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {activeEnvironment?._id === selected._id ? 'Active' : 'Set Active'}
                    </button>
                    {/* Save button */}
                    <button
                      onClick={() => handleUpdateVariables(selected.variables)}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Variable rows */}
                <div className="grid grid-cols-12 gap-2 mb-2 text-xs text-gray-500 px-1">
                  <div className="col-span-1"></div>
                  <div className="col-span-5">Key</div>
                  <div className="col-span-5">Value</div>
                </div>

                {selected.variables.map((variable, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={variable.enabled}
                        onChange={(e) => updateVariable(i, 'enabled', e.target.checked)}
                        className="accent-blue-500"
                      />
                    </div>
                    <input
                      value={variable.key}
                      onChange={(e) => updateVariable(i, 'key', e.target.value)}
                      placeholder="KEY"
                      className="col-span-5 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <input
                      value={variable.value}
                      onChange={(e) => updateVariable(i, 'value', e.target.value)}
                      placeholder="value"
                      className="col-span-5 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}

                <button
                  onClick={addVariable}
                  className="text-xs text-blue-400 hover:text-blue-300 mt-1"
                >
                  + Add Variable
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default EnvironmentManager