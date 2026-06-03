import express from 'express';
import { protect } from '../middleware/auth.js';
import Quiz from '../models/Quiz.js';
import { generateText } from '../utils/geminiClient.js';
import { mockQuizzes } from '../utils/mockQuizzes.js';

const router = express.Router();

// Match pre-seeded topic search
const findPreseededQuiz = (topic) => {
  const normTopic = topic.toLowerCase().trim();
  const keys = Object.keys(mockQuizzes);
  
  if (mockQuizzes[normTopic]) {
    return { questions: mockQuizzes[normTopic], matchedTopic: normTopic };
  }
  
  const foundKey = keys.find(k => k.includes(normTopic) || normTopic.includes(k));
  if (foundKey) {
    return { questions: mockQuizzes[foundKey], matchedTopic: foundKey };
  }
  
  return null;
};

router.post('/generate', protect, async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ message: 'Topic is required' });

  // 1. Try local matched quiz first
  const localMatch = findPreseededQuiz(topic);
  if (localMatch) {
    try {
      const quiz = await Quiz.create({
        user: req.user._id,
        topic: localMatch.matchedTopic.toUpperCase(),
        questions: localMatch.questions
      });
      return res.json({ quiz, isLocal: true });
    } catch (e) {
      console.error("Local quiz creation error:", e);
    }
  }

  // 2. Fall back to Gemini AI generation for custom topics
  try {
    const prompt = `Create a JSON array of exactly 10 multiple-choice questions on the topic "${topic}" suitable for an engineering student. 
    Respond ONLY with a valid JSON array. Each object in the array must have:
    - "question" (string)
    - "options" (array of 4 strings)
    - "answer" (string, matching one of the options exactly)
    
    Do not include markdown code block formatting like \`\`\`json in your response, just the raw array.`;
    
    const aiText = await generateText(prompt);
    
    let cleanText = aiText.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    const parsedQuestions = JSON.parse(cleanText);
    if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
      // Validate schema format
      const formatted = parsedQuestions.map(q => ({
        question: q.question || 'Question text',
        options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: q.answer || (q.options ? q.options[0] : 'Option A')
      })).slice(0, 10);
      
      const quiz = await Quiz.create({
        user: req.user._id,
        topic: topic.toUpperCase(),
        questions: formatted
      });
      return res.json({ quiz, isLocal: false });
    }
  } catch (error) {
    console.warn("Gemini quiz generation failed, falling back to a preseeded quiz:", error.message);
  }

  // 3. Fail-safe: Fall back to a random pre-seeded quiz (e.g. database normalization)
  try {
    const topics = Object.keys(mockQuizzes);
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const quiz = await Quiz.create({
      user: req.user._id,
      topic: `${topic.toUpperCase()} (Fallback: ${randomTopic.toUpperCase()})`,
      questions: mockQuizzes[randomTopic]
    });
    return res.json({ quiz, isLocal: true, fallback: true });
  } catch (error) {
    return res.status(500).json({ message: 'Quiz generation failed', error: error.message });
  }
});

router.post('/submit', protect, async (req, res) => {
  const { quizId, answers = {} } = req.body;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz || quiz.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    const score = quiz.questions.reduce((acc, question) => {
      return acc + (answers[question.question] === question.answer ? 1 : 0);
    }, 0);
    quiz.score = score;
    await quiz.save();
    return res.json({ score, total: quiz.questions.length, quiz });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to submit quiz', error: err.message });
  }
});

export default router;
