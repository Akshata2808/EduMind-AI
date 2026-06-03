import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  const { name, email, password, college, branch, semester, avatar } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill required fields' });
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    
    // Automatically promote rohanmane2825@gmail.com to Admin, everyone else is a Student
    const assignedRole = email.toLowerCase().trim() === 'rohanmane2825@gmail.com' ? 'admin' : 'student';

    const defaultAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    const user = await User.create({ name, email, password: hashed, college, branch, semester, role: assignedRole, avatar: defaultAvatar });
    return res.json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, college, branch, semester, role: user.role, avatar: user.avatar } });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, college: user.college, branch: user.branch, semester: user.semester, role: user.role, avatar: user.avatar } });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

router.put('/update', protect, async (req, res) => {
  const { name, college, branch, semester, avatar } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (college !== undefined) user.college = college;
    if (branch !== undefined) user.branch = branch;
    if (semester !== undefined) user.semester = semester;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    
    return res.json({ 
      message: 'Profile updated successfully', 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        college: user.college, 
        branch: user.branch, 
        semester: user.semester, 
        role: user.role,
        avatar: user.avatar
      } 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
});

export default router;
