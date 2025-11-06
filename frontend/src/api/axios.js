import axios from 'axios'
import { showToast } from '../utils/toast'

// frontend/src/api/axios.js
const API = axios.create({
  baseURL: "https://slotswapper-backend.onrender.com"
});


// Attach token if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use((res) => res, (err) => {
  try {
    const msg = err.response?.data?.message || err.message || 'Request failed'
    showToast(msg, 'error')
  } catch (e) { console.error('toast failed', e) }
  return Promise.reject(err)
})

export default api
