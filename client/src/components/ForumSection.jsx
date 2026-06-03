import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { Separator } from './ui/separator.jsx';
import { 
  ChatBubbleBottomCenterTextIcon, 
  PlusIcon, 
  PaperAirplaneIcon, 
  HeartIcon, 
  BookmarkIcon, 
  FolderOpenIcon, 
  PlayIcon, 
  CodeBracketIcon 
} from '@heroicons/react/24/outline';

const ForumSection = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General Talk');
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  const renderAttachment = (post) => {
    const hasNoteTag = post.hashtags?.some(tag => tag.toLowerCase().includes('note') || tag.toLowerCase().includes('pdf'));
    const hasCodeTag = post.hashtags?.some(tag => tag.toLowerCase().includes('code') || tag.toLowerCase().includes('sql') || tag.toLowerCase().includes('schema'));
    const hasVideoTag = post.hashtags?.some(tag => tag.toLowerCase().includes('video') || tag.toLowerCase().includes('youtube') || tag.toLowerCase().includes('lecture'));

    if (hasNoteTag) {
      return (
        <div className="mt-3.5 flex items-center justify-between rounded-2xl border border-sage/20 bg-mint/15 p-4 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-950 shadow-sm border border-sage/10">
              <FolderOpenIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">Study_Kit_Syllabus_Guide.pdf</p>
              <p className="text-[10px] font-semibold text-emerald-950">Engineering Lecture Notes · 14 Pages</p>
            </div>
          </div>
          <Link to="/forum" className="rounded-xl bg-white px-3.5 py-2 text-[10px] font-bold text-emerald-955 shadow-sm border border-sage/20 hover:bg-mint/35">
            View PDF
          </Link>
        </div>
      );
    }

    if (hasCodeTag) {
      return (
        <div className="mt-3.5 rounded-2xl border border-sage/20 bg-[#1E2E23] p-4 font-mono text-[10px] leading-relaxed text-emerald-300 shadow-sm overflow-hidden select-none">
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
        <div className="mt-3.5 overflow-hidden rounded-2xl border border-sage/20 shadow-sm bg-slate-900 relative aspect-video max-h-[160px] flex items-center justify-center group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
          <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 border border-white/20 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white">
            <PlayIcon className="h-3 w-3 text-emerald-400" />
            <span>Interactive Visual Playlist</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-palegreen/20 border border-sage/30 text-white backdrop-blur-sm shadow-md transition duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-emerald-950 z-20">
            <PlayIcon className="h-5 w-5 fill-current" />
          </div>
        </div>
      );
    }

    return null;
  };

  const MOCK_FORUM_POSTS = [
    {
      _id: "mock_post_1",
      title: "Full Hand-Written Lecture Notes on Neural Networks Backpropagation",
      content: "Just finished summarizing the complete chain-rule derivation for feedforward networks. Uploading these simplified formulas and gradients. Hope it makes the backprop calculus click for everyone before the midterm next Thursday!",
      category: "Project Help",
      authorName: "Rohan Gupta",
      authorRole: "CS Sophomore",
      avatar: "RG",
      likes: 42,
      bookmarks: 18,
      hashtags: ["NeuralNetworks", "DeepLearning", "LectureNotes"],
      createdAt: "2026-05-22T08:30:00.000Z",
      replies: [{}, {}]
    },
    {
      _id: "mock_post_2",
      title: "Varying Scheduler Final Exam Tips & Hidden Topics 🚨",
      content: "Heard from the TA that this year's Operating Systems exam will place massive weight on Multi-Level Feedback Queue (MLFQ) starvation edge cases. Make sure you review the priority boost interval calculation formulas.",
      category: "Exam Prep",
      authorName: "Dev Patel",
      authorRole: "Computer Systems Junior",
      avatar: "DP",
      likes: 65,
      bookmarks: 29,
      hashtags: ["OS_Exams", "MLFQ", "FinalsPrep"],
      createdAt: "2026-05-22T10:15:00.000Z",
      replies: [{}, {}]
    },
    {
      _id: "mock_post_3",
      title: "Best YouTube Lectures/Playlists for Linear Algebra Visualizations?",
      content: "Struggling to build an intuitive, geometric understanding of eigenvalues and vector transformation spaces. Is 3Blue1Brown still the absolute gold standard or are there other channels you'd suggest?",
      category: "General Talk",
      authorName: "Aarav Sharma",
      authorRole: "First Year Student",
      avatar: "AS",
      likes: 28,
      bookmarks: 7,
      hashtags: ["LinearAlgebra", "MathInSight"],
      createdAt: "2026-05-22T11:20:00.000Z",
      replies: [{}, {}]
    }
  ];

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/forum');
      const localPosts = JSON.parse(localStorage.getItem('edumind_local_posts') || '[]');
      const combined = data && data.length > 0 ? [...localPosts, ...data] : [...localPosts, ...MOCK_FORUM_POSTS];
      
      const merged = combined.map(p => {
        const localReplies = JSON.parse(localStorage.getItem('edumind_local_replies') || '{}');
        const localLikes = JSON.parse(localStorage.getItem('edumind_local_likes') || '{}');
        let updatedPost = { ...p };
        if (localReplies[p._id]) {
          updatedPost.replies = [...(p.replies || []), ...localReplies[p._id]];
        }
        if (localLikes[p._id]) {
          updatedPost.likes = localLikes[p._id].likes;
        }
        return updatedPost;
      });

      setPosts(merged.slice(0, 3));
    } catch (err) {
      console.error('Error fetching forum posts, loading local mock posts:', err);
      const localPosts = JSON.parse(localStorage.getItem('edumind_local_posts') || '[]');
      const combined = [...localPosts, ...MOCK_FORUM_POSTS];
      
      const merged = combined.map(p => {
        const localReplies = JSON.parse(localStorage.getItem('edumind_local_replies') || '{}');
        const localLikes = JSON.parse(localStorage.getItem('edumind_local_likes') || '{}');
        let updatedPost = { ...p };
        if (localReplies[p._id]) {
          updatedPost.replies = [...(p.replies || []), ...localReplies[p._id]];
        }
        if (localLikes[p._id]) {
          updatedPost.likes = localLikes[p._id].likes;
        }
        return updatedPost;
      });

      setPosts(merged.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const hashtagsArray = hashtags
      .split(',')
      .map(tag => tag.replace('#', '').trim())
      .filter(Boolean);

    try {
      const { data } = await api.post('/forum', {
        title,
        content,
        category,
        authorName: authorName.trim() || undefined,
        hashtags: hashtagsArray
      });

      setSuccessMsg('Your discussion has been posted to the community!');
      setTitle('');
      setContent('');
      setHashtags('');
      setAuthorName('');
      setIsPosting(false);
      
      setPosts([data, ...posts].slice(0, 3));
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error posting to forum, saving locally instead:', err);
      const fallbackPost = {
        _id: 'local_post_' + Math.random().toString(36).slice(2, 9),
        title,
        content,
        category,
        authorName: authorName.trim() || (user ? user.name : 'Guest Student'),
        authorRole: user ? (user.branch ? `${user.branch} Student` : 'Registered Student') : 'Guest Student',
        avatar: user ? (user.avatar || user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)) : ((authorName.trim() || 'Guest').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)),
        likes: 0,
        bookmarks: 0,
        hashtags: hashtagsArray,
        createdAt: new Date().toISOString(),
        replies: []
      };

      const localPosts = JSON.parse(localStorage.getItem('edumind_local_posts') || '[]');
      localPosts.unshift(fallbackPost);
      localStorage.setItem('edumind_local_posts', JSON.stringify(localPosts));

      setSuccessMsg('Your discussion has been posted locally (offline fallback)!');
      setTitle('');
      setContent('');
      setHashtags('');
      setAuthorName('');
      setIsPosting(false);

      setPosts([fallbackPost, ...posts].slice(0, 3));
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const getCategoryStyles = (cat) => {
    switch (cat) {
      case 'Exam Prep':
        return 'bg-amber-100/70 text-amber-900 border-amber-200/50';
      case 'Project Help':
        return 'bg-mint/70 text-emerald-950 border-emerald-200/50';
      case 'Study Groups':
        return 'bg-purple-100/70 text-purple-900 border-purple-200/50';
      default:
        return 'bg-emerald-100/70 text-emerald-900 border-emerald-200/50';
    }
  };

  return (
    <section className="mt-28">
      <motion.div 
        className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-br from-mint/45 via-surface to-offwhite p-6 md:p-8 shadow-soft border border-sage/20 relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ type: 'spring', stiffness: 50, damping: 15 }}
      >
        <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-sage/20 pb-6 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/80 border border-sage/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-950">
              Community Space
            </span>
            <h2 className="mt-3.5 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-950 font-heading">
              Community Forum Feed
            </h2>
            <p className="mt-1 text-xs md:text-sm text-slate-500 font-medium">
              Share study notes, ask doubts, and collaborate on engineering assignments.
            </p>
          </div>
          
          <div className="flex items-center gap-2.5">
            {user ? (
              <button
                onClick={() => setIsPosting(!isPosting)}
                className="inline-flex items-center gap-2 rounded-xl border border-sage/35 bg-white/80 px-4 py-2 text-xs font-bold text-slate-900 transition hover:bg-mint/60 cursor-pointer"
              >
                <PlusIcon className="h-4 w-4" />
                <span>{isPosting ? 'Cancel Post' : 'Start Discussion'}</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-xl border border-sage/35 bg-white/80 px-4 py-2 text-xs font-bold text-slate-900 transition hover:bg-mint/60"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Sign In to Post</span>
              </Link>
            )}
            
            <Link
              to="/forum"
              className="inline-flex items-center justify-center rounded-xl bg-palegreen hover:bg-sage border border-sage/30 px-5 py-2 text-xs font-extrabold text-slate-900 shadow-md transition duration-300 hover:scale-103"
            >
              Visit Forum
            </Link>
          </div>
        </div>

        {/* Miniature Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-sage/10 pb-6 mb-6">
          <Card className="p-4 rounded-2xl bg-white/40 border border-sage/10 shadow-none">
            <CardHeader className="pb-1 p-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Total Members</span>
            </CardHeader>
            <CardContent className="pt-1.5 p-0">
              <div className="text-lg font-black text-slate-950">1,245+ Students</div>
            </CardContent>
          </Card>
          <Card className="p-4 rounded-2xl bg-white/40 border border-sage/10 shadow-none">
            <CardHeader className="pb-1 p-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Online Now</span>
            </CardHeader>
            <CardContent className="pt-1.5 p-0">
              <div className="text-lg font-black text-slate-950 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>148 Active</span>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4 rounded-2xl bg-white/40 border border-sage/10 shadow-none">
            <CardHeader className="pb-1 p-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Study Resources</span>
            </CardHeader>
            <CardContent className="pt-1.5 p-0">
              <div className="text-lg font-black text-slate-950">80+ Notes & Guides</div>
            </CardContent>
          </Card>
        </div>

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl bg-mint/80 border border-sage/30 p-3.5 text-xs text-emerald-950 text-center font-bold"
          >
            {successMsg}
          </motion.div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          
          {/* Recent Discussions List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
              <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-emerald-700 animate-pulse" />
              Trending Discussions
            </h3>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-500 font-bold">Loading forum threads...</div>
            ) : posts.length === 0 ? (
              <Card className="p-12 text-center text-slate-500 font-medium rounded-2xl border border-dashed border-sage/35">
                No discussions started yet. Be the first to post!
              </Card>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {posts.map((post) => {
                    const handle = post.authorName 
                      ? `@${post.authorName.toLowerCase().replace(/\s+/g, '')}` 
                      : '@guest';
                    const sharesCount = post.shares || Math.floor(((post.likes || 0) + (post.bookmarks || 0)) / 3) || 0;

                    return (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ x: 4, scale: 1.005, transition: { duration: 0.2 } }}
                      >
                        <Card className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden">
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
                                {post.hashtags.slice(0, 3).map((tag) => (
                                  <span key={tag} className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                                    #{tag.toLowerCase()}
                                  </span>
                                ))}
                              </div>
                            )}

                            <Separator className="my-3.5 bg-slate-100" />

                            {/* Footer interaction row */}
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-1">
                              <div className="flex items-center gap-6">
                                <span className="flex items-center gap-1.5 text-slate-500">
                                  <HeartIcon className="h-5 w-5 text-slate-400" />
                                  <span className="text-xs font-bold text-slate-550">{post.likes || 0}</span>
                                </span>
                                <span className="flex items-center gap-1.5 text-slate-500">
                                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  <span className="text-xs font-bold text-slate-550">{post.replies?.length || 0}</span>
                                </span>
                                <span className="flex items-center gap-1.5 text-slate-500">
                                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.636-2.318a3 3 0 111.4 2.518l-4.636 2.318a3 3 0 11-1.4-2.518z" />
                                  </svg>
                                  <span>{sharesCount}</span>
                                </span>
                              </div>
                              <Link
                                to="/forum"
                                className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 transition font-extrabold"
                              >
                                <span>Join Thread</span>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Quick Post Form / Guest Banner & Sidebar Widgets */}
          <div className="space-y-4 lg:self-start w-full">
            <AnimatePresence mode="wait">
              {!user ? (
                <Card className="flex flex-col justify-center border border-dashed border-sage/35 p-6 md:p-8 text-center text-slate-600 bg-mint/5 shadow-inner rounded-2xl">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint text-emerald-800 border border-sage/20 shadow-sm">
                    <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
                  </div>
                  <h4 className="mt-4 text-sm font-extrabold text-slate-950 leading-tight">Join the EduMind Community Forum</h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-650 max-w-xs mx-auto font-medium">
                    Sign in to share notes, ask doubts, bookmark study guides, and write comments. Guests can view the forum feed.
                  </p>
                  <Link
                    to="/auth"
                    className="mx-auto mt-5 inline-block rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold shadow-md transition duration-200 px-6 py-2.5 text-xs hover:scale-102"
                  >
                    Sign In to Join Discussion 🚪
                  </Link>
                </Card>
              ) : isPosting ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="p-5 md:p-6 rounded-2xl bg-white shadow-soft">
                    <CardHeader className="pb-2 p-0">
                      <CardTitle className="text-base font-extrabold text-slate-950">Share with the Community</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3 p-0">
                      <form onSubmit={handlePost} className="space-y-3">
                        <div>
                          <label htmlFor="forum-title" className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Topic Title</label>
                          <input
                            id="forum-title"
                            type="text"
                            required
                            placeholder="What do you want to discuss?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-sage/35 bg-white px-4 py-2.5 text-xs font-semibold outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 placeholder:text-slate-400 shadow-inner"
                          />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label htmlFor="forum-category" className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Category</label>
                            <select
                              id="forum-category"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="mt-1.5 w-full rounded-xl border border-sage/35 bg-white px-4 py-2.5 text-xs font-semibold outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 cursor-pointer shadow-inner"
                            >
                              <option>General Talk</option>
                              <option>Exam Prep</option>
                              <option>Project Help</option>
                              <option>Study Groups</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="forum-author" className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Your Name</label>
                            <input
                              id="forum-author"
                              type="text"
                              disabled
                              placeholder={user?.name || "Registered Student"}
                              className="mt-1.5 w-full rounded-xl border border-sage/35 bg-slate-100 px-4 py-2.5 text-xs font-semibold outline-none text-slate-500 cursor-not-allowed shadow-inner"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="forum-tags" className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Hashtags (Comma-separated)</label>
                          <input
                            id="forum-tags"
                            type="text"
                            placeholder="e.g. OS_Exams, LectureNotes"
                            value={hashtags}
                            onChange={(e) => setHashtags(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-sage/35 bg-white px-4 py-2.5 text-xs font-semibold outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 placeholder:text-slate-400 shadow-inner"
                          />
                        </div>

                        <div>
                          <label htmlFor="forum-content" className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Content / Thoughts</label>
                          <textarea
                            id="forum-content"
                            required
                            rows="3"
                            placeholder="Write details about your question..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-sage/35 bg-white px-4 py-2.5 text-xs font-semibold outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 placeholder:text-slate-400 shadow-inner"
                          />
                        </div>

                        <button
                          type="submit"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-palegreen hover:bg-sage border border-sage/30 py-2.5 text-xs font-extrabold text-slate-950 shadow-md transition hover:scale-101 duration-200 cursor-pointer"
                        >
                          <PaperAirplaneIcon className="h-4 w-4" />
                          <span>Post to Forum</span>
                        </button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="flex h-full flex-col justify-center border border-dashed border-sage/35 p-6 md:p-8 text-center text-slate-650 bg-mint/5 rounded-2xl">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint text-emerald-800 border border-sage/20">
                    <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
                  </div>
                  <h4 className="mt-4 text-sm font-bold text-slate-950">Have something to share?</h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 max-w-xs mx-auto font-medium">
                    Ask doubts, form study networks, share class files, or write tips for upcoming sessions.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsPosting(true)}
                    className="mx-auto mt-6 rounded-full bg-palegreen hover:bg-sage border border-sage/30 text-slate-950 font-extrabold shadow-md transition duration-300 px-6 py-2.5 text-xs hover:scale-102 cursor-pointer"
                  >
                    Start a New Discussion
                  </button>
                </Card>
              )}
            </AnimatePresence>

            {/* Popular tags widget */}
            <Card className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Popular Tags</h4>
              <div className="flex flex-wrap gap-2">
                {['neuralnetworks', 'os_exams', 'dbms_rules', 'finalsprep', 'lecturenotes'].map((tag) => (
                  <Link 
                    to="/forum" 
                    key={tag} 
                    className="text-[10px] font-bold text-slate-700 bg-surface px-2.5 py-1.5 rounded-md border border-slate-200/50 hover:bg-mint/30 hover:border-sage/40 transition duration-150"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </Card>

            {/* Tool guide widget */}
            <Card className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Study Companion Toolkit</h4>
              <div className="space-y-2.5">
                <Link to="/ai" className="flex items-center gap-3 p-2.5 rounded-xl bg-surface/50 border border-slate-100 hover:bg-mint/20 hover:border-sage/20 transition group">
                  <span className="text-base group-hover:scale-110 transition duration-200">🤖</span>
                  <div>
                    <p className="text-[11px] font-extrabold text-slate-900">AI Study Tutor</p>
                    <p className="text-[9px] font-semibold text-slate-500 mt-0.5">Solve doubts & query Mumbai University syllabus</p>
                  </div>
                </Link>
                <Link to="/quiz" className="flex items-center gap-3 p-2.5 rounded-xl bg-surface/50 border border-slate-100 hover:bg-mint/20 hover:border-sage/20 transition group">
                  <span className="text-base group-hover:scale-110 transition duration-200">📝</span>
                  <div>
                    <p className="text-[11px] font-extrabold text-slate-900">MCQ Practice Board</p>
                    <p className="text-[9px] font-semibold text-slate-500 mt-0.5">Auto-generate practice tests for recall</p>
                  </div>
                </Link>
                <Link to="/roadmap" className="flex items-center gap-3 p-2.5 rounded-xl bg-surface/50 border border-slate-100 hover:bg-mint/20 hover:border-sage/20 transition group">
                  <span className="text-base group-hover:scale-110 transition duration-200">🧭</span>
                  <div>
                    <p className="text-[11px] font-extrabold text-slate-900">Career Nav Pathways</p>
                    <p className="text-[9px] font-semibold text-slate-500 mt-0.5">Generate milestones & suggested projects</p>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Upcoming Events Card */}
            <Card className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3.5 flex items-center gap-1.5">
                <span>📅</span> Upcoming Events
              </h4>
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="bg-palegreen/40 text-emerald-950 rounded-xl p-1.5 text-center min-w-[45px] border border-sage/20 shadow-inner">
                    <div className="text-[8px] font-black uppercase tracking-wider">MAY</div>
                    <div className="text-xs font-black">30</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-xs text-slate-900 truncate">AI Study Chat Meetup</p>
                    <p className="text-[10px] text-slate-550 font-semibold mt-0.5">Virtual · 4:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-palegreen/40 text-emerald-950 rounded-xl p-1.5 text-center min-w-[45px] border border-sage/20 shadow-inner">
                    <div className="text-[8px] font-black uppercase tracking-wider">JUN</div>
                    <div className="text-xs font-black">04</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-xs text-slate-900 truncate">Backprop Star Session</p>
                    <p className="text-[10px] text-slate-550 font-semibold mt-0.5">Online · 6:00 PM</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Forum Guidelines Card */}
            <Card className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <span>💡</span> Forum Quick Tips
              </h4>
              <ul className="space-y-2.5 text-[11px] font-semibold text-slate-650 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700">✔</span>
                  <span>Use specific tags (e.g. <strong>#dbms_rules</strong>) to get expert replies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700">✔</span>
                  <span>Share notes or syllabus PDFs to help other classmates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700">✔</span>
                  <span>Ask clean, precise questions with code snippets.</span>
                </li>
              </ul>
            </Card>
          </div>

        </div>

      </motion.div>
    </section>
  );
};

export default ForumSection;
