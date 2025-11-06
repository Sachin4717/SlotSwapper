import React, { useEffect, useState } from 'react'

function Toast({ id, message, type, onClose }){
  useEffect(()=>{
    const t = setTimeout(()=> onClose(id), 4000)
    return ()=>clearTimeout(t)
  }, [id, onClose])
  return (
    <div className={`toast toast-${type}`} style={{background:'#222', color:'#fff', padding:8, marginBottom:6}}>
      {message}
    </div>
  )
}

export default function ToastProvider(){
  const [toasts, setToasts] = useState([])

  useEffect(()=>{
    function handler(e){
      const id = Date.now() + Math.random()
      setToasts(prev=>[...prev, { id, message: e.detail.message, type: e.detail.type }])
    }
    window.addEventListener('app:toast', handler)
    return ()=> window.removeEventListener('app:toast', handler)
  }, [])

  function remove(id){ setToasts(prev=>prev.filter(t=>t.id!==id)) }

  return (
    <div style={{position:'fixed', right:20, top:20, zIndex:9999}}>
      {toasts.map(t=> <Toast key={t.id} {...t} onClose={remove} />)}
    </div>
  )
}
