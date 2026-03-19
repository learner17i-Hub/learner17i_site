import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import BlogList from './pages/BlogList'
import BlogDetail from './pages/BlogDetail'
import BlogEdit from './pages/BlogEdit'
import Resume from './pages/Resume'
import ChatLobby from './pages/ChatLobby'
import ChatRoom from './pages/ChatRoom'
import Login from './pages/Login'
import Register from './pages/Register'
import WeightDiary from './pages/WeightDiary'
import api from './api'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/accounts/csrf/').then(() => {
      api.get('/accounts/me/')
        .then(res => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false))
    })
  }, [])

  const handleLogout = async () => {
    await api.post('/accounts/logout/')
    setUser(null)
  }

  if (loading) return null

  return (
    <div className="animated-bg">
      <Navbar user={user} onLogout={handleLogout} />
      <main style={{ flex: 1, minHeight: 'calc(100vh - 130px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList user={user} />} />
          <Route path="/blog/new" element={<BlogEdit user={user} />} />
          <Route path="/blog/:id" element={<BlogDetail user={user} />} />
          <Route path="/blog/:id/edit" element={<BlogEdit user={user} />} />
          <Route path="/resume" element={<Resume user={user} />} />
          <Route path="/chat" element={<ChatLobby user={user} />} />
          <Route path="/chat/:roomName" element={<ChatRoom user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/weight-diary" element={<WeightDiary user={user} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
