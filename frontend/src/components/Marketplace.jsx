import React, { useEffect, useState } from 'react'
import { getSwappableSlots, createSwapRequest } from '../api/swaps'
import api from '../api/axios'
import { nice } from '../utils/date'
import { showToast } from '../utils/toast'

export default function Marketplace(){
  const [slots, setSlots] = useState([])
  const [mySwappable, setMySwappable] = useState([])
  const [selectedTheir, setSelectedTheir] = useState(null)
  const [selectedMy, setSelectedMy] = useState(null)

  useEffect(()=>{
    fetch()
    fetchMy()
  }, [])

  async function fetch(){
    try{
      const data = await getSwappableSlots()
      setSlots(data)
    }catch(e){
      console.error(e)
    }
  }

  async function fetchMy(){
    try{
      const res = await api.get('/events/')
      const mine = res.data.filter(e=>e.status === 'SWAPPABLE')
      setMySwappable(mine)
    }catch(e){
      console.error(e)
    }
  }

  async function requestSwap(){
    if(!selectedTheir || !selectedMy){
      alert('Select both slots')
      return
    }
    try{
      // optimistic: mark their slot locally as SWAP_PENDING
      const prevSlots = slots
      setSlots(s=> s.map(x=> x.id===selectedTheir.id ? { ...x, status: 'SWAP_PENDING' } : x))
      await createSwapRequest(selectedMy.id, selectedTheir.id)
  showToast('Swap request sent', 'info')
      fetch()
      fetchMy()
    }catch(e){
  console.error(e)
  showToast('Failed to request swap', 'error')
      // rollback
      fetch()
      fetchMy()
    }
  }

  return (
    <div className="card">
      <h2>Marketplace</h2>
      <div className="grid-2">
        <div>
          <h3>Available Slots</h3>
          {slots.map(s=> (
            <div key={s.id} className="slot">
              <div>
                <div className="slot-title" style={{fontWeight:700}}>{s.title}</div>
                <div className="meta">{s.start_time} - {s.end_time}</div>
              </div>
              <div>
                <button className={selectedTheir && selectedTheir.id===s.id? 'ghost' : 'primary'} onClick={()=>setSelectedTheir(s)}>{selectedTheir && selectedTheir.id===s.id? 'Selected' : 'Request'}</button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h3>Your Swappable Slots</h3>
          {mySwappable.map(m=> (
            <div key={m.id} className="slot">
              <div>
                <div className="slot-title" style={{fontWeight:700}}>{m.title}</div>
                <div className="meta">{m.start_time} - {m.end_time}</div>
              </div>
              <div>
                <button className={selectedMy && selectedMy.id===m.id? 'ghost' : 'primary'} onClick={()=>setSelectedMy(m)}>{selectedMy && selectedMy.id===m.id? 'Selected' : 'Offer'}</button>
              </div>
            </div>
          ))}

          <div className="spacer"></div>
          <div>
            <button className="primary" onClick={requestSwap}>Send Swap Request</button>
          </div>
        </div>
      </div>
    </div>
  )
}
