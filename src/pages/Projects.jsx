import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  DollarSign,
  Users,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Pause,
  FolderOpen
} from 'lucide-react'
import { useProjects } from '../contexts/ProjectsContext'

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('table')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newWork, setNewWork] = useState({ name: '', client: '', budget: '', deadline: '', progress: 0 })

  // Use shared context for projects
  const { projects, addProject, updateProject, deleteProject } = useProjects()

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
    
    addProject(proj)
    setShowAddModal(false)
    setNewWork({ name: '', client: '', budget: '', deadline: '', progress: 0 })
  }

  const handleUpdateProject = (projectId, updates) => {
    updateProject(projectId, updates)
  }

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId)
    }
  }

  const getStatusBadge = (progress) => {
    let status, config
    if (progress >= 100) {
      status = 'completed'
      config = { color: 'bg-success-100 text-success-800', icon: CheckCircle }
    } else if (progress > 0) {
      status = 'in-progress'
      config = { color: 'bg-primary-100 text-primary-800', icon: Clock }
    } else {
      status = 'planning'
      config = { color: 'bg-accent-100 text-accent-800', icon: AlertCircle }
    }
    
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('-', ' ')}
      </span>
    )
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success-500'
    if (progress >= 50) return 'bg-primary-500'
    return 'bg-secondary-300'
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase())
    
    let projectStatus
    if (project.progress >= 100) projectStatus = 'completed'
    else if (project.progress > 0) projectStatus = 'in-progress'
    else projectStatus = 'planning'
    
    const matchesStatus = statusFilter === 'all' || projectStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-secondary-900">Projects</h1>
          <p className="text-sm sm:text-base text-secondary-600 mt-1">Manage and track all your client projects</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary mt-4 sm:mt-0 flex items-center justify-center sm:justify-start">
          <Plus className="w-4 h-4 mr-2" />
          Add New Work
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="on-hold">On Hold</option>
              <option value="planning">Planning</option>
            </select>
          </div>

          <div className="flex items-center justify-center sm:justify-end space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-lg text-sm ${viewMode === 'table' ? 'bg-primary-100 text-primary-700' : 'bg-secondary-100 text-secondary-600'}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 rounded-lg text-sm ${viewMode === 'cards' ? 'bg-primary-100 text-primary-700' : 'bg-secondary-100 text-secondary-600'}`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider hidden sm:table-cell">
                    Client
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider hidden md:table-cell">
                    Progress
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider hidden lg:table-cell">
                    Budget
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider hidden lg:table-cell">
                    Deadline
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider hidden md:table-cell">
                    Team
                  </th>
                  <th className="relative px-3 sm:px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-secondary-50">
                    <td className="px-3 sm:px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-secondary-900">{project.name}</div>
                        <div className="text-xs sm:text-sm text-secondary-500 sm:hidden">{project.client}</div>
                        <div className="text-xs text-secondary-500 md:hidden">${project.budget.toLocaleString()} • {project.deadline}</div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-secondary-900 hidden sm:table-cell">
                      {project.client}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(project.progress)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="flex items-center">
                        <div className="w-12 sm:w-16 bg-secondary-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm text-secondary-600">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-secondary-900 hidden lg:table-cell">
                      {formatCurrency(project.budget)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-secondary-900 hidden lg:table-cell">
                      {project.deadline}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        AL
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleUpdateProject(project.id, { progress: Math.min(100, project.progress + 10) })}
                          className="text-green-400 hover:text-green-600"
                          title="Update Progress"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-400 hover:text-red-600"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="card card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-secondary-900 truncate">{project.name}</h3>
                  <p className="text-xs sm:text-sm text-secondary-600 truncate">{project.client}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleUpdateProject(project.id, { progress: Math.min(100, project.progress + 10) })}
                    className="text-green-400 hover:text-green-600"
                    title="Update Progress"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-400 hover:text-red-600"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-secondary-600">Status</span>
                  {getStatusBadge(project.progress)}
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs sm:text-sm text-secondary-600">Progress</span>
                    <span className="text-xs sm:text-sm font-medium text-secondary-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-secondary-600">Budget</span>
                  <span className="text-xs sm:text-sm font-medium text-secondary-900">{formatCurrency(project.budget)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-secondary-600">Deadline</span>
                  <span className="text-xs sm:text-sm font-medium text-secondary-900">{project.deadline}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-secondary-600">Freelancer</span>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    AL
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-secondary-200">
                <button className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View Details
                </button>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button className="p-1 text-secondary-400 hover:text-secondary-600">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button className="p-1 text-secondary-400 hover:text-secondary-600">
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="card text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8 text-secondary-400" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-secondary-900 mb-2">No projects found</h3>
          <p className="text-sm sm:text-base text-secondary-600 mb-4 sm:mb-6">Try adjusting your search or filter criteria</p>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add New Work
          </button>
        </div>
      )}

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

export default Projects
