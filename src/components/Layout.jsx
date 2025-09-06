import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Search, 
  Bell, 
  ChevronDown,
  User,
  Home,
  FileText,
  Menu,
  X
} from 'lucide-react'

const Layout = ({ children }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FileText }
  ]

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      <div className={`fixed inset-y-0 left-0 z-50 w-20 bg-white border-r border-secondary-200 flex flex-col items-center py-6 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-8">
          <img src="/Workstreamlogo.png" alt="WorkStream" className="w-8 h-8 rounded-lg" />
        </div>

        <nav className="flex-1 space-y-4">
          {navigation.map((item, index) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? 'bg-secondary-100 text-primary-600' 
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                }`
              }
              title={item.name}
            >
              <item.icon className="w-5 h-5" />
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col lg:ml-20">
        <header className="bg-white border-b border-secondary-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-8">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-secondary-100 transition-all duration-200"
              >
                <Menu className="w-5 h-5 text-secondary-600" />
              </button>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <img src="/Workstreamlogo.png" alt="WorkStream" className="h-6 sm:h-8 w-auto" />
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary-900">WorkStream</h1>
              </div>
              
              <div className="relative hidden sm:block">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search Something..."
                  className="pl-10 pr-4 py-2 sm:py-3 w-48 sm:w-64 lg:w-80 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-xl hover:bg-secondary-100 transition-all duration-200"
                >
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-600" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-primary-500 rounded-full"></span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-lg border border-secondary-200 z-50">
                    <div className="p-4 border-b border-secondary-200">
                      <h3 className="text-sm font-semibold text-secondary-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-4 hover:bg-secondary-50 border-b border-secondary-100">
                        <p className="text-sm text-secondary-900">New project assigned</p>
                        <p className="text-xs text-secondary-500 mt-1">2 hours ago</p>
                      </div>
                      <div className="p-4 hover:bg-secondary-50 border-b border-secondary-100">
                        <p className="text-sm text-secondary-900">Payment received</p>
                        <p className="text-xs text-secondary-500 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-xl hover:bg-secondary-100 transition-all duration-200"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center relative">
                    <span className="text-white text-xs sm:text-sm font-semibold">S</span>
                    <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-primary-500 rounded-full"></span>
                  </div>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-600 hidden sm:block" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-2xl shadow-lg border border-secondary-200 z-50">
                    <div className="p-4 border-b border-secondary-200">
                      <p className="text-sm font-medium text-secondary-900">ALJO</p>
                      <p className="text-xs text-secondary-500">aljo@example.com</p>
                    </div>
                    <div className="py-2">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {(notificationsOpen || profileOpen || sidebarOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:bg-transparent"
          onClick={() => {
            setNotificationsOpen(false)
            setProfileOpen(false)
            setSidebarOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default Layout
