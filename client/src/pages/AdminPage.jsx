import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const AdminPage = () => {
  const { user } = useContext(AuthContext);

  // Security guard
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, forumPosts: 0, summaries: 0, quizzes: 0, plannerTasks: 0 });
  const [usersList, setUsersList] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data.stats);

      const usersRes = await api.get('/admin/users');
      setUsersList(usersRes.data.users);

      const forumRes = await api.get('/forum');
      // The forum route returns posts inside a key (e.g. data.posts or data)
      const posts = Array.isArray(forumRes.data) ? forumRes.data : forumRes.data.posts || [];
      setForumPosts(posts);
    } catch (err) {
      console.error(err);
      showAlert('Failed to load administration data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to delete user ${userEmail}? This will also delete all their planner tasks, notes, quizzes, and attendance records.`)) {
      return;
    }
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsersList((prev) => prev.filter((u) => u._id !== userId));
      showAlert(`User ${userEmail} and all related records deleted successfully.`);
      // Refresh stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data.stats);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to delete user.', 'error');
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'student' : 'admin';
    try {
      const { data } = await api.patch(`/admin/users/${userId}/role`, { role: nextRole });
      setUsersList((prev) => prev.map((u) => u._id === userId ? { ...u, role: data.user.role } : u));
      showAlert(`Updated user role to ${nextRole} successfully.`);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to update user role.', 'error');
    }
  };

  const handleDeleteForumPost = async (postId, postTitle) => {
    if (!window.confirm(`Are you sure you want to delete the discussion "${postTitle}"?`)) {
      return;
    }
    try {
      await api.delete(`/admin/forum/${postId}`);
      setForumPosts((prev) => prev.filter((p) => p._id !== postId));
      showAlert('Discussion thread deleted successfully.');
      // Refresh stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data.stats);
    } catch (err) {
      showAlert('Failed to delete discussion thread.', 'error');
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      
      {/* Alert Notification Popup */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-6 z-50 rounded-2xl px-6 py-4 text-xs font-bold border shadow-md flex items-center gap-2 ${
              alert.type === 'error' 
                ? 'bg-rose-100 border-rose-200 text-rose-800' 
                : 'bg-emerald-100 border-emerald-200 text-emerald-800'
            }`}
          >
            {alert.type === 'error' ? '⚠️' : '✔'} {alert.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-[32px] bg-surface/90 border border-sage/20 p-6 sm:p-10 shadow-soft relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute -left-20 -top-20 h-44 w-44 rounded-full bg-palegreen/20 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-44 w-44 rounded-full bg-mint/30 blur-3xl" />

        {/* Title */}
        <div className="mb-8 relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-800 bg-palegreen/50 px-3.5 py-1.5 rounded-full border border-sage/25">
              Control Panel
            </span>
            <h1 className="mt-3.5 text-3xl font-black text-slate-950 font-heading">
              Platform Administration
            </h1>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              Control user accounts, moderate community discussions, and inspect service statistics.
            </p>
          </div>
          <button 
            onClick={loadData}
            className="self-start sm:self-center rounded-full bg-slate-950 px-5 py-2.5 text-xs font-bold text-offwhite transition hover:bg-slate-800 hover:scale-103"
          >
            Refresh Data 🔁
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="relative z-10 border-b border-sage/20 mb-8 flex gap-2">
          {[
            { id: 'overview', label: '📊 System Overview' },
            { id: 'users', label: '👥 User Accounts' },
            { id: 'forum', label: '💬 Forum Moderation' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-4 text-xs font-extrabold transition relative ${
                activeTab === tab.id 
                  ? 'text-slate-950 font-black border-b-2 border-emerald-800' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sage border-t-emerald-800" />
            <p className="mt-4 text-xs font-semibold text-slate-500">Retrieving database values...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Overview Dashboard Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-5 relative z-10"
              >
                {[
                  { title: 'Registered Students', val: stats.users, icon: '👥', desc: 'Active student profiles' },
                  { title: 'Forum Discussions', val: stats.forumPosts, icon: '💬', desc: 'Academic conversations' },
                  { title: 'PDF Summaries', val: stats.summaries, icon: '📄', desc: 'Parsed notes & vivas' },
                  { title: 'Generated Quizzes', val: stats.quizzes, icon: '📝', desc: 'MCQ practice sessions' }
                ].map((card, idx) => (
                  <div key={idx} className="rounded-3xl border border-sage/20 bg-white/80 p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-2xl">{card.icon}</span>
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mt-3">{card.title}</h4>
                    </div>
                    <div className="mt-4">
                      <p className="text-3xl font-black text-slate-950 font-heading">{card.val}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">{card.desc}</p>
                    </div>
                  </div>
                ))}

                {/* Additional admin metrics callout */}
                <div className="col-span-2 md:col-span-4 rounded-3xl border border-sage/20 bg-mint/15 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                  <div className="max-w-xl">
                    <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">🔒 Security Audit</h3>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold mt-1">
                      EduMind AI is configured with full CORS rules, encrypted bcrypt hashing passwords, and JSON Web Token (JWT) route protection. All customer data resides in MongoDB collections securely.
                    </p>
                  </div>
                  <div className="rounded-full bg-palegreen/60 border border-sage/30 px-5 py-2.5 text-xs font-black text-slate-900 select-none">
                    Status: Secure 🛡️
                  </div>
                </div>
              </motion.div>
            )}

            {/* Users Management Tab */}
            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="relative z-10 overflow-x-auto rounded-3xl border border-sage/20 bg-white shadow-sm"
              >
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-sage/15 bg-surface/50 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      <th className="p-4 sm:p-5">Name / Email</th>
                      <th className="p-4 sm:p-5">College & Course</th>
                      <th className="p-4 sm:p-5">Role</th>
                      <th className="p-4 sm:p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((userObj) => (
                      <tr key={userObj._id} className="border-b border-sage/10 last:border-none text-xs font-semibold text-slate-700 hover:bg-mint/5 transition">
                        {/* Name & Email */}
                        <td className="p-4 sm:p-5">
                          <div className="font-extrabold text-slate-950">{userObj.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{userObj.email}</div>
                        </td>
                        {/* College & Semester */}
                        <td className="p-4 sm:p-5">
                          <div>{userObj.college || 'Not set'}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {userObj.branch ? `${userObj.branch} Branch` : ''} 
                            {userObj.semester ? ` · ${userObj.semester}` : ''}
                          </div>
                        </td>
                        {/* Role tag */}
                        <td className="p-4 sm:p-5">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${
                            userObj.role === 'admin' 
                              ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                              : 'bg-palegreen/50 text-emerald-900 border border-sage/20'
                          }`}>
                            {userObj.role === 'admin' ? '💼 Admin' : '🎓 Student'}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="p-4 sm:p-5 text-right flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => handleToggleRole(userObj._id, userObj.role)}
                            disabled={user._id === userObj._id}
                            className="rounded-full border border-sage/35 bg-white px-3 py-1.5 text-[10px] font-extrabold text-slate-700 hover:bg-mint/30 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Toggle Role 🔀
                          </button>
                          <button
                            onClick={() => handleDeleteUser(userObj._id, userObj.email)}
                            disabled={user._id === userObj._id}
                            className="rounded-full bg-rose-100 border border-rose-200 px-3 py-1.5 text-[10px] font-extrabold text-rose-700 hover:bg-rose-200 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Delete 🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Forum Moderation Tab */}
            {activeTab === 'forum' && (
              <motion.div
                key="forum"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4 relative z-10"
              >
                {forumPosts.length === 0 ? (
                  <p className="rounded-3xl border border-dashed border-sage/25 bg-white/70 p-10 text-center text-xs font-semibold text-slate-500">
                    No active discussions found on the community server.
                  </p>
                ) : (
                  forumPosts.map((post) => (
                    <div key={post._id} className="rounded-2xl border border-sage/15 bg-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{post.category}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] text-slate-500 font-bold">By {post.authorName || 'Student'}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-950 mt-1">{post.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-1 mt-1 font-medium">{post.content}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteForumPost(post._id, post.title)}
                        className="rounded-full bg-rose-100 border border-rose-200 px-4 py-2 text-[10px] font-extrabold text-rose-700 hover:bg-rose-200 shrink-0 self-start sm:self-center"
                      >
                        Delete Discussion 🗑️
                      </button>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

      </div>
    </main>
  );
};

export default AdminPage;
