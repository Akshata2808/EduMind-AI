import axios from 'axios';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

console.log('=== EduMind AI Diagnostics ===');
console.log('PORT:', process.env.PORT || 5005);
console.log('MongoDB URI (masked):', process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@') : 'Not set');
console.log('Gemini API Key (masked):', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.slice(0, 6)}...${process.env.GEMINI_API_KEY.slice(-4)}` : 'Not set');

async function testMongo() {
  if (!process.env.MONGODB_URI) {
    console.log('❌ MongoDB URI is missing from .env');
    return;
  }
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connected successfully!');
    await mongoose.disconnect();
  } catch (err) {
    console.log('❌ MongoDB connection failed:', err.message);
  }
}

async function testGemini25() {
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY is missing from .env');
    return;
  }
  
  const testPrompt = 'Respond with "Hello World from Gemini 2.5!"';
  try {
    console.log('Sending test request to Gemini API (gemini-2.5-flash)...');
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: testPrompt }]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('✅ Gemini 2.5 response:', text ? text.trim() : 'Empty response');
  } catch (err) {
    console.log('❌ Gemini API request failed!');
    if (err.response) {
      console.log('Response Status:', err.response.status);
      console.log('Response Data:', JSON.stringify(err.response.data));
    } else {
      console.log('Error Message:', err.message);
    }
  }
}

async function run() {
  await testMongo();
  console.log('---------------------------');
  await testGemini25();
  process.exit(0);
}

run();
