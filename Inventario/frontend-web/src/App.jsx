import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './index.css'

const THEMES = {
  violet: {
    id: 'violet',
    name: 'Violeta Cósmico',
    color: '#8b5cf6',
    bg: 'radial-gradient(circle at top right, #1a153b 0%, #0d0e1b 100%)',
    glassBg: 'rgba(18, 20, 38, 0.55)',
  },
  ocean: {
    id: 'ocean',
    name: 'Azul Océano',
    color: '#3b82f6',
    bg: 'radial-gradient(circle at top right, #0b1a30 0%, #050a12 100%)',
    glassBg: 'rgba(11, 26, 48, 0.55)',
  },
  emerald: {
    id: 'emerald',
    name: 'Verde Esmeralda',
    color: '#10b981',
    bg: 'radial-gradient(circle at top right, #08241b 0%, #030a07 100%)',
    glassBg: 'rgba(8, 36, 27, 0.55)',
  },
  amber: {
    id: 'amber',
    name: 'Atardecer Ámbar',
    color: '#f59e0b',
    bg: 'radial-gradient(circle at top right, #2d1b02 0%, #0e0a03 100%)',
    glassBg: 'rgba(45, 27, 2, 0.55)',
  },
  neon: {
    id: 'neon',
    name: 'Cyberpunk Neón',
    color: '#ff007f',
    bg: 'radial-gradient(circle at top right, #24051a 0%, #080209 100%)',
    glassBg: 'rgba(36, 5, 26, 0.55)',
  }
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('inv_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const [themeId, setThemeId] = useState(() => {
    try {
      const stored = localStorage.getItem('inv_user')
      if (stored) {
        const u = JSON.parse(stored)
        return localStorage.getItem(`theme_id_${u.id || u.correo}`) || 'violet'
      }
    } catch {}
    return 'violet'
  })

  useEffect(() => {
    const applyTheme = (tId) => {
      const t = THEMES[tId] || THEMES.violet
      const root = document.documentElement;
      
      root.style.setProperty('--bs-primary', t.color);
      root.style.setProperty('--purple-accent', t.color);
      
      let hex = t.color.replace('#', '');
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      const r = parseInt(hex.substring(0, 2), 16) || 139;
      const g = parseInt(hex.substring(2, 4), 16) || 92;
      const b = parseInt(hex.substring(4, 6), 16) || 246;
      
      root.style.setProperty('--bs-primary-rgb', `${r}, ${g}, ${b}`);
      root.style.setProperty('--purple-glow', `rgba(${r}, ${g}, ${b}, 0.15)`);
      root.style.setProperty('--body-bg', t.bg);
      root.style.setProperty('--glass-bg', t.glassBg);
    }

    applyTheme(themeId)
    
    if (user) {
      localStorage.setItem(`theme_id_${user.id || user.correo}`, themeId)
    }
  }, [themeId, user])

  const handleLogin = (userData, token) => {
    localStorage.setItem('inv_token', token)
    localStorage.setItem('inv_user', JSON.stringify(userData))
    setUser(userData)
    
    const userTheme = localStorage.getItem(`theme_id_${userData.id || userData.correo}`) || 'violet'
    setThemeId(userTheme)
  }

  const handleLogout = () => {
    localStorage.removeItem('inv_token')
    localStorage.removeItem('inv_user')
    setUser(null)
    setThemeId('violet')
  }

  return user
    ? <Dashboard user={user} onLogout={handleLogout} themeId={themeId} onThemeChange={setThemeId} />
    : <Login onLogin={handleLogin} />
}

export default App
