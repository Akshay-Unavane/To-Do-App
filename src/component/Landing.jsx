import React from 'react'
import { motion } from 'framer-motion'
// ensure `motion` is referenced so linters don't warn when JSX parsing is inconsistent
void motion

function Landing({ onLoginClick, darkMode }){
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <section className={`w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800/60' : 'bg-white/80'}`}>
        <motion.div className="space-y-6 p-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Stay focused. Get things done.</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">A lightweight, distraction-free to-do app built for speed and simplicity — sign in to sync your tasks across devices.</p>

          <div className="flex flex-wrap gap-3">
            <button onClick={onLoginClick} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow">Get started</button>
            <a href="#features" className="px-5 py-3 rounded-lg bg-white/20 dark:bg-white/5 text-gray-800 dark:text-gray-200 hover:bg-white/30">See features</a>
          </div>

          <div id="features" className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <div className="p-3 bg-white/30 dark:bg-white/5 rounded-lg">
              <h4 className="font-semibold">Fast sync</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Auto-sync across devices with secure authentication.</p>
            </div>
            <div className="p-3 bg-white/30 dark:bg-white/5 rounded-lg">
              <h4 className="font-semibold">Simple UI</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Focus on tasks — no clutter, just productivity.</p>
            </div>
            <div className="p-3 bg-white/30 dark:bg-white/5 rounded-lg">
              <h4 className="font-semibold">Offline first</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Works offline and syncs when you're back online.</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="flex items-center justify-center p-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          {/* Illustrative card */}
          <div className={`w-full max-w-md p-6 rounded-xl shadow-xl border border-white/10 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-indigo-50 to-white/60'}`}>
            <div className="mb-4">
              <div className="text-sm text-indigo-600 font-medium">Your day, organized</div>
              <h3 className="text-2xl font-bold mt-2">Plan. Do. Done.</h3>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center">1</div>
                <div>
                  <div className="font-medium">Create tasks</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Add tasks quickly and organize your day.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center">2</div>
                <div>
                  <div className="font-medium">Mark complete</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Check off items as you finish them.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center">3</div>
                <div>
                  <div className="font-medium">Sync securely</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Your tasks are saved to your account.</div>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>
      </section>
    </main>
  )
}

export default Landing
