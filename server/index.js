const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo_application'
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'dev-admin-secret'

app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error', err))

// Mongoose models
const { Schema } = mongoose

const UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true })

const TodoSchema = new Schema({
  // store the username (string) instead of an ObjectId so todos are authored
  // by username. This keeps the per-user collections and queries simple.
  user: { type: String, required: true },
  userName: { type: String },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now }
})

const User = mongoose.model('User', UserSchema)
const Todo = mongoose.model('Todo', TodoSchema)

// Per-user collection helper removed — todos are stored in the single `todos` collection.

// helper: authenticate using Bearer token
function authMiddleware(req, res, next){
  const auth = req.headers.authorization
  if(!auth) return res.status(401).json({ error: 'missing auth' })
  const token = auth.split(' ')[1]
  try{
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  }catch(e){
    return res.status(401).json({ error: 'invalid token' })
  }
}

// register (name, email, password)
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body
  if(!email || !password) return res.status(400).json({ error: 'email & password required' })
  try{
    const existing = await User.findOne({ email })
    if(existing) return res.status(400).json({ error: 'email already in use' })
    const hashed = await bcrypt.hash(password, 10)
    const userDoc = await User.create({ name: name||'', email, password: hashed })
    const user = { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email }
    const token = jwt.sign(user, JWT_SECRET)
    res.json({ user, token })
  }catch(err){ res.status(500).json({ error: err.message }) }
})

// login (email, password)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  if(!email || !password) return res.status(400).json({ error: 'email & password required' })
  try{
    const userDoc = await User.findOne({ email })
    if(!userDoc) return res.status(400).json({ error: 'invalid credentials' })
    const ok = await bcrypt.compare(password, userDoc.password)
    if(!ok) return res.status(400).json({ error: 'invalid credentials' })
    const user = { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email }
    const token = jwt.sign(user, JWT_SECRET)
    res.json({ user, token })
  }catch(err){ res.status(500).json({ error: err.message }) }
})

// get current user
app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

// todos endpoints
app.get('/api/todos', authMiddleware, async (req, res) => {
  try{
    // Use the global `todos` collection and filter by username.
    const todos = await Todo.find({ user: req.user.name }).sort({ createdAt: -1 })
    res.json({ todos })
  }catch(err){ res.status(500).json({ error: err.message }) }
})

app.post('/api/todos', authMiddleware, async (req, res) => {
  try{
    const { text } = req.body
    // store a snapshot of the user's name on the todo for easier reading in DB
    const todo = await Todo.create({ user: req.user.name, userName: req.user.name, text, createdAt: Date.now() })
    res.json({ todo })
  }catch(err){ res.status(500).json({ error: err.message }) }
})

app.put('/api/todos/:id', authMiddleware, async (req, res) => {
  try{
    const id = req.params.id
    const { text, completed } = req.body
  const update = {}
  if(typeof text !== 'undefined') update.text = text
  if(typeof completed !== 'undefined') update.completed = !!completed
  const result = await Todo.updateOne({ _id: id, user: req.user.name }, { $set: update })
  // mongoose v6+ uses modifiedCount
  res.json({ updated: result.nModified || result.modifiedCount || 0 })
  }catch(err){ res.status(500).json({ error: err.message }) }
})

app.delete('/api/todos/:id', authMiddleware, async (req, res) => {
  try{
    const id = req.params.id
  const result = await Todo.deleteOne({ _id: id, user: req.user.name })
    res.json({ deleted: result.deletedCount || 0 })
  }catch(err){ res.status(500).json({ error: err.message }) }
})

// Admin debug endpoint (local/dev only) - protected by ADMIN_SECRET
// Returns users (without password) and todos for quick inspection.
app.get('/admin/debug', async (req, res) => {
  const secret = req.query.secret || req.headers['x-admin-secret']
  if(!secret || secret !== ADMIN_SECRET) return res.status(403).json({ error: 'forbidden' })
  try{
    const users = await User.find().select('-password').lean()
    const todos = await Todo.find().lean()
    res.json({ users, todos })
  }catch(err){ res.status(500).json({ error: err.message }) }
})

app.listen(PORT, () => console.log('Server running on', PORT))
