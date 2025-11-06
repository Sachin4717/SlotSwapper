import api from './axios'

export async function signup(payload){
  const res = await api.post('/auth/signup', payload)
  return res.data
}

export async function login(payload){
  const res = await api.post('/auth/login', payload)
  if(res.data && res.data.token){
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
  }
  return res.data
}

export function logout(){
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
