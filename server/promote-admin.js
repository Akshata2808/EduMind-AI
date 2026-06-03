import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const localUri = 'mongodb://127.0.0.1:27017/edumind-ai';

async function promote() {
  try {
    console.log('Connecting to local MongoDB...');
    await mongoose.connect(localUri);
    console.log('✅ Connected!');

    const emailToPromote = 'rohanmane2825@gmail.com';
    console.log(`Searching for user with email: ${emailToPromote}...`);
    
    const user = await User.findOne({ email: emailToPromote });
    if (!user) {
      console.log(`❌ User not found with email: ${emailToPromote}`);
      console.log('👉 Tip: Register this email in the web app first, then run this script to promote it!');
      return;
    }

    user.role = 'admin';
    await user.save();
    console.log(`\n🎉 SUCCESS: User ${user.email} has been promoted to ADMIN!`);
  } catch (err) {
    console.error('❌ Error during promotion:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

promote();
