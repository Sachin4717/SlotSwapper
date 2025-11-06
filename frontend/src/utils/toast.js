export function showToast(message, type = 'info'){
  try{
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { message, type } }))
  }catch(e){
    console.warn('toast dispatch failed', e)
  }
}
