import React, { useState, useEffect } from "react";
import Navbar from "./component/Navbar";
import Landing from "./component/Landing";
import Login from "./component/Login";

import api, { setToken } from './api'
import Toast from './component/Toast'
import Loader from './component/Loader'
import ToDoPage from "./component/Home";

function App (){
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch (e) { console.warn('localStorage parse error', e); return null }
  })
  const [showLogin, setShowLogin] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')
  const [toast, setToast] = useState(null)
  const [loader, setLoader] = useState({ visible: false, message: null })

  // showLoader returns an object with a promise that resolves when the loader hides
  // and a hide() function to dismiss it early.
  function showLoader(seconds = 3, message = 'Working...'){
    let timeoutId = null
    let resolved = false
    setLoader({ visible: true, message })
    const p = new Promise(resolve => {
      timeoutId = setTimeout(()=>{
        setLoader({ visible: false, message: null })
        resolved = true
        resolve()
      }, (seconds || 3) * 1000)
    })
    return {
      promise: p,
      hide(){ if(timeoutId && !resolved){ clearTimeout(timeoutId); timeoutId = null; setLoader({ visible: false, message: null }); resolved = true; /* resolve immediately */ return Promise.resolve() } return Promise.resolve() }
    }
  }

  function showToast(message, type = 'success'){
    setToast({ message, type })
  }

  useEffect(() => {
    // if user not set but token exists, try fetch /me
    async function fetchMe(){
      try{
        const data = await api.me()
        setUser(data.user)
      }catch(err){
        // token invalid, clear
        console.warn('me failed', err)
        setToken(null)
        setUser(null)
      }
    }

    if(!user && api.getToken()){
      fetchMe()
    }
  }, [user])

  useEffect(() => {
    try{
      if(user) localStorage.setItem('user', JSON.stringify(user))
      else localStorage.removeItem('user')
    } catch (e) { console.warn('localStorage parse error', e); }
  }, [user])

  // Persist theme and apply `dark` class to <html>
  useEffect(() => {
    try{
      localStorage.setItem('theme', darkMode ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', darkMode)
    }catch(e){ console.warn('theme persist error', e) }
  }, [darkMode])

  function handleLogin(userObj){
    // userObj: user from server
    setUser(userObj)
    setShowLogin(false)
  }

  function handleLogout(){
    // show loader for 3s then perform logout
    const ctrl = showLoader(3, 'Logging out...')
    ctrl.promise.then(()=>{
      setToken(null)
      setUser(null)
      showToast('Logged out', 'info')
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar user={user} onLoginClick={() => setShowLogin(true)} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />

      {user ? (
       
        <ToDoPage darkMode={darkMode}/>
      ) : (
        <>
          <Landing onLoginClick={() => setShowLogin(true)} darkMode={darkMode} />
          {showLogin && <Login onLogin={handleLogin} onCancel={() => setShowLogin(false)} showToast={showToast} showLoader={showLoader} darkMode={darkMode} />}
        </>
      )}
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <Loader visible={loader.visible} message={loader.message} />
    </div>
  )
}

export default App;