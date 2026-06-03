import express from 'express';
import { protect } from '../middleware/auth.js';
import Note from '../models/Note.js';
import Quiz from '../models/Quiz.js';
import Task from '../models/Task.js';
import Attendance from '../models/Attendance.js';

const router = express.Router();

router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Notes count
    const notesCount = await Note.countDocuments({ user: userId });

    // 2. Quiz accuracy
    const quizzes = await Quiz.find({ user: userId });
    let totalQuestions = 0;
    let totalCorrect = 0;
    quizzes.forEach(q => {
      totalQuestions += q.questions.length;
      totalCorrect += q.score || 0;
    });
    const quizAccuracy = totalQuestions > 0 
      ? Math.round((totalCorrect / totalQuestions) * 100) 
      : 0;

    // 3. Planner tasks progress (Now queried from MongoDB Task model)
    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({ user: userId, completed: true });
    const plannerProgress = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    // 4. Attendance (Now loaded dynamically from MongoDB if calculated)
    const attendanceRecord = await Attendance.findOne({ user: userId });
    const attendancePercentage = attendanceRecord ? attendanceRecord.predicted : 85; 

    // 5. Study Streak
    const studyStreak = quizzes.length > 0 ? `${quizzes.length + 2} days` : '0 days';

    return res.json({
      attendance: `${attendancePercentage}%`,
      notesUploaded: notesCount.toString(),
      quizAccuracy: `${quizAccuracy}%`,
      plannerProgress: `${plannerProgress}%`,
      studyStreak
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve dashboard stats', error: error.message });
  }
});

export default router;
