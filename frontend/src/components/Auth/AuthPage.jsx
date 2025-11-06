import React, { useState } from 'react'
import { signup, login } from '../../api/auth'
import { useNavigate } from 'react-router-dom'

export default function AuthPage(){
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const navigate = useNavigate()

  // login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // signup state
  const [sname, setSname] = useState('')
  const [semail, setSemail] = useState('')
  const [spassword, setSpassword] = useState('')

  async function handleLogin(e){
    e.preventDefault()
    try{
      await login({ email, password })
      navigate('/')
    }catch(err){
      console.error(err)
      alert('Login failed')
    }
  }

  async function handleSignup(e){
    e.preventDefault()
    try{
      await signup({ name: sname, email: semail, password: spassword })
      // after signup, automatically log in
      await login({ email: semail, password: spassword })
      navigate('/')
    }catch(err){
      console.error(err)
      alert('Signup failed')
    }
  }

  return (
    <div className="card" style={{maxWidth:900, margin:'24px auto'}}>
      <div style={{display:'flex', gap:12, marginBottom:12}}>
        <button className={mode==='login' ? 'primary' : 'ghost'} onClick={()=>setMode('login')}>Login</button>
        <button className={mode==='signup' ? 'primary' : 'ghost'} onClick={()=>setMode('signup')}>Sign up</button>
      </div>

      {mode==='login' ? (
        <form onSubmit={handleLogin} className="form-row" style={{flexDirection:'column'}}>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div style={{height:8}} />
          <button className="primary" type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="form-row" style={{flexDirection:'column'}}>
          <input placeholder="Name" value={sname} onChange={e=>setSname(e.target.value)} />
          <input placeholder="Email" value={semail} onChange={e=>setSemail(e.target.value)} />
          <input placeholder="Password" type="password" value={spassword} onChange={e=>setSpassword(e.target.value)} />
          <div style={{height:8}} />
          <button className="primary" type="submit">Create account</button>
        </form>
      )}
    </div>
  )
}
