import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import plannerRoutes from './routes/planner.js';
import attendanceRoutes from './routes/attendance.js';
import quizRoutes from './routes/quiz.js';
import memoryRoutes from './routes/memory.js';
import forumRoutes from './routes/forum.js';
import dashboardRoutes from './routes/dashboard.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send({ status: 'EduMind AI backend online' }));

const start = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/edumind-ai';
  let connected = false;

  try {
    console.log('Attempting connection to MongoDB Atlas...');
    await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB Atlas successfully!');
    connected = true;
  } catch (error) {
    console.warn('MongoDB Atlas connection failed. Error details:', error.message);
    console.log('Checking IP whitelist block... Attempting fallback to local MongoDB database...');
    try {
      await mongoose.connect(localUri, { serverSelectionTimeoutMS: 3000 });
      console.log('Connected to local MongoDB (fallback) successfully!');
      connected = true;
    } catch (localError) {
      console.error('\n======================================================');
      console.error('❌ MONGODB CONNECTION ERROR:');
      console.error('Could not connect to MongoDB Atlas OR a local MongoDB instance.');
      console.error('\n👉 Option A: Whitelist your IP on MongoDB Atlas');
      console.error('   1. Log into your MongoDB Atlas Account at https://cloud.mongodb.com/');
      console.error('   2. Go to "Network Access" under Security in the sidebar.');
      console.error('   3. Click "Add IP Address" and select "Allow Access From Anywhere" (0.0.0.0/0) or "Add Current IP Address".');
      console.error('\n👉 Option B: Run a local MongoDB Server');
      console.error('   Make sure you have MongoDB Community Server installed and running locally on port 27017.');
      console.error('======================================================\n');
      process.exit(1);
    }
  }

  if (connected) {
    // Seed Forum Posts if empty
    try {
      const ForumPost = (await import('./models/ForumPost.js')).default;
      const count = await ForumPost.countDocuments();
      if (count === 0) {
        console.log('Forum collection is empty. Seeding initial community data...');
        const fs = await import('fs');
        const path = await import('path');
        const { fileURLToPath } = await import('url');
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const datasetPath = path.join(__dirname, '../dataset/forum_posts_dataset.json');
        
        if (fs.existsSync(datasetPath)) {
          const rawData = fs.readFileSync(datasetPath, 'utf8');
          const data = JSON.parse(rawData);
          await ForumPost.insertMany(data);
          console.log(`Successfully seeded ${data.length} forum posts!`);
        } else {
          console.warn('Forum dataset file not found at:', datasetPath);
        }
      }
    } catch (seedErr) {
      console.error('Error seeding forum dataset:', seedErr);
    }

    const server = app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on port ${PORT}`));
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n======================================================`);
        console.error(`❌ PORT ${PORT} IS ALREADY IN USE.`);
        console.error(`Another process is running on port ${PORT}.`);
        console.error(`Please close any existing terminals running the server, or kill the process.`);
        console.error(`To kill the process on Windows, run the following command in PowerShell:`);
        console.error(`   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force`);
        console.error(`======================================================\n`);
        process.exit(1);
      }
    });

  }
};

start();
