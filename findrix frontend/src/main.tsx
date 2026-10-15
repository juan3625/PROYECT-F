import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'

// AppDataProvider ya no envuelve toda la app aquí: solo se monta dentro de
// las rutas protegidas (ver RequireAuth), porque depende de que exista una
// sesión. AuthProvider sí es global, porque /login y /registro lo necesitan.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
