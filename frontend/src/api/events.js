import api from './axios'

export async function listMyEvents(){
  const res = await api.get('/events/')
  return res.data
}

export async function createEvent(payload){
  const res = await api.post('/events/', payload)
  return res.data
}

export async function updateEvent(eventId, payload){
  const res = await api.put(`/events/${eventId}`, payload)
  return res.data
}

export async function deleteEvent(eventId){
  const res = await api.delete(`/events/${eventId}`)
  return res.data
}
