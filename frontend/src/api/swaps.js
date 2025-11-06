import api from './axios'

export async function getSwappableSlots(){
  const res = await api.get('/swaps/swappable-slots')
  return res.data
}

export async function createSwapRequest(mySlotId, theirSlotId){
  const res = await api.post('/swaps/swap-request', { mySlotId, theirSlotId })
  return res.data
}

export async function respondSwap(requestId, accept){
  const res = await api.post(`/swaps/swap-response/${requestId}`, { accept })
  return res.data
}

export async function listSwapRequests(){
  const res = await api.get('/swaps/swap-requests')
  return res.data
}
