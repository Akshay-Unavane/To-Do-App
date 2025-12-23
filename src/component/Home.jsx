import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Pencil, Plus, Trash } from "lucide-react";
import api from '../api'
import ProfileMenu from "./profileMenu";



function ToDoPage({ darkMode }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const tasksEndRef = useRef(null);
  // reference motion to avoid unused-import lint when JSX usage isn't detected
  void motion

  // Load todos from server
  useEffect(() => {
    let mounted = true
    async function load(){
      try{
        const res = await api.getTodos()
        if(mounted){
          // normalize completed to boolean and ensure each todo has a stable `id` string
          const serverTodos = (res?.todos || []).map(t => ({ ...t, id: t._id || t.id, completed: !!t.completed }))
          setTasks(serverTodos)
        }
      }catch(err){
        console.warn('could not load todos from server', err)
        // fallback to local storage if server unavailable
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        if(mounted) setTasks(savedTasks)
      }
    }
    load()
    return () => { mounted = false }
  }, []);

  // Save local cache of tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Scroll to newest task
  useEffect(() => {
    tasksEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tasks, filter]);

  // CRUD
  const addTask = () => {
    if (newTask.trim() === "") return;
    const text = newTask.trim()
    setNewTask("")
    // create on server, fallback to local id
    ;(async () => {
      try{
        const res = await api.createTodo(text)
        const todo = res?.todo
        if(todo){
          // normalize id and completed
          setTasks(prev => [...prev, { ...todo, id: todo._id || todo.id, completed: !!todo.completed }])
          return
        }
      }catch(err){ console.warn('createTodo failed', err) }
      // fallback: local-only
      const task = { id: Date.now(), text, completed: false };
      setTasks(prev => [...prev, task]);
    })()
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    // sync to server
    const target = tasks.find(t=>t.id===id)
    const newCompleted = target ? !target.completed : true
    ;(async ()=>{
      try{
        await api.updateTodo(id, { completed: newCompleted ? 1 : 0 })
      }catch(err){ console.warn('updateTodo failed', err) }
    })()
  }

  const deleteTask = (id) =>{
    setTasks(prev => prev.filter((t) => t.id !== id))
    ;(async ()=>{
      try{ await api.deleteTodo(id) }catch(err){ console.warn('deleteTodo failed', err) }
    })()
  }

  const startEdit = (task) => {
    setEditId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    const text = editText
    setTasks(prev => prev.map((t) => (t.id === id ? { ...t, text } : t)));
    setEditId(null);
    setEditText("");
    ;(async ()=>{
      try{ await api.updateTodo(id, { text }) }catch(err){ console.warn('updateTodo failed', err) }
    })()
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
      className={`min-h-screen flex flex-col items-center justify-center py-10 transition-colors duration-700 ${darkMode ? 'bg-gradient-to-br from-indigo-900 via-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-indigo-50 to-white text-gray-900'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      
      {/* Main card */}
      <motion.div
        className={`w-full max-w-4xl px-6 py-8 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl ${darkMode ? 'bg-gradient-to-br from-indigo-900/60 via-indigo-800/50 to-indigo-700/40' : 'bg-gradient-to-br from-white/80 to-indigo-50'}`}
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <span className="text-3xl">📝</span>
              <span>My Tasks</span>
            </h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 text-sm`}>A focused list to help you ship work faster.</p>
          </div>

          

          {/* Stats + progress */}
          <div className="w-full md:w-72">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500 dark:text-gray-300">Progress</div>
              <div className="text-sm font-semibold">{rate}%</div>
            </div>
            <div className="w-full h-2 bg-white/30 dark:bg-white/10 rounded-full overflow-hidden">
              <div className="h-2 bg-indigo-500 rounded-full" style={{ width: `${rate}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <div>{active} active</div>
              <div>{completed} done</div>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTask(); } }}
              placeholder="Add a new task — e.g. 'Buy coffee'"
              aria-label="New task"
              className={`w-full p-3 pl-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${darkMode ? 'bg-gray-800/60 border-gray-700 placeholder-gray-300 text-gray-100' : 'bg-white/70 border-white/20 placeholder-gray-500 text-gray-900'}`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Press Enter to add</span>
          </div>
          <motion.button
            onClick={addTask}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="shrink-0 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-md flex items-center gap-2 hover:bg-indigo-700"
          >
            <Plus/>
            Add
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-start gap-3 mb-4">
          {['all','active','completed'].map(f=> (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm ${filter===f ? 'bg-indigo-600 text-white' : 'bg-white/10 dark:bg-white/5 text-gray-700 dark:text-gray-200'}`}
              aria-pressed={filter===f}
            >{f[0].toUpperCase() + f.slice(1)}</button>
          ))}
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
                  className={`flex justify-between items-center p-4 mb-3 rounded-xl backdrop-blur-md border border-white/10 shadow-sm hover:shadow-md transition-all ${darkMode ? 'bg-indigo-900/40' : 'bg-white/60'}`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="font-semibold">{index + 1}.</span>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5 cursor-pointer accent-indigo-500"
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
                        className={`flex-1 text-left cursor-pointer text-base capitalize ${task.completed ? 'line-through text-gray-300' : 'hover:text-[#e4e8e7]'}`}
                      >
                        {task.text}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {editId === task.id ? (
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="text-green-500 hover:scale-110 transition"
                      >
                        <Check />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(task)}
                        className="text-blue-700 hover:scale-110 transition"
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
              <motion.div className={`flex flex-col items-center justify-center py-12 text-center ${darkMode ? 'text-gray-300' : 'text-gray-500'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-4 text-6xl">✨</div>
                <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
                <p className="text-sm">Add your first task using the input above — it's quick and easy.</p>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={tasksEndRef} />
        </div>

        {/* Stats */}
        <motion.div
          className={`grid grid-cols-4 gap-4 p-4 rounded-xl backdrop-blur-md border border-white/20 ${darkMode ? 'bg-indigo-900/30' : 'bg-white/10'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h3 className="text-lg  font-bold ">{total}</h3>
            <p className={`text-md font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">{active}</h3>
            <p className={`text-md font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">{completed}</h3>
            <p className={`text-md font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Completed</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">{rate}%</h3>
            <p className={`text-md font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Rate</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ToDoPage;
