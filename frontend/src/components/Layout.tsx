import Sidebar from './sidebar/Sidebar'
import RequestPanel from './request/RequestPanel'
import ResponsePanel from './response/ResponsePanel'

function Layout() {
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-800 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <RequestPanel />
        <ResponsePanel />
      </div>
    </div>
  )
}

export default Layout