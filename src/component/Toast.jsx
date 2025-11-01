import React, { useEffect } from 'react'

function Toast({ message, onClose, type = 'info' }){
  useEffect(()=>{
    if(!message) return
    const t = setTimeout(()=> onClose && onClose(), 3000)
    return ()=> clearTimeout(t)
  }, [message, onClose])

  if(!message) return null

  const bg = type === 'error' ? 'bg-red-600' : (type === 'success' ? 'bg-teal-500' : 'bg-indigo-600')

  return (
    <div className="fixed top-24 right-6 z-50">
      <div className={`${bg} text-white px-4 py-2 rounded-lg shadow-lg ring-1 ring-black/10`}>{message}</div>
    </div>
  )
}

export default Toast
