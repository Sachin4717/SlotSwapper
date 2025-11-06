import React, { useEffect, useState } from 'react'
import { listSwapRequests, respondSwap } from '../api/swaps'
import { nice } from '../utils/date'
import { showToast } from '../utils/toast'

export default function RequestsView(){
  const [incoming, setIncoming] = useState([])
  const [outgoing, setOutgoing] = useState([])

  useEffect(()=>{
    fetch()
  }, [])

  async function fetch(){
    try{
      const data = await listSwapRequests()
      setIncoming(data.incoming)
      setOutgoing(data.outgoing)
    }catch(e){
      console.error(e)
    }
  }

  async function handleRespond(id, accept){
    try{
      // optimistic: update UI
      const prevIncoming = incoming
  setIncoming(prev=> prev.map(r=> r.id===id ? { ...r, status: accept ? 'ACCEPTED' : 'REJECTED' } : r))
  await respondSwap(id, accept)
  showToast(accept ? 'Swap accepted' : 'Swap rejected', 'info')
  fetch()
    }catch(e){
      console.error(e)
      alert('Action failed')
    }
  }

  return (
    <div className="card">
      <h2>Swap Requests</h2>
      <div className="grid-2">
        <div>
          <h3>Incoming</h3>
          {incoming.map(r=> (
            <div key={r.id} className="slot">
              <div>
                <div><strong>From:</strong> {r.requester_id}</div>
                <div className="meta">Their slot: {r.my_slot_id} • Your slot: {r.their_slot_id}</div>
                <div className="meta">Status: <span className={r.status==='PENDING'? 'status-swappable' : ''}>{r.status}</span></div>
              </div>
              <div className="slot-actions">
                {r.status === 'PENDING' && (
                  <>
                    <button className="primary" onClick={()=>handleRespond(r.id, true)}>Accept</button>
                    <button className="ghost" onClick={()=>handleRespond(r.id, false)}>Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <div>
          <h3>Outgoing</h3>
          {outgoing.map(r=> (
            <div key={r.id} className="slot">
              <div>
                <div><strong>To:</strong> {r.responder_id}</div>
                <div className="meta">My slot: {r.my_slot_id} • Their slot: {r.their_slot_id}</div>
                <div className="meta">Status: {r.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
