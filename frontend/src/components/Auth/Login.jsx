import React, { useState } from 'react'
import { login } from '../../api/auth'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    try{
      await login({ email, password })
      navigate('/')
    }catch(err){
      console.error(err)
      alert('Login failed')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
