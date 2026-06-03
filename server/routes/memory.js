import express from 'express';
import { protect } from '../middleware/auth.js';
import Memory from '../models/Memory.js';

const router = express.Router();

// Get current user's memory (or create default)
router.get('/', protect, async (req, res) => {
  try {
    let mem = await Memory.findOne({ user: req.user._id });
    if (!mem) {
      mem = await Memory.create({ user: req.user._id });
    }
    res.json({ memory: mem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load memory', error: error.message });
  }
});

// Update memory (partial)
router.patch('/', protect, async (req, res) => {
  try {
    const updates = req.body || {};
    const mem = await Memory.findOneAndUpdate({ user: req.user._id }, { $set: updates }, { new: true, upsert: true });
    res.json({ memory: mem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update memory', error: error.message });
  }
});

// Add a doubt
router.post('/doubt', protect, async (req, res) => {
  try {
    const { question, answer } = req.body;
    const mem = await Memory.findOneAndUpdate({ user: req.user._id }, { $push: { doubts: { question, answer } } }, { new: true, upsert: true });
    res.json({ memory: mem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add doubt', error: error.message });
  }
});

// Delete a doubt by id
router.delete('/doubt/:id', protect, async (req, res) => {
  try {
    const mem = await Memory.findOneAndUpdate({ user: req.user._id }, { $pull: { doubts: { _id: req.params.id } } }, { new: true });
    res.json({ memory: mem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete doubt', error: error.message });
  }
});

export default router;
