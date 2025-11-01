import React, { useState, useEffect, useRef } from 'react'
import api, { setToken } from '../api'

function Login({ onLogin, onCancel, showToast, showLoader, darkMode }){
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const modalRef = useRef(null)

  // close on Escape
  useEffect(()=>{
    function onKey(e){ if(e.key === 'Escape') onCancel && onCancel() }
    document.addEventListener('keydown', onKey)
    return ()=> document.removeEventListener('keydown', onKey)
  }, [onCancel])

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    setLoading(true)
    const loaderCtrl = showLoader ? showLoader(3, mode === 'login' ? 'Signing in...' : 'Registering...') : null
    try{
      if(mode === 'login'){
        const data = await api.login(email, password)
        setToken(data.token)
        if(loaderCtrl) await Promise.all([loaderCtrl.promise])
        showToast && showToast('Signed in successfully', 'success')
        onLogin(data.user)
      } else {
        const data = await api.register(name, email, password)
        setToken(data.token)
        if(loaderCtrl) await Promise.all([loaderCtrl.promise])
        showToast && showToast('Account created', 'success')
        onLogin(data.user)
      }
    }catch(err){
      const msg = err?.info?.error || err.message || 'An error occurred'
      setError(msg)
      if(loaderCtrl && loaderCtrl.hide) await loaderCtrl.hide()
      showToast && showToast(msg, 'error')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-black/40 to-black/25 px-4">
      <div ref={modalRef} role="dialog" aria-modal="true" aria-label="Login dialog" className="w-full max-w-md mx-auto">
        <div className={`rounded-lg p-6 shadow-2xl border transition-transform transform duration-150 ease-out scale-100 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">🗂</div>
              <div>
                <h2 className="text-2xl font-semibold">{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{mode === 'login' ? 'Sign in to access your to-dos' : 'Register a new account'}</p>
              </div>
            </div>
            <button onClick={onCancel} aria-label="Close" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'register' && (
              <label className="flex flex-col">
                <span className={`text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Full name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className={`px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  autoFocus
                />
              </label>
            )}

            <label className="flex flex-col">
              <span className={`text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                className={`px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                autoFocus={mode === 'login'}
              />
            </label>

            <label className="flex flex-col relative">
              <span className={`text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                className={`px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              />
              <button type="button" onClick={() => setShowPassword(s => !s)} className={`absolute right-2 top-8 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{showPassword ? 'Hide' : 'Show'}</button>
            </label>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }} className="text-sm text-indigo-600 dark:text-indigo-400">
                  {mode === 'login' ? 'Create account' : 'Have an account? Sign in'}
                </button>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={onCancel} className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-200 text-gray-900'}`}>Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-indigo-600 text-white flex items-center gap-2 disabled:opacity-60">
                  {loading && (
                    <svg className="w-4 h-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  )}
                  <span>{mode === 'login' ? (loading ? 'Signing in...' : 'Sign in') : (loading ? 'Registering...' : 'Register')}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
