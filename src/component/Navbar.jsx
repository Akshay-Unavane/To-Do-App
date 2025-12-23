import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Menu, X, LogOut, User, Lock } from "lucide-react";
import api from "../api";

/* Avatar */
function Avatar({ name }) {
  if (!name)
    return <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700" />;

  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
      {initials}
    </div>
  );
}

function Navbar({ user, onLoginClick, onLogout, darkMode, setDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const [editMode, setEditMode] = useState(null); // "name" | "password"
  const [value, setValue] = useState("");
  const profileRef = useRef(null);

  /* Close hover menu if clicked outside */
  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setHoverOpen(false);
        setEditMode(null);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  async function save() {
    if (!value.trim()) return;

    if (editMode === "name") await api.updateProfile(value);
    if (editMode === "password") await api.changePassword(value);

    setEditMode(null);
    setValue("");
  }

  return (
    <header className="w-full shadow-sm">
      <nav
        className={`max-w-6xl mx-auto px-4 py-3 flex items-center justify-between rounded-b-md ${
          darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        {/* Logo */}
        <button
          className="flex items-center gap-3"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
            TD
          </div>
          <div className="hidden sm:block">
            <div className="text-lg font-extrabold">To-Do App</div>
            <div className="text-xs text-gray-500 dark:text-gray-300">
              simple & focused
            </div>
          </div>
        </button>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-md"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>

          {/* Desktop Profile Hover */}
          <div className="hidden sm:block relative" ref={profileRef}>
            {user ? (
              <div
                onMouseEnter={() => setHoverOpen(true)}
                onMouseLeave={() => {
                  if (!editMode) setHoverOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Avatar name={user.name} />
                <span className="text-sm font-medium">{user.name}</span>

                {hoverOpen && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-64 rounded-xl shadow-xl z-50 ${
                      darkMode
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    {/* Header */}
                    <div className="px-4 py-3 border-b">
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-xs opacity-70">{user.email}</div>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => setEditMode("name")}
                      className="menu-item"
                    >
                      <User size={16} /> Edit Username
                    </button>

                    <button
                      onClick={() => setEditMode("password")}
                      className="menu-item"
                    >
                      <Lock size={16} /> Change Password
                    </button>

                    <button
                      onClick={onLogout}
                      className="menu-item text-red-600"
                    >
                      <LogOut size={16} /> Logout
                    </button>

                    {/* Inline editor */}
                    {editMode && (
                      <div className="p-3 border-t">
                        <input
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          placeholder={
                            editMode === "name"
                              ? "New username"
                              : "New password"
                          }
                          type={editMode === "password" ? "password" : "text"}
                          className="w-full px-3 py-2 rounded border bg-transparent mb-2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={save}
                            className="flex-1 bg-indigo-600 text-white rounded py-1"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditMode(null)}
                            className="flex-1 border rounded py-1"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-3 py-1 rounded bg-indigo-600 text-white"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div
          className={`sm:hidden px-4 py-3 border-t ${
            darkMode
              ? "bg-gray-900 border-gray-800 text-gray-100"
              : "bg-white border-gray-200 text-gray-900"
          }`}
        >
          {user ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Avatar name={user.name} />
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs opacity-70">{user.email}</div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full p-2 rounded bg-red-500 text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="w-full p-2 rounded bg-indigo-600 text-white"
            >
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
