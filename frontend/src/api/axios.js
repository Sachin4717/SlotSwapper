import axios from 'axios'
import { showToast } from '../utils/toast'

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  timeout: 5000,
})

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
