import React from "react";
import { motion } from "framer-motion";
// ensure `motion` is referenced so linters don't warn when JSX parsing is inconsistent
void motion;

function Landing({ onLoginClick, darkMode }) {
  return (
    <main
      className={`min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-10 ${
        darkMode ? "bg-gray-900 text-white" : "bg-indigo-50 text-gray-900"
      }`}
    >
      <section
        className={`w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-6 md:p-10 rounded-2xl shadow-lg transition-colors duration-500 ${
          darkMode ? "bg-gray-800/60" : "bg-white/80"
        }`}
      >
        {/* Left Content */}
        <motion.div
          className="space-y-6 p-2 md:p-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Stay focused. Get things done.
          </h1>
          <p
            className={`text-lg sm:text-xl ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            A lightweight, distraction-free to-do app built for speed and
            simplicity — sign in to sync your tasks across devices.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onLoginClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow transition"
            >
              Get started
            </button>
            <a
              href="#features"
              className={`px-5 py-3 rounded-lg border ${
                darkMode
                  ? "bg-white/5 text-gray-200 border-gray-700 hover:bg-white/20"
                  : "bg-white/20 text-gray-800 border-gray-200 hover:bg-white/30"
              } transition`}
            >
              See features
            </a>
          </div>

          {/* Features */}
          <div
            id="features"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
          >
            <div
              className={`p-4 rounded-lg transition ${
                darkMode ? "bg-white/5" : "bg-white/30"
              }`}
            >
              <h4 className="font-semibold">Fast sync</h4>
              <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                Auto-sync across devices with secure authentication.
              </p>
            </div>
            <div
              className={`p-4 rounded-lg transition ${
                darkMode ? "bg-white/5" : "bg-white/30"
              }`}
            >
              <h4 className="font-semibold">Simple UI</h4>
              <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                Focus on tasks — no clutter, just productivity.
              </p>
            </div>
            <div
              className={`p-4 rounded-lg transition ${
                darkMode ? "bg-white/5" : "bg-white/30"
              }`}
            >
              <h4 className="font-semibold">Offline first</h4>
              <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                Works offline and syncs when you're back online.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Illustrative Card */}
        <motion.div
          className="flex items-center justify-center p-2 md:p-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`w-full max-w-md p-6 rounded-xl shadow-xl border border-white/10 transition-colors duration-500 ${
              darkMode
                ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
                : "bg-gradient-to-br from-indigo-50 to-white/60 text-gray-900"
            }`}
          >
            <div className="mb-6">
              <div className="text-sm text-indigo-600 font-medium">
                Your day, organized
              </div>
              <h3 className="text-2xl font-bold mt-2">Plan. Do. Done.</h3>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <div className="font-medium">Create tasks</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Add tasks quickly and organize your day.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <div className="font-medium">Mark complete</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Check off items as you finish them.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <div className="font-medium">Sync securely</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Your tasks are saved to your account.
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default Landing;
