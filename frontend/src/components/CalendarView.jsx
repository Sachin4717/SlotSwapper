import React, { useEffect, useState } from 'react'
import { listMyEvents, createEvent, updateEvent, deleteEvent } from '../api/events'
import { isoToLocalInput, localInputToIso, nice } from '../utils/date'
import Modal from './Modal'

export default function CalendarView(){
  const [events, setEvents] = useState([])
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(()=>{ fetchEvents() }, [])

  async function fetchEvents(){
    try{
      const data = await listMyEvents()
      setEvents(data)
    }catch(e){ console.error(e) }
  }

  async function handleCreate(e){
    e.preventDefault()
    try{
      // optimistic UI
      const optimistic = { id: `temp-${Date.now()}`, title, start_time: localInputToIso(startTime), end_time: localInputToIso(endTime), status: 'BUSY' }
      setEvents(prev=>[optimistic, ...prev])
      await createEvent({ title, start_time: localInputToIso(startTime), end_time: localInputToIso(endTime) })
      setTitle(''); setStartTime(''); setEndTime('')
      fetchEvents()
    }catch(e){ console.error(e); alert('Create failed') }
  }

  async function handleUpdate(e){
    e.preventDefault()
    try{
      // optimistic update locally
      setEvents(prev=>prev.map(ev=> ev.id===editingId ? { ...ev, title, start_time: localInputToIso(startTime), end_time: localInputToIso(endTime) } : ev))
      await updateEvent(editingId, { title, start_time: localInputToIso(startTime), end_time: localInputToIso(endTime) })
      setEditingId(null); setTitle(''); setStartTime(''); setEndTime('')
      fetchEvents()
    }catch(e){ console.error(e); alert('Update failed') }
  }

  function startEdit(ev){
    setEditingId(ev.id)
    setTitle(ev.title)
    setStartTime(isoToLocalInput(ev.start_time))
    setEndTime(isoToLocalInput(ev.end_time))
  }

  async function handleDelete(id){
    try{
      // optimistic remove
      const prev = events
      setEvents(prev=>prev.filter(e=>e.id!==id))
      await deleteEvent(id)
      setConfirmDelete(null)
      fetchEvents()
    }catch(e){ console.error(e); alert('Delete failed') }
  }

  async function toggleSwappable(ev){
    try{
      const newStatus = ev.status === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE'
      // optimistic
      setEvents(prev=>prev.map(e=> e.id===ev.id? { ...e, status: newStatus } : e))
      await updateEvent(ev.id, { status: newStatus })
      fetchEvents()
    }catch(e){ console.error(e); alert('Update failed') }
  }

  return (
    <div className="card">
      <h2>My Calendar</h2>
      <form onSubmit={editingId ? handleUpdate : handleCreate} className="form-row">
        <input className="" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input type="datetime-local" placeholder="Start" value={startTime} onChange={e=>setStartTime(e.target.value)} required />
        <input type="datetime-local" placeholder="End" value={endTime} onChange={e=>setEndTime(e.target.value)} required />
        <button type="submit" className="primary">{editingId ? 'Update' : 'Create'}</button>
        {editingId && <button type="button" className="ghost" onClick={()=>{ setEditingId(null); setTitle(''); setStartTime(''); setEndTime('') }}>Cancel</button>}
      </form>

      <div>
        {events.map(ev=> (
          <div key={ev.id} className="slot">
            <div>
                <div style={{fontWeight:700}} className="slot-title">{ev.title}</div>
                <div className="meta">{nice(ev.start_time)} - {nice(ev.end_time)}</div>
            </div>
              <div className="slot-actions">
                <button className="ghost" onClick={()=>startEdit(ev)}>Edit</button>
                <button className="ghost" onClick={()=>setConfirmDelete(ev.id)}>Delete</button>
                <button className="primary" onClick={()=>toggleSwappable(ev)}>{ev.status === 'SWAPPABLE' ? 'Mark Busy' : 'Make Swappable'}</button>
              </div>
          </div>
        ))}
      </div>
      {confirmDelete && (
        <Modal title="Confirm delete" onClose={()=>setConfirmDelete(null)}>
          <div>Are you sure you want to delete this event?</div>
          <div style={{marginTop:8}}>
            <button onClick={()=>handleDelete(confirmDelete)}>Yes, delete</button>
            <button onClick={()=>setConfirmDelete(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
