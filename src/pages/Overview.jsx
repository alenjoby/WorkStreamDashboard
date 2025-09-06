import { useEffect, useMemo, useRef, useState } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Play,
  Pause
} from 'lucide-react'
import { useProjects } from '../contexts/ProjectsContext'

const Overview = () => {
  const [activeTab, setActiveTab] = useState('This Month')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newWork, setNewWork] = useState({ name: '', client: '', budget: '', deadline: '', progress: 0 })
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const startRef = useRef(null)
  
  // Use shared context for projects and clients
  const { projects, clients, addProjectAndUpdateClient } = useProjects()

  const earningsData = useMemo(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1)
      const monthName = date.toLocaleDateString('en-US', { month: 'short' })
      
      if (i === 0) {
        months.push({
          month: monthName,
          earnings: projects.reduce((sum, p) => sum + Number(p.budget || 0), 0)
        })
      } else {
        months.push({
          month: monthName,
          earnings: 0
        })
      }
    }
    
    return months
  }, [projects])

  useEffect(() => {
    const timerStr = localStorage.getItem('ws_timer')
    if (timerStr) {
      try {
        const t = JSON.parse(timerStr)
        setElapsedMs(t.elapsedMs || 0)
        if (t.isRunning && t.startTs) {
          startRef.current = t.startTs
          setIsRunning(true)
        }
      } catch {}
    }
  }, [])

  useEffect(() => {
    let id
    if (isRunning) {
      if (!startRef.current) startRef.current = Date.now()
      id = setInterval(() => {
        const base = Number(elapsedMs)
        const delta = Date.now() - startRef.current
        localStorage.setItem('ws_timer', JSON.stringify({ isRunning: true, startTs: startRef.current, elapsedMs: base }))
        setElapsedMs(base + delta)
      }, 1000)
    } else {
      localStorage.setItem('ws_timer', JSON.stringify({ isRunning: false, startTs: null, elapsedMs }))
      startRef.current = null
    }
    return () => { if (id) clearInterval(id) }
  }, [isRunning])

  const formattedTime = useMemo(() => {
    const totalSec = Math.floor(elapsedMs / 1000)
    const h = String(Math.floor(totalSec / 3600)).padStart(2, '0')
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0')
    const s = String(totalSec % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
  }, [elapsedMs])

  const handleStart = () => {
    if (!isRunning) {
      startRef.current = Date.now()
      setIsRunning(true)
    }
  }

  const handlePause = () => {
    if (isRunning) {
      setIsRunning(false)
    }
  }

  const handleAddWork = (e) => {
    e.preventDefault()
    if (!newWork.name || !newWork.client) return
    
    const budgetNum = Number(newWork.budget || 0)
    const proj = { 
      name: newWork.name,
      client: newWork.client,
      budget: isNaN(budgetNum) ? 0 : budgetNum,
      deadline: newWork.deadline || 'TBD',
      progress: Number(newWork.progress || 0)
    }
    
    addProjectAndUpdateClient(proj)
    setShowAddModal(false)
    setNewWork({ name: '', client: '', budget: '', deadline: '', progress: 0 })
  }

  const totalEarnings = useMemo(() => {
    return projects.reduce((sum, p) => sum + Number(p.budget || 0), 0)
  }, [projects])

  const activeClientsCount = useMemo(() => {
    return (clients || []).filter(c => c.status === 'active').length
  }, [clients])

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-secondary-200">
        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-2">Welcome back, ALJO!</h1>
        <p className="text-sm sm:text-base text-secondary-600">Here's what's happening with your freelance business today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-secondary-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-secondary-900">${totalEarnings.toLocaleString()}</div>
          <div className="text-xs sm:text-sm text-secondary-600">Total Earnings</div>
          <div className="text-xs text-green-600 font-medium mt-1">+12.5% from last month</div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-secondary-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-secondary-900">{activeClientsCount}</div>
          <div className="text-xs sm:text-sm text-secondary-600">Active Clients</div>
          <div className="text-xs text-blue-600 font-medium mt-1">+2 new this month</div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-secondary-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-secondary-900">{projects.filter(p => new Date(p.deadline) <= new Date(Date.now() + 7*24*60*60*1000)).length}</div>
          <div className="text-xs sm:text-sm text-secondary-600">Tasks Due</div>
          <div className="text-xs text-orange-600 font-medium mt-1">Due within 7 days</div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-secondary-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-secondary-900">{projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + Number(p.progress || 0), 0) / projects.length) : 0}%</div>
          <div className="text-xs sm:text-sm text-secondary-600">Completion Rate</div>
          <div className="text-xs text-purple-600 font-medium mt-1">Average progress</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-secondary-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <h3 className="text-base sm:text-lg font-semibold text-secondary-900">Monthly Earnings</h3>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button 
              onClick={() => setActiveTab('This Week')}
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'This Week' ? 'bg-primary-100 text-primary-600' : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              This Week
            </button>
            <button 
              onClick={() => setActiveTab('This Month')}
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'This Month' ? 'bg-primary-100 text-primary-600' : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              This Month
            </button>
            <button 
              onClick={() => setActiveTab('This Year')}
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'This Year' ? 'bg-primary-100 text-primary-600' : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              This Year
            </button>
          </div>
        </div>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Area type="monotone" dataKey="earnings" stroke="#ef4444" fillOpacity={1} fill="url(#colorEarnings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-secondary-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <h3 className="text-base sm:text-lg font-semibold text-secondary-900">Active Projects</h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button onClick={() => setShowAddModal(true)} className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium">Add New Work</button>
            <a href="/projects" className="text-sm text-primary-600 hover:text-primary-700 font-medium text-center sm:text-left">View All Projects</a>
          </div>
        </div>
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-8 text-secondary-500">
              <p>No projects yet. Click "Add New Work" to get started!</p>
            </div>
          ) : (
            projects.map((project, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-secondary-50 rounded-xl space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                    <h4 className="font-medium text-secondary-900 text-sm sm:text-base">{project.name}</h4>
                    <span className="text-xs text-secondary-500">for {project.client}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2">
                    <span className="text-xs sm:text-sm text-secondary-600">Budget: ${project.budget.toLocaleString()}</span>
                    <span className="text-xs sm:text-sm text-secondary-600">Due: {project.deadline}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:block sm:text-right">
                  <div className="text-sm font-medium text-secondary-900">{project.progress}%</div>
                  <div className="w-20 sm:w-24 bg-secondary-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        project.progress >= 80 ? 'bg-green-500' : 
                        project.progress >= 50 ? 'bg-blue-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-secondary-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <h3 className="text-base sm:text-lg font-semibold text-secondary-900">Recent Clients</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium text-center sm:text-left">
            View All Clients
          </button>
        </div>
        <div className="space-y-4">
          {clients.length === 0 ? (
            <div className="text-center py-8 text-secondary-500">
              <p>No clients yet. Add a project to see clients here!</p>
            </div>
          ) : (
            clients.map((client, index) => (
              <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-secondary-50 rounded-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-semibold">{client.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <h4 className="font-medium text-secondary-900 text-sm sm:text-base truncate">{client.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full self-start ${
                      client.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-secondary-600 mt-1">
                    {client.projects} projects • ${client.totalPaid.toLocaleString()} total paid
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-secondary-200">
        <h3 className="text-base sm:text-lg font-semibold text-secondary-900 mb-4">Time Tracker</h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <div className="text-2xl sm:text-3xl font-bold text-secondary-900">{formattedTime}</div>
            <div className="text-xs sm:text-sm text-secondary-600">Current Session</div>
          </div>
          <div className="flex items-center justify-center sm:justify-end space-x-3 sm:space-x-4">
            <button onClick={handleStart} className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors">
              <Play className="w-4 h-4" />
              <span className="text-sm">Start</span>
            </button>
            <button onClick={handlePause} className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors">
              <Pause className="w-4 h-4" />
              <span className="text-sm">Pause</span>
            </button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg border border-secondary-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-secondary-900">Add New Work</h3>
              <button onClick={() => setShowAddModal(false)} className="text-secondary-500 hover:text-secondary-700">✕</button>
            </div>
            <form onSubmit={handleAddWork} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Project Name</label>
                <input className="input-field" value={newWork.name} onChange={(e) => setNewWork({ ...newWork, name: e.target.value })} placeholder="e.g., Landing Page Redesign" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Client</label>
                <input className="input-field" value={newWork.client} onChange={(e) => setNewWork({ ...newWork, client: e.target.value })} placeholder="e.g., Acme Co." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Budget (USD)</label>
                  <input type="number" className="input-field" value={newWork.budget} onChange={(e) => setNewWork({ ...newWork, budget: e.target.value })} placeholder="3000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Deadline</label>
                  <input type="date" className="input-field" value={newWork.deadline} onChange={(e) => setNewWork({ ...newWork, deadline: e.target.value })} />
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Progress (%)</label>
                  <input type="number" min="0" max="100" className="input-field" value={newWork.progress} onChange={(e) => setNewWork({ ...newWork, progress: e.target.value })} placeholder="0" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Overview
