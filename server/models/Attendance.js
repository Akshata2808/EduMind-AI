import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalLectures: { type: Number, default: 0 },
  attended: { type: Number, default: 0 },
  skipEstimate: { type: Number, default: 0 },
  predicted: { type: Number, default: 0 },
  warning: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
