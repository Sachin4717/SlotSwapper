import React from 'react'

export default function Modal({ title, children, onClose }){
  return (
    <div className="page-center" style={{position:'fixed', left:0, top:0, right:0, bottom:0, background:'rgba(0,0,0,0.45)', zIndex:200}}>
      <div className="card" style={{minWidth:360, maxWidth:720}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h3 style={{margin:0}}>{title}</h3>
          <button className="ghost" onClick={onClose}>Close</button>
        </div>
        <div style={{marginTop:12}}>{children}</div>
      </div>
    </div>
  )
}
