const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo_application';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'dev-admin-secret';

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// ----------------------
// MONGO CONNECTION
// ----------------------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error', err));

// ----------------------
// MODELS
// ----------------------
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const TodoSchema = new Schema({
  userId: { type: String, required: true }, // FIXED: store userId instead of name
  userName: { type: String },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

const User = mongoose.model('User', UserSchema);
const Todo = mongoose.model('Todo', TodoSchema);

// ----------------------
// AUTH MIDDLEWARE
// ----------------------
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });

  const token = auth.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ----------------------
// REGISTER
// ----------------------
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const userDoc = await User.create({ name, email, password: hashed });

    const token = jwt.sign(
      { userId: userDoc._id, name: userDoc.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: { id: userDoc._id, name: userDoc.name, email: userDoc.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// LOGIN
// ----------------------
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, userDoc.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: userDoc._id, name: userDoc.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: { id: userDoc._id, name: userDoc.name, email: userDoc.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// CURRENT USER
// ----------------------
app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// ----------------------
// GET TODOS
// ----------------------
app.get('/api/todos', authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ todos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// ADD TODO
// ----------------------
app.post('/api/todos', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Todo text required' });

    const todo = await Todo.create({
      userId: req.user.userId,
      userName: req.user.name,
      text,
      createdAt: Date.now(),
    });

    res.json({ todo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// UPDATE TODO
// ----------------------
app.put('/api/todos/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const { text, completed } = req.body;

    const update = {};
    if (text !== undefined) update.text = text;
    if (completed !== undefined) update.completed = completed;

    const result = await Todo.updateOne(
      { _id: id, userId: req.user.userId },
      { $set: update }
    );

    res.json({ updated: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// DELETE TODO
// ----------------------
app.delete('/api/todos/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Todo.deleteOne({
      _id: id,
      userId: req.user.userId,
    });

    res.json({ deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// RESET PASSWORD
// ----------------------
app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword)
    return res.status(400).json({ error: 'Email and new password required' });

  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) return res.status(400).json({ error: 'User not found' });

    userDoc.password = await bcrypt.hash(newPassword, 10);
    await userDoc.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// add profile
app.put('/api/profile', auth, async (req, res) =>{
  const {name } = req.body;
  if(!name) return res.status(400).json({error: 'Name is Required'});
  const user = await User.findById(req.user.userId);
  user.name = name;
  await user.save();

  res.json({success: true, name})
})

// ----------------------
// ADMIN DEBUG
// ----------------------
app.get('/admin/debug', async (req, res) => {
  const secret = req.query.secret || req.headers['x-admin-secret'];
  if (!secret || secret !== ADMIN_SECRET)
    return res.status(403).json({ error: 'Forbidden' });

  try {
    const users = await User.find().select('-password').lean();
    const todos = await Todo.find().lean();
    res.json({ users, todos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
