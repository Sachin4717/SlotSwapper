import React, { useState } from 'react'
import { signup } from '../../api/auth'
import { useNavigate } from 'react-router-dom'

export default function Signup(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    try{
      await signup({ name, email, password })
      navigate('/login')
    }catch(err){
      console.error(err)
      alert('Signup failed')
    }
  }

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Sign up</button>
      </form>
    </div>
  )
}
