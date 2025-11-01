import React, { useState, useRef, useEffect } from 'react'
import { Sun, Moon, Menu, X } from 'lucide-react'

function Avatar({ name }){
    if(!name) return (
        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700" />
    )
    const initials = name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()
    return (
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">{initials}</div>
    )
}

function Navbar({ user, onLoginClick, onLogout, darkMode, setDarkMode }){
        const [open, setOpen] = useState(false)
        const [menuOpen, setMenuOpen] = useState(false)
        const menuRef = useRef(null)

        useEffect(()=>{
            function onDoc(e){ if(menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
            document.addEventListener('click', onDoc)
            return ()=> document.removeEventListener('click', onDoc)
        }, [])

        return (
                <header className="w-full shadow-sm">
                        <nav className={`max-w-6xl mx-auto px-4 py-3 flex items-center justify-between ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} rounded-b-md`}>
                                <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-3" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Home">
                                            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">TD</div>
                                            <div className="hidden sm:block">
                                                <div className="text-lg font-extrabold">To-Do App</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-300">simple & focused</div>
                                            </div>
                                        </button>
                                </div>

                                <div className="flex items-center gap-3">
                                        {/* Theme toggle */}
                                        <button
                                            onClick={() => setDarkMode(!darkMode)}
                                            className="p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 flex items-center"
                                            aria-label="Toggle theme"
                                        >
                                            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
                                        </button>

                                        {/* Mobile menu toggle */}
                                        <button className="sm:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(!open)} aria-label="Menu">
                                            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                        </button>

                                        <div className={`items-center gap-3 hidden sm:flex`}> 
                                            {user ? (
                                                <div className="flex items-center gap-3">
                                                    <div ref={menuRef} className="relative">
                                                        <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                                                            <Avatar name={user.name} />
                                                            <span className="text-sm font-medium">{user.name}</span>
                                                        </button>
                                                        {menuOpen && (
                                                            <div className={`absolute right-0 mt-2 w-40 rounded shadow-lg z-40 ${darkMode ? 'bg-gray-800 border border-gray-700 text-gray-100' : 'bg-white border border-gray-200 text-gray-900'}`}>
                                                                <button onClick={onLogout} className={`w-full text-left px-4 py-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>Logout</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={onLoginClick}
                                                    className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                                                >
                                                    Login
                                                </button>
                                            )}
                                        </div>
                                </div>
                        </nav>

                        {/* Mobile dropdown */}
                        {open && (
                          <div className={`sm:hidden px-4 py-3 ${darkMode ? 'bg-gray-900 border-t border-gray-800 text-gray-100' : 'bg-white border-t border-gray-200 text-gray-900'}`}>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => setDarkMode(!darkMode)} className={`flex items-center gap-2 p-2 rounded ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>{darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />} Theme</button>
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-2 p-2">
                                            <Avatar name={user.name} />
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                        <button onClick={onLogout} className="p-2 rounded bg-red-500 text-white">Logout</button>
                                    </>
                                ) : (
                                    <button onClick={onLoginClick} className="p-2 rounded bg-indigo-600 text-white">Login</button>
                                )}
                            </div>
                          </div>
                        )}
                </header>
        )
}

export default Navbar;