import express from 'express';
import ForumPost from '../models/ForumPost.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Helper to optionally resolve user name from token
const getOptionalUser = async (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id);
      return user;
    } catch (e) {
      return null;
    }
  }
  return null;
};

// GET /api/forum
router.get('/', async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving forum posts' });
  }
});

// POST /api/forum
router.post('/', async (req, res) => {
  const { title, content, category, authorName, authorRole, hashtags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const user = await getOptionalUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized. Please sign in to create posts.' });
    }

    const nameOfAuthor = user.name;
    const role = user.branch ? `${user.branch} Student` : 'Registered Student';

    // Generate initials for avatar fallback
    const initials = nameOfAuthor
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const avatarVal = user.avatar || initials;

    const newPost = new ForumPost({
      title,
      content,
      category: category || 'General Talk',
      authorName: nameOfAuthor,
      authorRole: role,
      avatar: avatarVal,
      hashtags: hashtags || []
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating post' });
  }
});

// POST /api/forum/:id/like
router.post('/:id/like', async (req, res) => {
  const { userIdentifier } = req.body;
  if (!userIdentifier) {
    return res.status(400).json({ message: 'User identifier is required to like posts' });
  }

  try {
    const user = await getOptionalUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized. Please sign in to like posts.' });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Forum post not found' });
    }

    const likedIndex = post.likedBy.indexOf(userIdentifier);
    if (likedIndex > -1) {
      post.likedBy.splice(likedIndex, 1);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userIdentifier);
      post.likes += 1;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error processing like' });
  }
});

// POST /api/forum/:id/bookmark
router.post('/:id/bookmark', async (req, res) => {
  const { userIdentifier } = req.body;
  if (!userIdentifier) {
    return res.status(400).json({ message: 'User identifier is required to bookmark posts' });
  }

  try {
    const user = await getOptionalUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized. Please sign in to bookmark posts.' });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Forum post not found' });
    }

    const bookmarkedIndex = post.bookmarkedBy.indexOf(userIdentifier);
    if (bookmarkedIndex > -1) {
      post.bookmarkedBy.splice(bookmarkedIndex, 1);
      post.bookmarks = Math.max(0, post.bookmarks - 1);
    } else {
      post.bookmarkedBy.push(userIdentifier);
      post.bookmarks += 1;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error processing bookmark' });
  }
});

// POST /api/forum/:id/reply
router.post('/:id/reply', async (req, res) => {
  const { content, authorName, authorRole } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Reply content is required' });
  }

  try {
    const user = await getOptionalUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized. Please sign in to reply.' });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Forum post not found' });
    }

    const nameOfAuthor = user.name;
    const role = user.branch ? `${user.branch} Student` : 'Registered Student';

    const initials = nameOfAuthor
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const avatarVal = user.avatar || initials;

    const reply = {
      authorName: nameOfAuthor,
      authorRole: role,
      avatar: avatarVal,
      content,
      createdAt: new Date()
    };

    post.replies.push(reply);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding reply' });
  }
});

export default router;
