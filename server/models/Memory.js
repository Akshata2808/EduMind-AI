import mongoose from 'mongoose';

const doubtSchema = new mongoose.Schema({
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now }
});

const memorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weakSubjects: { type: [String], default: [] },
  doubts: { type: [doubtSchema], default: [] },
  studyPatterns: { type: mongoose.Mixed, default: {} },
  attendanceTrends: { type: mongoose.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

memorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Memory = mongoose.model('Memory', memorySchema);
export default Memory;
