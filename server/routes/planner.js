import express from 'express';
import { protect } from '../middleware/auth.js';
import Task from '../models/Task.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: 1 });
    const mappedTasks = tasks.map(t => ({
      id: t._id.toString(),
      title: t.title,
      dueDate: t.dueDate,
      completed: t.completed
    }));
    res.json({ tasks: mappedTasks });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  const { title, dueDate } = req.body;
  try {
    const taskObj = await Task.create({
      user: req.user._id,
      title: title || 'New task',
      dueDate: dueDate || '',
      completed: false
    });
    
    res.json({
      task: {
        id: taskObj._id.toString(),
        title: taskObj.title,
        dueDate: taskObj.dueDate,
        completed: taskObj.completed
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});

router.patch('/:id', protect, async (req, res) => {
  try {
    await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body }
    );
    
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: 1 });
    const mappedTasks = tasks.map(t => ({
      id: t._id.toString(),
      title: t.title,
      dueDate: t.dueDate,
      completed: t.completed
    }));
    
    res.json({ tasks: mappedTasks });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: 1 });
    const mappedTasks = tasks.map(t => ({
      id: t._id.toString(),
      title: t.title,
      dueDate: t.dueDate,
      completed: t.completed
    }));
    
    res.json({ tasks: mappedTasks });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
});

export default router;
