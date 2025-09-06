import { createContext, useContext, useState, useEffect } from 'react'

const ProjectsContext = createContext()

export const useProjects = () => {
  const context = useContext(ProjectsContext)
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return context
}

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])

  // Load data from localStorage on mount
  useEffect(() => {
    const storedProjects = localStorage.getItem('ws_projects')
    if (storedProjects) {
      try {
        const projectsData = JSON.parse(storedProjects)
        // Ensure all projects have IDs
        const projectsWithIds = projectsData.map(project => ({
          ...project,
          id: project.id || Date.now() + Math.random()
        }))
        setProjects(projectsWithIds)
      } catch (error) {
        console.error('Error parsing stored projects:', error)
      }
    }

    const storedClients = localStorage.getItem('ws_clients')
    if (storedClients) {
      try {
        const clientsData = JSON.parse(storedClients)
        // Ensure all clients have IDs
        const clientsWithIds = clientsData.map(client => ({
          ...client,
          id: client.id || Date.now() + Math.random()
        }))
        setClients(clientsWithIds)
      } catch (error) {
        console.error('Error parsing stored clients:', error)
      }
    }
  }, [])

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    if (projects && projects.length >= 0) {
      localStorage.setItem('ws_projects', JSON.stringify(projects))
    }
  }, [projects])

  // Save clients to localStorage whenever clients change
  useEffect(() => {
    if (clients && clients.length >= 0) {
      localStorage.setItem('ws_clients', JSON.stringify(clients))
    }
  }, [clients])

  const addProject = (newProject) => {
    const project = {
      ...newProject,
      id: newProject.id || Date.now() + Math.random(), // Add unique ID if not present
      budget: Number(newProject.budget || 0),
      progress: Number(newProject.progress || 0)
    }
    setProjects(prev => [project, ...prev])
    return project
  }

  const updateProject = (projectId, updates) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId ? { ...project, ...updates } : project
      )
    )
  }

  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId))
  }

  const addClient = (newClient) => {
    const client = {
      ...newClient,
      id: Date.now() + Math.random(), // Add unique ID
      projects: Number(newClient.projects || 0),
      totalPaid: Number(newClient.totalPaid || 0)
    }
    setClients(prev => [client, ...prev])
    return client
  }

  const updateClient = (clientId, updates) => {
    setClients(prev => 
      prev.map(client => 
        client.id === clientId ? { ...client, ...updates } : client
      )
    )
  }

  const addProjectAndUpdateClient = (newProject) => {
    const project = addProject(newProject)
    
    // Update or create client
    const existingClientIndex = clients.findIndex(c => 
      c.name.toLowerCase() === newProject.client.toLowerCase()
    )
    
    if (existingClientIndex >= 0) {
      const updatedClients = [...clients]
      updatedClients[existingClientIndex] = {
        ...updatedClients[existingClientIndex],
        projects: (updatedClients[existingClientIndex].projects || 0) + 1,
        totalPaid: Number(updatedClients[existingClientIndex].totalPaid || 0) + project.budget,
        status: 'active'
      }
      setClients(updatedClients)
    } else {
      addClient({
        name: newProject.client,
        avatar: newProject.client.slice(0, 2).toUpperCase(),
        projects: 1,
        totalPaid: project.budget,
        status: 'active'
      })
    }
    
    return project
  }

  const value = {
    projects,
    clients,
    addProject,
    updateProject,
    deleteProject,
    addClient,
    updateClient,
    addProjectAndUpdateClient,
    setProjects,
    setClients
  }

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  )
}
