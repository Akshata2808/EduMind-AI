import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const localUri = 'mongodb://127.0.0.1:27017/edumind-ai';

async function test() {
  try {
    console.log('Connecting to local MongoDB...');
    await mongoose.connect(localUri);
    console.log('✅ Connected!');
    
    // Check existing indexes
    try {
      const indexes = await mongoose.connection.db.collection('users').indexes();
      console.log('Existing database indexes on "users":');
      indexes.forEach(idx => {
        console.log(` - ${idx.name}:`, idx.key);
      });
    } catch (e) {
      console.log('No existing user indexes or collection empty.');
    }

    console.log('\nSimulating user registration...');
    const email = `test_${Date.now()}@gmail.com`;
    const hashed = await bcrypt.hash('password123', 10);
    
    const user = await User.create({
      name: 'Test Student',
      email,
      password: hashed,
      college: 'VSIT',
      branch: 'IT',
      semester: '4',
      role: 'student'
    });
    console.log('✅ User created successfully in database:', user.email);
  } catch (err) {
    console.error('\n❌ ERROR DURING CREATION:');
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected.');
  }
}

test();
