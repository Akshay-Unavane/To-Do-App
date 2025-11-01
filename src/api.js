const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

function _tokenKey(){ return 'todo_app_token' }

export function setToken(token){
  if(token) localStorage.setItem(_tokenKey(), token)
  else localStorage.removeItem(_tokenKey())
}

export function getToken(){
  return localStorage.getItem(_tokenKey())
}

async function authFetch(path, opts = {}){
  const headers = opts.headers || {}
  const token = getToken()
  if(token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers: { 'Content-Type': 'application/json', ...headers } })
  if(res.status === 204) return null
  const data = await res.json().catch(()=>null)
  if(!res.ok) {
    const err = new Error(data?.error || 'Request failed')
    err.info = data
    throw err
  }
  return data
}

export async function login(email, password){
  return authFetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) })
}

export async function register(name, email, password){
  return authFetch('/api/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })
}

export async function me(){
  return authFetch('/api/me')
}

export async function getTodos(){
  return authFetch('/api/todos')
}

export async function createTodo(text){
  return authFetch('/api/todos', { method: 'POST', body: JSON.stringify({ text }) })
}

export async function updateTodo(id, body){
  return authFetch(`/api/todos/${id}`, { method: 'PUT', body: JSON.stringify(body) })
}

export async function deleteTodo(id){
  return authFetch(`/api/todos/${id}`, { method: 'DELETE' })
}

export default {
  setToken, getToken, login, register, me, getTodos, createTodo, updateTodo, deleteTodo
}
