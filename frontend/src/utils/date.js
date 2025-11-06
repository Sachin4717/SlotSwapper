export function isoToLocalInput(iso){
  if(!iso) return ''
  const d = new Date(iso)
  const pad = (n)=> String(n).padStart(2,'0')
  const yyyy = d.getFullYear()
  const MM = pad(d.getMonth()+1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mm = pad(d.getMinutes())
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`
}

export function localInputToIso(val){
  if(!val) return null
  // val is like 2025-11-06T14:30
  const d = new Date(val)
  return d.toISOString()
}

export function nice(iso){
  if(!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString()
}
