import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  authorName: { type: String, default: 'Guest Student' },
  authorRole: { type: String, default: 'Student' },
  avatar: { type: String, default: '' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const forumPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'General Talk' },
  authorName: { type: String, default: 'Guest Student' },
  authorRole: { type: String, default: 'Student' },
  avatar: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
  bookmarks: { type: Number, default: 0 },
  bookmarkedBy: { type: [String], default: [] },
  hashtags: { type: [String], default: [] },
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now }
});

const ForumPost = mongoose.model('ForumPost', forumPostSchema);
export default ForumPost;
