import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/main.css'
import { AuthProvider } from './context/AuthContext'
import ToastProvider from './components/ToastProvider'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastProvider />
    </AuthProvider>
  </React.StrictMode>
)
