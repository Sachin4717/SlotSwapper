import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'

export default function Navbar(){
  const navigate = useNavigate()
  function handleLogout(){
    logout()
    navigate('/login')
  }

  return (
    <nav>
      <div style={{width:'100%', maxWidth:1100, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div className="logo">SlotSwapper</div>
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/requests">Requests</Link>
          <Link to="/calendar">Calendar</Link>
          <button onClick={handleLogout} className="ghost">Logout</button>
        </div>
      </div>
    </nav>
  )
}
