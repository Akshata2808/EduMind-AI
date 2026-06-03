import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Create nodemailer transport helper
const createMailTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP Configuration variables missing. Password reset links will be printed to terminal.');
    return {
      sendMail: async (mailOptions) => {
        console.log('\n======================================================');
        console.log('📬 SIMULATED EMAIL DELIVERED (DEV MODE):');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Body:\n${mailOptions.text}`);
        console.log('======================================================\n');
        return { messageId: 'simulated-id' };
      }
    };
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

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
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, college: user.college, branch: user.branch, semester: user.semester, role: user.role, avatar: user.avatar } });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Google Sign-In/Register Verification Route
router.post('/google', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: 'Google ID Token is required' });

  try {
    let payload;
    
    // Dev mock bypass handler
    if (idToken.startsWith('mock-google-token-')) {
      const parts = idToken.split('-');
      const email = parts[parts.length - 1];
      const name = email.split('@')[0];
      payload = {
        email,
        name,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
      };
    } else {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID || req.body.clientId
      });
      payload = ticket.getPayload();
    }

    const { email, name, picture } = payload;
    if (!email) return res.status(400).json({ message: 'Invalid token payload (email missing)' });

    let user = await User.findOne({ email });

    if (!user) {
      const assignedRole = email.toLowerCase().trim() === 'rohanmane2825@gmail.com' ? 'admin' : 'student';
      const defaultAvatar = picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
      
      user = await User.create({
        name,
        email,
        college: '',
        branch: '',
        semester: '',
        role: assignedRole,
        avatar: defaultAvatar
      });
    }

    return res.json({
      token: signToken(user._id),
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
    console.error('Google verify error:', error);
    return res.status(500).json({ message: 'Google login failed', error: error.message });
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email address is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Secure response to prevent email harvesting
      return res.json({ message: 'If that email exists in our system, we have sent a reset link.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${req.headers.origin || 'https://edumind-frontend.onrender.com'}/reset-password/${token}`;
    const mailText = `Hi ${user.name},\n\nYou requested to reset your password on EduMind AI.\n\nPlease click the link below to set a new password:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.\n\nCheers,\nEduMind Team`;

    const transporter = createMailTransporter();
    await transporter.sendMail({
      from: `"EduMind AI" <${process.env.SMTP_USER || 'no-reply@edumind.com'}>`,
      to: user.email,
      subject: 'Reset your EduMind AI Password 🔑',
      text: mailText
    });

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.json({
        message: 'SMTP credentials missing. Reset link logged to server terminal.',
        devResetLink: resetLink
      });
    }

    return res.json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Failed to process forgot password request', error: error.message });
  }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) return res.status(400).json({ message: 'New password is required' });

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({ message: 'Password has been reset successfully. You can now login!' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Failed to reset password', error: error.message });
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
