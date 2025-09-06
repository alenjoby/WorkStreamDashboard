import { useState } from 'react'
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown,
  Settings,
  LogOut,
  User
} from 'lucide-react'

const Header = ({ onMenuClick }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const notifications = [
    { id: 1, message: 'New project "E-commerce Website" assigned', time: '2 hours ago', type: 'project' },
    { id: 2, message: 'Payment received for "Mobile App Design"', time: '1 day ago', type: 'payment' },
    { id: 3, message: 'Deadline reminder: "Blog Redesign" due tomorrow', time: '2 days ago', type: 'reminder' },
  ]

  return (
    <header className="bg-white border-b border-secondary-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-100"
          >
            <Menu className="w-5 h-5 text-secondary-600" />
          </button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search projects, tasks..."
              className="pl-10 pr-4 py-2 w-64 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-secondary-100"
            >
              <Bell className="w-5 h-5 text-secondary-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-secondary-200 z-50">
                <div className="p-4 border-b border-secondary-200">
                  <h3 className="text-sm font-semibold text-secondary-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 hover:bg-secondary-50 border-b border-secondary-100 last:border-b-0">
                      <p className="text-sm text-secondary-900">{notification.message}</p>
                      <p className="text-xs text-secondary-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-secondary-200">
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-100"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-sm font-semibold">JD</span>
              </div>
              <ChevronDown className="w-4 h-4 text-secondary-600" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 z-50">
                <div className="p-4 border-b border-secondary-200">
                  <p className="text-sm font-medium text-secondary-900">John Doe</p>
                  <p className="text-xs text-secondary-500">john@example.com</p>
                </div>
                <div className="py-2">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                    <User className="w-4 h-4 mr-3" />
                    Profile Settings
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50">
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(notificationsOpen || profileOpen) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setNotificationsOpen(false)
            setProfileOpen(false)
          }}
        />
      )}
    </header>
  )
}

export default Header
