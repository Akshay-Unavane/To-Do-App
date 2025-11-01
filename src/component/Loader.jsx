import React from 'react'

function Loader({ visible, message }){
  if(!visible) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="p-6 rounded-lg flex flex-col items-center gap-3 shadow-lg max-w-xs w-full mx-4 ${/* placeholder for dark/light */''}">
        <div className="w-20 h-20 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-md">
          <svg className="w-10 h-10 animate-spin text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </div>
        <div className="text-center">
          <div className="font-medium text-indigo-600">{message || 'Please wait...'}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">This should take a few seconds.</div>
        </div>
      </div>
    </div>
  )
}

export default Loader
