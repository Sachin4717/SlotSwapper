import React from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import AuthPage from './components/Auth/AuthPage'
import Marketplace from './components/Marketplace'
import RequestsView from './components/RequestsView'
import CalendarView from './components/CalendarView'
import Footer from './components/Footer'

export default function App(){
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path='/' element={
            <div className="landing-viewport">
              <div className="landing-card card">
                <h1 className="landing-title">Welcome to SlotSwapper</h1>
                <p className="small muted">Share, swap, and manage your schedule with ease.</p>
                <div style={{height:14}} />
                <div>
                  <Link to="/auth"><button className="primary">Get started</button></Link>
                </div>
              </div>
            </div>
          } />
          <Route path='/calendar' element={<CalendarView />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/marketplace' element={<Marketplace />} />
          <Route path='/requests' element={<RequestsView />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
