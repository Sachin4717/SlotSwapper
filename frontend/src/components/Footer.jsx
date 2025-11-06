import React from 'react'

export default function Footer(){
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="about">
          <strong>About SlotSwapper</strong>
          <p className="small muted">SlotSwapper helps teams share and swap time slots quickly. Built for easy scheduling and fast swaps.</p>
        </div>
        <div className="links small muted">
          <div>Version 0.1.0</div>
          <div>© {new Date().getFullYear()} SlotSwapper</div>
        </div>
      </div>
    </footer>
  )
}
