import React, { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const raw = localStorage.getItem('user')
    if(raw){
      try{ setUser(JSON.parse(raw)) }catch(e){ setUser(null) }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
