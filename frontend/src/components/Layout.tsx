import { useState } from 'react'
import Sidebar from './sidebar/Sidebar'
import RequestPanel from './request/RequestPanel'
import ResponsePanel from './response/ResponsePanel'
import EnvironmentManager from './environment/EnvironmentManager'
import { useRequestStore } from '../store/requestStore'
import { useNavigate } from 'react-router-dom'
function Layout() {

  const navigate = useNavigate()

  const [showEnvManager, setShowEnvManager] = useState(false)
  const { activeEnvironment } = useRequestStore()
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-800 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar with environment selector */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-950">
          <button
            onClick={() => navigate('/stats')}
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg font-medium"
          >
            Stats
          </button>

          <button
            onClick={() => setShowEnvManager(true)}
            className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${activeEnvironment
                ? 'bg-green-900 text-green-300 border border-green-700'
                : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
          >
            Env {activeEnvironment ? activeEnvironment.name : 'No Environment'}
          </button>
        </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <RequestPanel />
        <ResponsePanel />
      </div>
    </div>
    {/* Environment Manager Modal */}
      {showEnvManager && (
        <EnvironmentManager onClose={() => setShowEnvManager(false)} />
      )} 
    </div>
  )
}

export default Layout