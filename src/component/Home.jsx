import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Moon, Pencil, Plus, Sun, Trash } from "lucide-react";

function ToDoPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const tasksEndRef = useRef(null);
console.log(setFilter);

  // Load from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const savedTheme = localStorage.getItem("theme") === "dark";
    setTasks(savedTasks);
    setDarkMode(savedTheme);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [tasks, darkMode]);

  // Scroll to newest task
  useEffect(() => {
    tasksEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tasks, filter]);

  // CRUD
  const addTask = () => {
    if (newTask.trim() === "") return;
    const task = { id: Date.now(), text: newTask, completed: false };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTask = (id) =>
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

  const deleteTask = (id) =>
    setTasks(tasks.filter((t) => t.id !== id));

  const startEdit = (task) => {
    setEditId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editText } : t)));
    setEditId(null);
    setEditText("");
  };

  // Filter logic
  const filteredTasks =
    filter === "active"
      ? tasks.filter((t) => !t.completed)
      : filter === "completed"
      ? tasks.filter((t) => t.completed)
      : tasks;

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const rate = total ? ((completed / total) * 100).toFixed(0) : 0;

  return (
    <motion.div
      className={`min-h-screen flex flex-col items-center justify-center py-10 transition-colors duration-700 ${
        darkMode
          ? "bg-[#1B3C53] text-white"
          : "bg-[#e4f4f4] text-[#080e12]"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Glass Card */}
      <motion.div
        className={`w-full max-w-xl px-6 py-8 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl ${
          darkMode ? "bg-[#234C6A]/40" : "bg-[#1B3C53]/40"
        }`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-transparent  rounded-lg bg-clip-text bg-gradient-to-r from-[#060606] to-[#b06f6f] p-2 shadow-lg">
            📝 My Tasks
          </h1>

          {/* Glossy Switch */}
          <motion.div
            className="w-16 h-8 rounded-full relative cursor-pointer shadow-lg"
            onClick={() => setDarkMode(!darkMode)}
            initial={false}
          >
            <motion.div
              className={`absolute inset-0 rounded-full ${
                darkMode
                  ? "bg-[#234C6A]/80 shadow-inner"
                  : "bg-[#B4DEBD]/70 shadow-inner"
              }`}
              style={{ backdropFilter: "blur(6px)" }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              className="w-7 h-7 rounded-full bg-white dark:bg-[#456882] shadow-md absolute top-0.5"
              animate={{ x: darkMode ? 32 : 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.div
                className="flex items-center justify-center w-full h-full"
                initial={false}
                animate={{ rotate: darkMode ? 180 : 0 }}
              >
                {darkMode ? (
                  <Sun className="text-yellow-400 w-4 h-4" />
                ) : (
                  <Moon className="text-[#234C6A] w-4 h-4" />
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 p-3 rounded-lg border border-white/40 bg-white/30 dark:bg-[#234C6A]/40 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6b83a1] transition"
          />
          <motion.button
            onClick={addTask}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#456882] to-[#1B3C53] text-white px-6 py-2 rounded-lg shadow-lg flex justify-center items-center gap-2 hover:opacity-90"
          >
            <Plus/>
            Add Task
          </motion.button>
        </div>

        {/* Task List Container */}
        <div className="max-h-72 overflow-y-auto mb-6 pr-2">
          <AnimatePresence>
            {filteredTasks.length ? (
              filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center p-4 mb-2 rounded-lg bg-white/30 dark:bg-[#234C6A]/40 backdrop-blur-md border border-white/20 shadow hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="font-semibold">{index + 1}.</span>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5 cursor-pointer accent-[#456882]"
                    />
                    {editId === task.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
                        className="flex-1 bg-transparent border-b border-[#B4DEBD] focus:outline-none"
                      />
                    ) : (
                      <span
                        onClick={() => toggleTask(task.id)}
                        className={`flex-1 text-left cursor-pointer text-base ${
                          task.completed
                            ? "line-through text-gray-300"
                            : "hover:text-[#91C4C3]"
                        }`}
                      >
                        {task.text}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {editId === task.id ? (
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="text-green-400 hover:scale-110 transition"
                      >
                        <Check />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(task)}
                        className="text-blue-800 hover:scale-110 transition"
                      >
                        <Pencil />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600 hover:scale-110 transition"
                    >
                      <Trash />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.p
                className="text-gray-200 mt-10 text-center font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No tasks yet — add one above!
              </motion.p>
            )}
          </AnimatePresence>
          <div ref={tasksEndRef} />
        </div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-white/10 dark:bg-[#234C6A]/30 backdrop-blur-md border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h3 className="text-lg  font-bold ">{total}</h3>
            <p className="text-md font-bold text-gray-200">Total</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">{active}</h3>
            <p className="text-md font-bold text-gray-200">Active</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">{completed}</h3>
            <p className="text-md font-bold text-gray-200">Completed</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">{rate}%</h3>
            <p className="text-md font-bold text-gray-200">Rate</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ToDoPage;
