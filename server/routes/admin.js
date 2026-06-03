import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import ForumPost from '../models/ForumPost.js';
import Note from '../models/Note.js';
import Quiz from '../models/Quiz.js';
import Task from '../models/Task.js';
import Attendance from '../models/Attendance.js';

const router = express.Router();

// Admin security guard
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
  }
};

// GET /api/admin/stats - Retrieve counts of all assets
router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const forumCount = await ForumPost.countDocuments();
    const noteCount = await Note.countDocuments();
    const quizCount = await Quiz.countDocuments();
    const taskCount = await Task.countDocuments();

    res.json({
      stats: {
        users: userCount,
        forumPosts: forumCount,
        summaries: noteCount,
        quizzes: quizCount,
        plannerTasks: taskCount
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admin stats', error: err.message });
  }
});

// GET /api/admin/users - Retrieve all users (except passwords)
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// PATCH /api/admin/users/:id/role - Promote/demote a user
router.patch('/users/:id/role', protect, isAdmin, async (req, res) => {
  const { role } = req.body;
  if (!role || !['student', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot change your own role!' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update role', error: err.message });
  }
});

// DELETE /api/admin/users/:id - Delete user and cascading records
router.delete('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account!' });
    }

    const userId = req.params.id;
    
    // Delete related records
    await Note.deleteMany({ user: userId });
    await Quiz.deleteMany({ user: userId });
    await Task.deleteMany({ user: userId });
    await Attendance.deleteMany({ user: userId });
    
    // Remove user account
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: `Successfully deleted user ${deletedUser.email} and all related records.` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

// DELETE /api/admin/forum/:id - Moderate and delete a forum thread
router.delete('/forum/:id', protect, isAdmin, async (req, res) => {
  try {
    const deletedPost = await ForumPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: 'Forum post not found' });
    res.json({ message: 'Successfully deleted forum post and all its replies.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete forum post', error: err.message });
  }
});

export default router;
