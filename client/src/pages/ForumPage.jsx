import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { AuthContext } from '../context/AuthContext.jsx';
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  TagIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  HeartIcon as HeartOutline,
  BookmarkIcon as BookmarkOutline,
  FolderOpenIcon,
  PlayIcon,
  CodeBracketIcon,
  ShareIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';

// Import our custom UI components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Separator } from '../components/ui/separator.jsx';

const onlineStories = [
  { name: 'Rohan Gupta', role: 'CS Sophomore', avatar: 'RG', status: 'online' },
  { name: 'Dr. Amit Roy', role: 'EE HOD', avatar: 'AR', status: 'online' },
  { name: 'Sarah Jenkins', role: 'ME Senior', avatar: 'SJ', status: 'online' },
  { name: 'Dev Deshmukh', role: 'CE Junior', avatar: 'DD', status: 'away' },
  { name: 'Prof. Sneha', role: 'Math Prof', avatar: 'SD', status: 'online' },
  { name: 'Aarav Sharma', role: 'Freshman', avatar: 'AS', status: 'online' },
  { name: 'Priya Patel', role: 'CS Undergrad', avatar: 'PP', status: 'online' }
];

const ForumPage = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('feed');
  const [showFilters, setShowFilters] = useState(true);

  // Toggle expanded comments for specific post card IDs
  const [expandedComments, setExpandedComments] = useState({});

  // Create Post modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('General Talk');
  const [newHashtags, setNewHashtags] = useState('');
  const [newAuthorName, setNewAuthorName] = useState('');
  
  // Create Reply state
  const [replyContent, setReplyContent] = useState({});
  const [replyAuthor, setReplyAuthor] = useState({});
  const [replyLoading, setReplyLoading] = useState({});

  // Client-side guest identifier
  const [guestId, setGuestId] = useState('');

  const categories = ['All', 'General Talk', 'Exam Prep', 'Project Help', 'Study Groups'];

  const categoryEmojis = {
    'All': '🌐 All',
    'General Talk': '💬 General Talk',
    'Exam Prep': '📚 Exam Prep',
    'Project Help': '🛠️ Project Help',
    'Study Groups': '👥 Study Groups'
  };

  const isExpertRole = (role) => {
    if (!role) return false;
    const r = role.toLowerCase();
    return r.includes('expert') || r.includes('prof') || r.includes('advisor') || r.includes('hod') || r.includes('educator');
  };

  const isUrl = (str) => str && (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/') || str.includes('.'));

  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    let id = localStorage.getItem('edumind_guest_id');
    if (!id) {
      id = 'guest_' + Math.random().toString(36).slice(2, 9);
      localStorage.setItem('edumind_guest_id', id);
    }
    setGuestId(id);
  }, []);

  const userIdentifier = user ? user.email : guestId;

  const MOCK_FORUM_POSTS = [
    {
      _id: "mock_post_1",
      title: "Full Hand-Written Lecture Notes on Neural Networks Backpropagation",
      content: "Just finished summarizing the complete chain-rule derivation for feedforward networks. Uploading these simplified formulas and gradients. Hope it makes the backprop calculus click for everyone before the midterm next Thursday! Let me know if you need the PDF version.",
      category: "Project Help",
      authorName: "Rohan Gupta",
      authorRole: "CS Sophomore",
      avatar: "RG",
      likes: 42,
      bookmarks: 18,
      hashtags: ["NeuralNetworks", "DeepLearning", "LectureNotes", "ML_Math"],
      createdAt: "2026-05-22T08:30:00.000Z",
      likedBy: [],
      bookmarkedBy: [],
      replies: [
        {
          authorName: "Prof. Sneha",
          authorRole: "Math Prof",
          avatar: "PS",
          content: "This is a remarkably clean derivation, Rohan! I recommend my Applied Math class check out your section on partial derivative tracking. Well done.",
          createdAt: "2026-05-22T08:30:00.000Z"
        },
        {
          authorName: "Sarah Jenkins",
          authorRole: "Electrical & Systems Senior",
          avatar: "SJ",
          content: "Lifesaver! The textbook diagram was so cluttered. Your color-coded weights make so much more sense.",
          createdAt: "2026-05-22T09:12:00.000Z"
        }
      ]
    },
    {
      _id: "mock_post_2",
      title: "Varying Scheduler Final Exam Tips & Hidden Topics 🚨",
      content: "Heard from the TA that this year's Operating Systems exam will place massive weight on Multi-Level Feedback Queue (MLFQ) starvation edge cases. Make sure you review the priority boost interval calculation formulas. Don't skip the priority decay diagrams on slide 14!",
      category: "Exam Prep",
      authorName: "Dev Patel",
      authorRole: "Computer Systems Junior",
      avatar: "DP",
      likes: 65,
      bookmarks: 29,
      hashtags: ["OS_Exams", "MLFQ", "FinalsPrep", "Scheduling"],
      createdAt: "2026-05-22T10:15:00.000Z",
      likedBy: [],
      bookmarkedBy: [],
      replies: [
        {
          authorName: "Priya Patel",
          authorRole: "CS Undergrad",
          avatar: "PP",
          content: "Wait, is priority boost done periodically or after a fixed execution interval? My notes say every 100ms.",
          createdAt: "2026-05-22T10:15:00.000Z"
        },
        {
          authorName: "Dev Patel",
          authorRole: "Computer Systems Junior",
          avatar: "DP",
          content: "Priya, yes! 100ms is standard, but the exam might ask how priority behaves if processes enter the queue asynchronously.",
          createdAt: "2026-05-22T10:45:00.000Z"
        }
      ]
    },
    {
      _id: "mock_post_3",
      title: "Best YouTube Lectures/Playlists for Linear Algebra Visualizations?",
      content: "Struggling to build an intuitive, geometric understanding of eigenvalues and vector transformation spaces. Is 3Blue1Brown still the absolute gold standard or are there other channels you'd suggest for advanced engineering math syllabus?",
      category: "General Talk",
      authorName: "Aarav Sharma",
      authorRole: "First Year Engineering Student",
      avatar: "AS",
      likes: 28,
      bookmarks: 7,
      hashtags: ["LinearAlgebra", "MathInSight", "Eigenthings", "LectureVideos"],
      createdAt: "2026-05-22T11:20:00.000Z",
      likedBy: [],
      bookmarkedBy: [],
      replies: [
        {
          authorName: "Dr. Amit Roy",
          authorRole: "EE HOD",
          avatar: "AR",
          content: "Gilbert Strang's MIT OpenCourseWare lectures are exceptional for rigorous proofs. Use 3Blue1Brown for intuition, and Strang for solving systems.",
          createdAt: "2026-05-22T11:20:00.000Z"
        },
        {
          authorName: "Aarav Sharma",
          authorRole: "First Year Engineering Student",
          avatar: "AS",
          content: "Thank you, Professor! I'll match those playlists together for my study checklist.",
          createdAt: "2026-05-22T12:05:00.000Z"
        }
      ]
    },
    {
      _id: "mock_post_4",
      title: "Interactive Study Session: Designing a Smart Attendance Tracker Database Schema",
      content: "Working on a side project to model student academic attendance compliance across different grading policies. Here is a snippet of my SQL DDL schema. Would love to get some feedback on how to handle lecture rescheduling edge-cases efficiently.",
      category: "Study Groups",
      authorName: "Sarah Jenkins",
      authorRole: "Electrical & Systems Senior",
      avatar: "SJ",
      likes: 34,
      bookmarks: 12,
      hashtags: ["DatabaseDesign", "SQL_Schemas", "SideProjects", "DevFlow"],
      createdAt: "2026-05-22T12:40:00.000Z",
      likedBy: [],
      bookmarkedBy: [],
      replies: [
        {
          authorName: "Rohan Gupta",
          authorRole: "CS Sophomore",
          avatar: "RG",
          content: "You might want to add a junction table for 'RescheduledLectures' mapping the original session ID to the new date, to preserve historical metrics.",
          createdAt: "2026-05-22T12:40:00.000Z"
        }
      ]
    }
  ];

  const fetchPosts = async () => {
    const mergeLocalRepliesAndLikes = (postList) => {
      const localReplies = JSON.parse(localStorage.getItem('edumind_local_replies') || '{}');
      const localLikes = JSON.parse(localStorage.getItem('edumind_local_likes') || '{}');
      const localBookmarks = JSON.parse(localStorage.getItem('edumind_local_bookmarks') || '{}');

      return postList.map(p => {
        let updatedPost = { ...p };
        if (localReplies[p._id]) {
          updatedPost.replies = [...(p.replies || []), ...localReplies[p._id]];
        }
        if (localLikes[p._id]) {
          updatedPost.likes = localLikes[p._id].likes;
          updatedPost.likedBy = localLikes[p._id].likedBy;
        }
        if (localBookmarks[p._id]) {
          updatedPost.bookmarks = localBookmarks[p._id].bookmarks;
          updatedPost.bookmarkedBy = localBookmarks[p._id].bookmarkedBy;
        }
        return updatedPost;
      });
    };

    try {
      const { data } = await api.get('/forum');
      const localPosts = JSON.parse(localStorage.getItem('edumind_local_posts') || '[]');
      const rawPosts = data && data.length > 0 ? [...localPosts, ...data] : [...localPosts, ...MOCK_FORUM_POSTS];
      const merged = mergeLocalRepliesAndLikes(rawPosts);
      setPosts(merged);
      setFilteredPosts(merged);
    } catch (err) {
      console.error('Error fetching forum posts, loading local mock posts instead:', err);
      const localPosts = JSON.parse(localStorage.getItem('edumind_local_posts') || '[]');
      const rawPosts = [...localPosts, ...MOCK_FORUM_POSTS];
      const merged = mergeLocalRepliesAndLikes(rawPosts);
      setPosts(merged);
      setFilteredPosts(merged);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts whenever search, activeCategory, activeTab, or posts change
  useEffect(() => {
    let result = posts;

    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Filter by Search Query
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        p => p.title.toLowerCase().includes(query) || 
             p.content.toLowerCase().includes(query) ||
             (p.hashtags && p.hashtags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Filter/Sort by Active Tab
    if (activeTab === 'trending') {
      result = [...result].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (activeTab === 'bookmarks') {
      result = result.filter(p => p.bookmarkedBy?.includes(userIdentifier));
    }

    setFilteredPosts(result);
  }, [search, activeCategory, activeTab, posts]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const hashtagsArray = newHashtags
      .split(',')
      .map(tag => tag.replace('#', '').trim())
      .filter(Boolean);

    try {
      const { data } = await api.post('/forum', {
        title: newTitle.trim(),
        content: newContent.trim(),
        category: newCategory,
        authorName: newAuthorName.trim() || undefined,
        hashtags: hashtagsArray
      });

      setPosts([data, ...posts]);
      setNewTitle('');
      setNewContent('');
      setNewHashtags('');
      setNewAuthorName('');
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating discussion post, saving locally instead:', err);
      const fallbackPost = {
        _id: 'local_post_' + Math.random().toString(36).slice(2, 9),
        title: newTitle.trim(),
        content: newContent.trim(),
        category: newCategory,
        authorName: user ? user.name : (newAuthorName.trim() || 'Guest Student'),
        authorRole: user ? (user.branch ? `${user.branch} Student` : 'Registered Student') : 'Guest Student',
        avatar: user ? (user.avatar || user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)) : ((newAuthorName.trim() || 'Guest').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)),
        likes: 0,
        bookmarks: 0,
        hashtags: hashtagsArray,
        createdAt: new Date().toISOString(),
        likedBy: [],
        bookmarkedBy: [],
        replies: []
      };

      const localPosts = JSON.parse(localStorage.getItem('edumind_local_posts') || '[]');
      localPosts.unshift(fallbackPost);
      localStorage.setItem('edumind_local_posts', JSON.stringify(localPosts));

      setPosts([fallbackPost, ...posts]);
      setNewTitle('');
      setNewContent('');
      setNewHashtags('');
      setNewAuthorName('');
      setShowCreateModal(false);
    }
  };

  const handlePostReply = async (postId, e) => {
    e.preventDefault();
    const contentText = replyContent[postId];
    const authorVal = replyAuthor[postId];

    if (!contentText || !contentText.trim()) return;

    setReplyLoading({ ...replyLoading, [postId]: true });
    try {
      const { data } = await api.post(`/forum/${postId}/reply`, {
        content: contentText,
        authorName: authorVal?.trim() || undefined,
        authorRole: user ? undefined : 'Guest Student'
      });

      const updatedPosts = posts.map(p => p._id === postId ? data : p);
      setPosts(updatedPosts);
      setReplyContent({ ...replyContent, [postId]: '' });
      setReplyAuthor({ ...replyAuthor, [postId]: '' });
    } catch (err) {
      console.error('Error replying to post, saving locally instead:', err);
      
      const newReply = {
        authorName: authorVal?.trim() || (user ? user.name : 'Guest Student'),
        authorRole: user ? 'Student' : 'Guest Student',
        avatar: (authorVal?.trim() || (user ? user.name : 'Guest')).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        content: contentText,
        createdAt: new Date().toISOString()
      };

      const targetPost = posts.find(p => p._id === postId);
      if (!targetPost) return;

      const updatedPost = {
        ...targetPost,
        replies: [...(targetPost.replies || []), newReply]
      };

      const updatedPosts = posts.map(p => p._id === postId ? updatedPost : p);
      setPosts(updatedPosts);

      if (postId.startsWith('local_post_')) {
        const localPosts = JSON.parse(localStorage.getItem('edumind_local_posts') || '[]');
        const updatedLocalPosts = localPosts.map(p => p._id === postId ? updatedPost : p);
        localStorage.setItem('edumind_local_posts', JSON.stringify(updatedLocalPosts));
      } else {
        const localReplies = JSON.parse(localStorage.getItem('edumind_local_replies') || '{}');
        if (!localReplies[postId]) {
          localReplies[postId] = [];
        }
        localReplies[postId].push(newReply);
        localStorage.setItem('edumind_local_replies', JSON.stringify(localReplies));
      }

      setReplyContent({ ...replyContent, [postId]: '' });
      setReplyAuthor({ ...replyAuthor, [postId]: '' });
    } finally {
      setReplyLoading({ ...replyLoading, [postId]: false });
    }
  };

  const handleToggleLike = async (postId, e) => {
    if (e) e.stopPropagation();
    if (!userIdentifier) return;
    try {
      const { data } = await api.post(`/forum/${postId}/like`, { userIdentifier });
      const updatedPosts = posts.map(p => p._id === postId ? { ...p, likes: data.likes, likedBy: data.likedBy } : p);
      setPosts(updatedPosts);
    } catch (err) {
      console.error('Error toggling like, saving locally instead:', err);
      const post = posts.find(p => p._id === postId);
      if (!post) return;

      const likedBy = post.likedBy || [];
      const hasLiked = likedBy.includes(userIdentifier);
      const newLikedBy = hasLiked ? likedBy.filter(id => id !== userIdentifier) : [...likedBy, userIdentifier];
      const newLikes = hasLiked ? Math.max(0, (post.likes || 0) - 1) : (post.likes || 0) + 1;

      const updatedPost = {
        ...post,
        likes: newLikes,
        likedBy: newLikedBy
      };

      const updatedPosts = posts.map(p => p._id === postId ? updatedPost : p);
      setPosts(updatedPosts);

      if (postId.startsWith('local_post_')) {
        const localPosts = JSON.parse(localStorage.getItem('edumind_local_posts') || '[]');
        const updatedLocalPosts = localPosts.map(p => p._id === postId ? updatedPost : p);
        localStorage.setItem('edumind_local_posts', JSON.stringify(updatedLocalPosts));
      } else {
        const localLikes = JSON.parse(localStorage.getItem('edumind_local_likes') || '{}');
        localLikes[postId] = { likes: newLikes, likedBy: newLikedBy };
        localStorage.setItem('edumind_local_likes', JSON.stringify(localLikes));
      }
    }
  };

  const handleToggleBookmark = async (postId, e) => {
    if (e) e.stopPropagation();
    if (!userIdentifier) return;
    try {
      const { data } = await api.post(`/forum/${postId}/bookmark`, { userIdentifier });
      const updatedPosts = posts.map(p => p._id === postId ? { ...p, bookmarks: data.bookmarks, bookmarkedBy: data.bookmarkedBy } : p);
      setPosts(updatedPosts);
    } catch (err) {
      console.error('Error toggling bookmark, saving locally instead:', err);
      const post = posts.find(p => p._id === postId);
      if (!post) return;

      const bookmarkedBy = post.bookmarkedBy || [];
      const hasBookmarked = bookmarkedBy.includes(userIdentifier);
      const newBookmarkedBy = hasBookmarked ? bookmarkedBy.filter(id => id !== userIdentifier) : [...bookmarkedBy, userIdentifier];
      const newBookmarks = hasBookmarked ? Math.max(0, (post.bookmarks || 0) - 1) : (post.bookmarks || 0) + 1;

      const updatedPost = {
        ...post,
        bookmarks: newBookmarks,
        bookmarkedBy: newBookmarkedBy
      };

      const updatedPosts = posts.map(p => p._id === postId ? updatedPost : p);
      setPosts(updatedPosts);

      if (postId.startsWith('local_post_')) {
        const localPosts = JSON.parse(localStorage.getItem('edumind_local_posts') || '[]');
        const updatedLocalPosts = localPosts.map(p => p._id === postId ? updatedPost : p);
        localStorage.setItem('edumind_local_posts', JSON.stringify(updatedLocalPosts));
      } else {
        const localBookmarks = JSON.parse(localStorage.getItem('edumind_local_bookmarks') || '{}');
        localBookmarks[postId] = { bookmarks: newBookmarks, bookmarkedBy: newBookmarkedBy };
        localStorage.setItem('edumind_local_bookmarks', JSON.stringify(localBookmarks));
      }
    }
  };

  const toggleCommentsExpansion = (postId) => {
    setExpandedComments({
      ...expandedComments,
      [postId]: !expandedComments[postId]
    });
  };

  const getCategoryStyles = (cat) => {
    switch (cat) {
      case 'Exam Prep': return 'bg-amber-100/70 text-amber-900 border-amber-200/50';
      case 'Project Help': return 'bg-mint/70 text-emerald-950 border-emerald-200/50';
      case 'Study Groups': return 'bg-purple-100/70 text-purple-900 border-purple-200/50';
      default: return 'bg-emerald-100/70 text-emerald-900 border-emerald-200/50';
    }
  };

  // Helper to render mock visuals for files/playlists/code snippets
  const renderAttachment = (post) => {
    const hasNoteTag = post.hashtags?.some(tag => tag.toLowerCase().includes('note') || tag.toLowerCase().includes('pdf'));
    const hasCodeTag = post.hashtags?.some(tag => tag.toLowerCase().includes('code') || tag.toLowerCase().includes('sql') || tag.toLowerCase().includes('schema'));
    const hasVideoTag = post.hashtags?.some(tag => tag.toLowerCase().includes('video') || tag.toLowerCase().includes('youtube') || tag.toLowerCase().includes('lecture'));

    if (hasNoteTag) {
      return (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-sage/20 bg-mint/15 p-4 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-900 shadow-sm border border-sage/10">
              <FolderOpenIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">Study_Kit_Syllabus_Guide.pdf</p>
              <p className="text-[10px] font-semibold text-emerald-950">Engineering Lecture Notes · 14 Pages</p>
            </div>
          </div>
          <button type="button" className="rounded-xl bg-white px-3.5 py-2 text-[10px] font-bold text-emerald-950 shadow-sm border border-sage/20 hover:bg-mint/35 cursor-pointer">
            View PDF
          </button>
        </div>
      );
    }

    if (hasCodeTag) {
      return (
        <div className="mt-4 rounded-2xl border border-sage/20 bg-[#1E2E23] p-4 font-mono text-[10px] leading-relaxed text-emerald-300 shadow-sm overflow-hidden select-none">
          <div className="flex items-center justify-between border-b border-sage/15 pb-2 mb-2 font-sans text-slate-400">
            <span className="flex items-center gap-1.5">
              <CodeBracketIcon className="h-4 w-4 text-slate-500" />
              <span>schema_design.sql</span>
            </span>
            <span className="text-[9px] uppercase tracking-wider font-bold">SQL Snippet</span>
          </div>
          <p className="text-emerald-500/70">{"-- Database Schema Configuration"}</p>
          <p><span className="text-amber-300">CREATE TABLE</span> attendance_compliance (</p>
          <p>&nbsp;&nbsp;student_id <span className="text-pink-400">VARCHAR</span>(50),</p>
          <p>&nbsp;&nbsp;grade_margin <span className="text-pink-400">DECIMAL</span>(5,2)</p>
          <p>);</p>
        </div>
      );
    }

    if (hasVideoTag) {
      return (
        <div className="mt-4 overflow-hidden rounded-2xl border border-sage/20 shadow-sm bg-slate-955 relative aspect-video max-h-[220px] flex items-center justify-center group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
          <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 border border-white/20 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white">
            <PlayIcon className="h-3 w-3 text-emerald-400" />
            <span>Interactive Visual Playlist</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-palegreen/20 border border-sage/30 text-white backdrop-blur-sm shadow-md transition duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-emerald-950 z-20">
            <PlayIcon className="h-5 w-5 fill-current" />
          </div>
          <span className="absolute bottom-3 left-4 text-xs font-bold text-white z-20">Geometric intuition of Transformations</span>
        </div>
      );
    }

    return null;
  };

  const getTrendingTopics = () => {
    const counts = {};
    posts.forEach(post => {
      if (post.hashtags) {
        post.hashtags.forEach(tag => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => ({ tag: `#${entry[0]}`, count: entry[1] }));
  };

  const trendingTopics = getTrendingTopics().length > 0 ? getTrendingTopics() : [
    { tag: '#webdevelopment', count: 124 },
    { tag: '#design', count: 98 },
    { tag: '#opensource', count: 76 },
    { tag: '#ai', count: 189 },
    { tag: '#productivity', count: 54 }
  ];

  const renderPostCard = (post) => {
    const isLiked = post.likedBy?.includes(userIdentifier);
    const isBookmarked = post.bookmarkedBy?.includes(userIdentifier);
    const isCommentsExpanded = !!expandedComments[post._id];
    
    // Generate handles based on author name
    const handle = post.authorName 
      ? `@${post.authorName.toLowerCase().replace(/\s+/g, '')}` 
      : '@guest';

    // Mock shares count for screenshot parity
    const sharesCount = post.shares || Math.floor(((post.likes || 0) + (post.bookmarks || 0)) / 3) || 0;

    return (
      <Card key={post._id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-row items-center justify-between pb-3 mb-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-slate-200 bg-mint/55">
              {isUrl(post.avatar) && <AvatarImage src={post.avatar} />}
              <AvatarFallback className="text-xs font-black bg-mint text-emerald-950">
                {isUrl(post.avatar) ? getInitials(post.authorName) : (post.avatar ? post.avatar.slice(0, 2) : 'ST')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-sm text-slate-900 leading-none">{post.authorName}</span>
                {isExpertRole(post.authorRole) && (
                  <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[8px] font-black uppercase text-emerald-800 border border-emerald-200 shadow-sm">
                    🎓 Expert
                  </span>
                )}
                <span className="text-xs text-slate-400 font-normal leading-none">{handle}</span>
                <span className="text-xs text-slate-300 font-normal leading-none">·</span>
                <span className="text-xs text-slate-400 font-normal leading-none">
                  {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`rounded-full text-[10px] font-semibold ${getCategoryStyles(post.category)}`}>
              {post.category}
            </Badge>
            <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition cursor-pointer">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        <CardContent className="pt-2 p-0">
          <div className="space-y-2">
            {post.title && (
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {post.title}
              </h4>
            )}
            <p className="text-sm text-slate-650 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>

          {/* Previews (PDF/Code/Video) */}
          {renderAttachment(post)}

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="mt-3.5 flex flex-wrap gap-2">
              {post.hashtags.map((tag) => (
                <span 
                  key={tag} 
                  onClick={() => setSearch(tag)}
                  className="text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-0.5 rounded-md transition duration-150 cursor-pointer"
                >
                  #{tag.toLowerCase()}
                </span>
              ))}
            </div>
          )}

          <Separator className="my-3.5 bg-slate-100" />

          {/* Action footer */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-1">
            <div className="flex items-center gap-6">
              {/* Like Button */}
              <button
                onClick={user ? (e) => handleToggleLike(post._id, e) : () => window.location.href = '/auth'}
                className="flex items-center gap-1.5 text-slate-500 hover:text-rose-650 transition cursor-pointer"
              >
                {isLiked && user ? (
                  <svg className="h-5 w-5 text-rose-500 fill-current animate-pulse-once" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
                <span className={isLiked && user ? 'text-rose-600' : 'text-slate-505'}>
                  {post.likes || 0}
                </span>
              </button>

              {/* Comment Button */}
              <button
                onClick={() => toggleCommentsExpansion(post._id)}
                className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 transition cursor-pointer"
              >
                <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-slate-505">
                  {post.replies?.length || 0}
                </span>
              </button>

              {/* Share Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/forum`);
                  alert("Link copied to clipboard!");
                }}
                className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition cursor-pointer"
              >
                <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.636-2.318a3 3 0 111.4 2.518l-4.636 2.318a3 3 0 11-1.4-2.518z" />
                </svg>
                <span className="text-slate-550">{sharesCount}</span>
              </button>
            </div>

            {/* Bookmark Button */}
            <button
              onClick={user ? (e) => handleToggleBookmark(post._id, e) : () => window.location.href = '/auth'}
              className="text-slate-500 hover:text-amber-600 transition cursor-pointer"
            >
              {isBookmarked && user ? (
                <svg className="h-5 w-5 text-amber-500 fill-current" viewBox="0 0 24 24">
                  <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                </svg>
              ) : (
                <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
            </button>
          </div>

          {/* Expanded Comments Drawer */}
          {isCommentsExpanded && (
            <div className="mt-4 border-t border-slate-100 pt-4 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Thread Comments ({post.replies?.length || 0})
              </h4>
              
              {/* Comments List */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                {!post.replies || post.replies.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-mint/5 py-4 text-center rounded-xl border border-dashed border-sage/15">
                    No comments yet. Share your input!
                  </p>
                ) : (
                  post.replies.map((reply, i) => (
                    <div key={reply._id || i} className="rounded-2xl border border-sage/15 bg-offwhite/50 p-3.5 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between text-[10px] font-medium text-slate-500 pb-2 border-b border-sage/10 mb-2 gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Avatar className="h-6 w-6 border border-sage/20 bg-mint/55">
                            {isUrl(reply.avatar) && <AvatarImage src={reply.avatar} />}
                            <AvatarFallback className="text-[9px] font-black">
                              {isUrl(reply.avatar) ? getInitials(reply.authorName) : (reply.avatar ? reply.avatar.slice(0, 2) : 'ST')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-extrabold text-slate-905">{reply.authorName}</span>
                            <span className="text-slate-450 font-semibold font-normal"> ({reply.authorRole || 'Student'})</span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-400">{new Date(reply.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-750 pl-1">{reply.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Form */}
              {user ? (
                <form onSubmit={(e) => handlePostReply(post._id, e)} className="space-y-3 pt-3 border-t border-slate-100">
                  <div>
                    <label htmlFor={`reply-content-${post._id}`} className="text-[9px] font-extrabold text-slate-700 uppercase tracking-wider block">Write Comment</label>
                    <div className="relative mt-1.5">
                      <textarea
                        id={`reply-content-${post._id}`}
                        required
                        rows="2"
                        placeholder="Share a tip or write answers..."
                        value={replyContent[post._id] || ''}
                        onChange={(e) => setReplyContent({ ...replyContent, [post._id]: e.target.value })}
                        className="w-full rounded-xl border border-sage/35 bg-white px-4 py-3 text-xs pr-12 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none text-slate-900 placeholder:text-slate-400 shadow-inner"
                      />
                      <button
                        type="submit"
                        disabled={replyLoading[post._id]}
                        className="absolute right-3.5 bottom-3.5 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-sage hover:text-slate-950 disabled:bg-sage/40 shadow-sm cursor-pointer"
                      >
                        <PaperAirplaneIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border border-dashed border-sage/30 bg-mint/5 p-4 text-center mt-3 shadow-inner">
                  <p className="text-xs font-bold text-slate-700">Want to join the discussion?</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold">Sign in to share notes, ask doubts, and reply to classmates.</p>
                  <Link to="/auth" className="inline-block mt-3">
                    <Button size="sm" className="rounded-full bg-slate-900 text-white hover:bg-slate-800 cursor-pointer">
                      Sign In to Reply 🚪
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 bg-offwhite min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 font-heading">
              Community Hub
            </h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">Connect, share study notes, and grow together</p>
          </div>
          {user ? (
            <Button onClick={() => setShowCreateModal(true)} className="w-full md:w-auto cursor-pointer bg-slate-950 text-white hover:bg-slate-800 rounded-xl px-5 py-2.5 flex items-center justify-center gap-1.5 shadow-md font-bold">
              <PaperAirplaneIcon className="-rotate-45 h-4 w-4" />
              Create Post
            </Button>
          ) : (
            <Link to="/auth" className="w-full md:w-auto">
              <Button className="w-full bg-palegreen border border-sage/30 text-slate-900 hover:bg-sage shadow-md rounded-xl py-2.5 font-bold flex items-center justify-center gap-1.5">
                🔒 Sign In to Post
              </Button>
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Members</CardTitle>
              <UsersIcon className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent className="pt-1.5">
              <div className="text-2xl font-black text-slate-950">1,245</div>
              <p className="text-[10px] font-bold text-slate-500 mt-1">
                <span className="text-emerald-600 font-extrabold">+14%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card className="p-4 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Today</CardTitle>
              <ArrowTrendingUpIcon className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent className="pt-1.5">
              <div className="text-2xl font-black text-slate-950">148</div>
              <p className="text-[10px] font-bold text-slate-500 mt-1">Online students right now</p>
            </CardContent>
          </Card>

          <Card className="p-4 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Posts</CardTitle>
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent className="pt-1.5">
              <div className="text-2xl font-black text-slate-950">{posts.length + 84}</div>
              <p className="text-[10px] font-bold text-slate-500 mt-1">Across all categories</p>
            </CardContent>
          </Card>

          <Card className="p-4 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Events</CardTitle>
              <CalendarIcon className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent className="pt-1.5">
              <div className="text-2xl font-black text-slate-950">3</div>
              <p className="text-[10px] font-bold text-slate-500 mt-1">Virtual study peer review sessions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Filters */}
            <Card className="p-4 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search posts, topics or authors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`rounded-xl border border-sage/25 p-2 ${showFilters ? 'bg-mint/45 text-emerald-900 border-sage' : ''}`}
                >
                  <FunnelIcon className="h-5 w-5" />
                </Button>
              </div>

              {/* Category Pills (Collapsible) */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 flex flex-wrap gap-2 overflow-hidden"
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`rounded-full px-3.5 py-1 text-xs font-bold border transition duration-200 cursor-pointer ${
                          activeCategory === cat
                            ? 'bg-slate-950 border-slate-950 text-white shadow-sm'
                            : 'bg-surface border-sage/25 text-slate-700 hover:bg-mint/20'
                        }`}
                      >
                        {categoryEmojis[cat] || cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-slate-200/50 border border-sage/10 p-1 rounded-xl">
                <TabsTrigger value="feed" className="rounded-lg">Feed</TabsTrigger>
                <TabsTrigger value="trending" className="rounded-lg">Trending</TabsTrigger>
                <TabsTrigger value="bookmarks" className="rounded-lg">Bookmarks</TabsTrigger>
              </TabsList>
              
              {/* Tab Contents */}
              <TabsContent value="feed" className="space-y-4 mt-4 outline-none">
                {loading ? (
                  <div className="py-12 text-center text-slate-500 font-bold">Loading community feed...</div>
                ) : filteredPosts.length === 0 ? (
                  <div className="space-y-6">
                    <Card className="p-8 text-center text-slate-500 font-medium rounded-2xl border border-dashed border-slate-200">
                      <div className="text-3xl mb-2">🔍</div>
                      <p className="text-sm font-bold text-slate-800">No discussions found matching your filter</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Try clearing your search query or switching category filters.
                      </p>
                      <button 
                        onClick={() => { setSearch(''); setActiveCategory('All'); }}
                        className="mt-3.5 rounded-full bg-slate-900 px-4 py-2 text-[10px] font-bold text-white hover:bg-slate-800 cursor-pointer transition shadow-xs"
                      >
                        Reset Filters
                      </button>
                    </Card>
                    
                    {posts.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                          Popular Discussions
                        </h3>
                        {posts.slice(0, 2).map((post) => renderPostCard(post))}
                      </div>
                    )}
                  </div>
                ) : (
                  filteredPosts.map((post) => renderPostCard(post))
                )}
              </TabsContent>

              {/* Trending Tab */}
              <TabsContent value="trending" className="space-y-4 mt-4 outline-none">
                {loading ? (
                  <div className="py-12 text-center text-slate-500 font-bold">Loading community feed...</div>
                ) : filteredPosts.length === 0 ? (
                  <div className="space-y-6">
                    <Card className="p-8 text-center text-slate-500 font-medium rounded-2xl border border-dashed border-slate-200">
                      <div className="text-3xl mb-2">📈</div>
                      <p className="text-sm font-bold text-slate-800">No trending discussions</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        No trending threads under this filter. Try clearing your search query.
                      </p>
                      <button 
                        onClick={() => { setSearch(''); setActiveCategory('All'); }}
                        className="mt-3.5 rounded-full bg-slate-900 px-4 py-2 text-[10px] font-bold text-white hover:bg-slate-800 cursor-pointer transition shadow-xs"
                      >
                        Reset Filters
                      </button>
                    </Card>
                    
                    {posts.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                          Popular Discussions
                        </h3>
                        {posts.slice(0, 2).map((post) => renderPostCard(post))}
                      </div>
                    )}
                  </div>
                ) : (
                  [...filteredPosts]
                    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                    .map((post) => renderPostCard(post))
                )}
              </TabsContent>

              {/* Bookmarks Tab */}
              <TabsContent value="bookmarks" className="space-y-4 mt-4 outline-none">
                {loading ? (
                  <div className="py-12 text-center text-slate-500 font-bold">Loading community feed...</div>
                ) : filteredPosts.length === 0 ? (
                  <div className="space-y-6">
                    <Card className="p-8 text-center text-slate-500 font-medium rounded-2xl border border-dashed border-slate-200">
                      <div className="text-3xl mb-2">🔖</div>
                      <p className="text-sm font-bold text-slate-800">No bookmarked threads yet</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Click the save icon on discussions to pin them here for quick access later.
                      </p>
                    </Card>
                    
                    {posts.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                          Recommended Discussions to Read & Save
                        </h3>
                        {posts.slice(0, 2).map((post) => renderPostCard(post))}
                      </div>
                    )}
                  </div>
                ) : (
                  filteredPosts.map((post) => renderPostCard(post))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-4">
            {/* Trending Topics */}
            <Card className="rounded-2xl p-4">
              <CardHeader className="pb-3 border-b border-sage/10 mb-2">
                <CardTitle className="text-base font-extrabold text-slate-950">Trending Topics</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-2.5">
                {trendingTopics.map((topic) => (
                  <div key={topic.tag} className="flex items-center justify-between cursor-pointer group" onClick={() => setSearch(topic.tag.replace('#', ''))}>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-800 group-hover:underline transition">
                      {topic.tag}
                    </span>
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-md">{topic.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="rounded-2xl p-4">
              <CardHeader className="pb-3 border-b border-sage/10 mb-2">
                <CardTitle className="text-base font-extrabold text-slate-950">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-palegreen text-emerald-950 rounded-xl p-1.5 text-center min-w-[50px] border border-sage/35 shadow-sm">
                    <div className="text-[9px] font-black uppercase tracking-wider">MAY</div>
                    <div className="text-sm font-black">30</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-xs text-slate-900 truncate">AI Study Chat Peer Meetup</p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Virtual · 4:00 PM</p>
                  </div>
                </div>
                
                <Separator />

                <div className="flex items-start gap-3">
                  <div className="bg-palegreen text-emerald-950 rounded-xl p-1.5 text-center min-w-[50px] border border-sage/35 shadow-sm">
                    <div className="text-[9px] font-black uppercase tracking-wider">JUN</div>
                    <div className="text-sm font-black">04</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-xs text-slate-900 truncate">Backprop Derivation Star Session</p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Online · 6:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Members */}
            <Card className="rounded-2xl p-4">
              <CardHeader className="pb-3 border-b border-sage/10 mb-2">
                <CardTitle className="text-base font-extrabold text-slate-950">Active Members</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-3">
                {onlineStories.slice(0, 4).map((member) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint font-black text-[10px] text-emerald-950 border border-sage/20">
                        {member.avatar}
                      </div>
                      <div className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${member.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-950 leading-4">{member.name}</span>
                      <span className="text-[9px] font-semibold text-slate-400">{member.role}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Discussion Thread Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0"
            />
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-lg rounded-[32px] border border-sage/20 bg-white p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-extrabold text-slate-950 tracking-tight font-heading">Start a Community Discussion</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">Share study notes, exam tips, or project schemas with the student body.</p>

              <form onSubmit={handleCreatePost} className="mt-6 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Topic Title</label>
                  <Input
                    required
                    placeholder="e.g. Backpropagation calculus shortcuts"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mt-1.5 rounded-xl"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-sage/35 bg-white px-4 py-2.5 text-xs font-semibold outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-950 cursor-pointer"
                    >
                      <option>General Talk</option>
                      <option>Exam Prep</option>
                      <option>Project Help</option>
                      <option>Study Groups</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Your Name (Optional)</label>
                    <Input
                      placeholder="Leave blank for Guest"
                      value={newAuthorName}
                      onChange={(e) => setNewAuthorName(e.target.value)}
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Hashtags (Comma-separated)</label>
                  <Input
                    placeholder="e.g. LectureNotes, ExamPrep, SQL_Schemas"
                    value={newHashtags}
                    onChange={(e) => setNewHashtags(e.target.value)}
                    className="mt-1.5 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Content / Doubts</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Write details of your study guide or questions..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-sage/35 bg-white px-4 py-2.5 text-xs font-semibold outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-950 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="w-1/2 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-1/2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                  >
                    Post to Feed
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ForumPage;
