import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, LogOut } from "lucide-react";
import api from "../api";

function ProfileMenu({ user, onLogout, darkMode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [value, setValue] = useState("");

  async function save() {
    if (!value.trim()) return;

    if (mode === "name") await api.updateProfile(value);
    if (mode === "password") await api.changePassword(value);

    setMode(null);
    setValue("");
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold cursor-pointer select-none">
        {user?.name?.[0]?.toUpperCase() || "U"}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl border z-50 ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-inherit">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs opacity-70">{user.email}</p>
            </div>

            {/* Menu */}
            <button onClick={() => setMode("name")} className="menu-item">
              <User size={16} /> Edit Username
            </button>

            <button onClick={() => setMode("password")} className="menu-item">
              <Lock size={16} /> Change Password
            </button>

            <button onClick={onLogout} className="menu-item text-red-600">
              <LogOut size={16} /> Logout
            </button>

            {/* Inline editor */}
            {mode && (
              <div className="p-3 border-t border-inherit">
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={mode === "name" ? "New username" : "New password"}
                  type={mode === "password" ? "password" : "text"}
                  className="w-full px-3 py-2 rounded bg-transparent border mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={save}
                    className="flex-1 bg-indigo-600 text-white rounded py-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setMode(null)}
                    className="flex-1 border rounded py-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfileMenu;
