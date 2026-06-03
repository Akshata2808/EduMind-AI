import express from 'express';
import { protect } from '../middleware/auth.js';
import Attendance from '../models/Attendance.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const attendance = await Attendance.findOne({ user: req.user._id });
    if (!attendance) {
      return res.json({
        totalLectures: 30,
        attended: 26,
        skipEstimate: 2,
        current: 87,
        predicted: 81,
        warning: 'Attendance looks good. Keep the streak.'
      });
    }
    
    const current = attendance.totalLectures 
      ? Math.round((attendance.attended / attendance.totalLectures) * 100) 
      : 0;
      
    res.json({
      totalLectures: attendance.totalLectures,
      attended: attendance.attended,
      skipEstimate: attendance.skipEstimate,
      current,
      predicted: attendance.predicted,
      warning: attendance.warning
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendance', error: error.message });
  }
});

router.post('/predict', protect, async (req, res) => {
  const { totalLectures, attended, skipEstimate } = req.body;
  const total = Number(totalLectures) || 0;
  const present = Number(attended) || 0;
  const skip = Number(skipEstimate) || 0;
  
  const current = total ? Math.round((present / total) * 100) : 0;
  const predicted = total + skip ? Math.round((present / (total + skip)) * 100) : current;
  const warning = predicted < 75 ? 'Warning: Your attendance may fall below the safe threshold.' : 'Attendance looks good. Keep the streak.';

  try {
    const attendance = await Attendance.findOneAndUpdate(
      { user: req.user._id },
      {
        totalLectures: total,
        attended: present,
        skipEstimate: skip,
        predicted,
        warning,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );
    
    return res.json({ 
      current, 
      predicted: attendance.predicted, 
      warning: attendance.warning, 
      totalLectures: attendance.totalLectures, 
      attended: attendance.attended, 
      skipEstimate: attendance.skipEstimate 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save prediction', error: error.message });
  }
});

export default router;
