import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Untitled upload' },
  summary: { type: String, default: '' },
  highlights: { type: [String], default: [] },
  questions: { type: [String], default: [] },
  fileName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);
export default Note;
