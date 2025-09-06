import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import Projects from './pages/Projects'
import Profile from './pages/Profile'
import { ProjectsProvider } from './contexts/ProjectsContext'

function App() {
  return (
    <ProjectsProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </ProjectsProvider>
  )
}

export default App
