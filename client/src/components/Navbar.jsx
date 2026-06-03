import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar.jsx';

const toolLinks = [
  { label: 'AI Chat', to: '/ai' },
  { label: 'PDF Summarizer', to: '/pdf' },
  { label: 'Quiz Maker', to: '/quiz' },
  { label: 'Revision Coach', to: '/revision' },
  { label: 'Roadmap Maker', to: '/roadmap' },
  { label: 'Flashcards', to: '/flashcards' },
  { label: 'Study Planner', to: '/planner' },
  { label: 'Maths Solver', to: '/maths' }
];

const compressImage = (file, callback) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 250;
      const MAX_HEIGHT = 250;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      callback(dataUrl);
    };
  };
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, updateUser } = useContext(AuthContext);
  
  const [toolsOpen, setToolsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    college: user?.college || '',
    branch: user?.branch || '',
    semester: user?.semester || '',
    avatar: user?.avatar || ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const handleOpenEditModal = () => {
    setEditForm({
      name: user?.name || '',
      college: user?.college || '',
      branch: user?.branch || '',
      semester: user?.semester || '',
      avatar: user?.avatar || ''
    });
    setEditError('');
    setShowEditModal(true);
    setProfileOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      await updateUser(editForm);
      setShowEditModal(false);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update profile info.');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      <motion.header 
        className="sticky top-0 z-[100] border-b border-sage/60 bg-gradient-to-r from-palegreen/80 via-mint/95 to-surface shadow-md backdrop-blur-md" 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-2 sm:gap-x-4 md:gap-x-6 px-4 sm:px-6 py-4 flex-nowrap">
          {/* Logo and Name */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 text-slate-950 whitespace-nowrap shrink-0">
            <img src={logo} alt="EduMind AI logo" className="h-10 w-10 sm:h-11 sm:w-11 object-contain mix-blend-multiply hover:scale-105 transition-transform duration-200" />
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900">EduMind AI</span>
          </Link>

          {/* Consolidated Links */}
          <nav className="hidden items-center gap-x-3 lg:gap-x-6 md:flex flex-nowrap shrink-0">
            <Link 
              to="/dashboard" 
              className={`text-xs lg:text-sm font-semibold transition whitespace-nowrap shrink-0 ${location.pathname === '/dashboard' ? 'text-emerald-800' : 'text-slate-700 hover:text-emerald-700'}`}
            >
              Dashboard
            </Link>

            {/* Study Tools Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setToolsOpen(!toolsOpen);
                  setProfileOpen(false);
                }}
                className="flex items-center gap-1 text-xs lg:text-sm font-semibold text-slate-700 hover:text-emerald-700 focus:outline-none py-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Study Tools</span>
                <svg 
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${toolsOpen ? 'rotate-180 text-emerald-700' : 'text-slate-400'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Click-away backdrop overlay */}
              {toolsOpen && (
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setToolsOpen(false)} 
                />
              )}

              <AnimatePresence>
                {toolsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 top-full z-50 mt-2 w-80 -translate-x-1/2 rounded-[24px] border border-sage/25 bg-surface p-4 shadow-xl grid grid-cols-2 gap-1.5"
                  >
                    {toolLinks.map((link) => (
                      <Link 
                        key={link.to} 
                        to={link.to} 
                        onClick={() => setToolsOpen(false)}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${location.pathname === link.to ? 'bg-mint text-emerald-950' : 'text-slate-700 hover:bg-mint/45 hover:text-emerald-900'}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              to="/forum" 
              className={`text-xs lg:text-sm font-semibold transition whitespace-nowrap shrink-0 ${location.pathname === '/forum' ? 'text-emerald-800' : 'text-slate-700 hover:text-emerald-700'}`}
            >
              Community Forum
            </Link>

            {user && user.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`text-xs lg:text-sm font-semibold transition whitespace-nowrap shrink-0 ${location.pathname === '/admin' ? 'text-emerald-800' : 'text-slate-700 hover:text-emerald-700'}`}
              >
                Admin Panel ⚙️
              </Link>
            )}
          </nav>

          {/* Actions Section */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 flex-nowrap relative">
            <button 
              onClick={() => {
                const trial = { features: ['ai','revision'], startedAt: Date.now() };
                localStorage.setItem('edumind_trial', JSON.stringify(trial));
                navigate('/ai');
              }} 
              className="rounded-full bg-sage px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-slate-950 shadow-md transition duration-200 hover:bg-sage/85 hover:scale-103 whitespace-nowrap shrink-0"
            >
              Try Free
            </button>
            
            {user ? (
              <div className="relative">
                {/* Profile Trigger Button */}
                <button 
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setToolsOpen(false);
                  }}
                  className="rounded-full bg-palegreen border border-sage/30 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-slate-950 transition duration-200 hover:bg-sage whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm animate-pulse-once"
                >
                  <Avatar className="h-5 w-5 border-none bg-emerald-500/10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-mint text-emerald-950 font-black text-[9px]">{user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name.split(' ')[0]}</span>
                  <svg className={`h-3 w-3 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Click-away backdrop overlay */}
                {profileOpen && (
                  <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={() => setProfileOpen(false)} 
                  />
                )}

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-sage/35 bg-surface p-4 shadow-xl text-left"
                    >
                      <div className="px-1 py-1.5 flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-sage/35 shadow-sm bg-mint/55">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-mint text-emerald-950 font-black text-xs">{user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-slate-900 leading-tight truncate">{user.name}</p>
                          <p className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">{user.email}</p>
                          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-palegreen/60 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-950 border border-sage/20">
                            {user.role === 'admin' ? '💼 Admin' : '🎓 Student'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t border-sage/20 my-2" />
                      
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={handleOpenEditModal}
                          className="w-full text-left rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-mint/45 hover:text-emerald-900 transition"
                        >
                          ✏️ Edit Profile
                        </button>
                        <button
                          onClick={logout}
                          className="w-full text-left rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="rounded-full bg-palegreen border border-sage/30 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-slate-950 transition duration-200 hover:bg-sage whitespace-nowrap shrink-0"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </motion.header>

      {/* Edit Profile Modal Dialog */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-sage/35 rounded-3xl p-6 w-full max-w-md shadow-soft relative overflow-hidden"
            >
              {/* Decorative blobs */}
              <div className="absolute -left-12 -top-12 h-28 w-28 rounded-full bg-palegreen/20 blur-2xl" />
              <div className="absolute -right-12 -bottom-12 h-28 w-28 rounded-full bg-mint/30 blur-2xl" />

              <h2 className="text-lg font-heading font-black text-slate-950 relative z-10">✏️ Update Profile Information</h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5 relative z-10">Modify your student/profile credentials below.</p>
              
              {editError && (
                <div className="mt-3.5 rounded-xl bg-rose-100 border border-rose-200 p-3 text-[10px] font-bold text-rose-700 relative z-10">
                  ⚠️ {editError}
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="mt-4 space-y-4 relative z-10">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">👤 Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full rounded-xl border border-sage/25 bg-offwhite px-4 py-2.5 text-xs text-slate-950 font-semibold outline-none focus:border-sage focus:ring-1 focus:ring-sage shadow-inner"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">🎓 College Name</label>
                  <input
                    type="text"
                    value={editForm.college}
                    onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                    className="w-full rounded-xl border border-sage/25 bg-offwhite px-4 py-2.5 text-xs text-slate-950 font-semibold outline-none focus:border-sage focus:ring-1 focus:ring-sage shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">📚 Branch</label>
                    <input
                      type="text"
                      value={editForm.branch}
                      onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                      className="w-full rounded-xl border border-sage/25 bg-offwhite px-4 py-2.5 text-xs text-slate-950 font-semibold outline-none focus:border-sage focus:ring-1 focus:ring-sage shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">📅 Semester</label>
                    <input
                      type="text"
                      value={editForm.semester}
                      onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })}
                      className="w-full rounded-xl border border-sage/25 bg-offwhite px-4 py-2.5 text-xs text-slate-950 font-semibold outline-none focus:border-sage focus:ring-1 focus:ring-sage shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1.5">🖼️ Profile Picture (Camera / Gallery)</label>
                  <div className="flex flex-col items-center justify-center p-4 bg-offwhite border border-dashed border-sage/40 rounded-2xl relative">
                    <div className="relative group cursor-pointer w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500/25 shadow-sm mb-2 flex items-center justify-center bg-white">
                      {editForm.avatar ? (
                        <img src={editForm.avatar} alt="Profile Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-3xl text-slate-300">👤</div>
                      )}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[9px] font-bold transition duration-200">
                        <span>Upload 📷</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            compressImage(file, (dataUrl) => {
                              setEditForm({ ...editForm, avatar: dataUrl });
                            });
                          }
                        }}
                      />
                    </div>
                    <span className="text-[8px] font-semibold text-slate-400">Supports direct camera capture or photo gallery</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="rounded-full border border-sage/30 bg-white px-5 py-2 text-xs font-bold text-slate-700 hover:bg-mint/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="rounded-full bg-slate-950 px-5 py-2 text-xs font-bold text-offwhite hover:bg-slate-800 disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {editLoading ? 'Saving...' : 'Save Changes 🌟'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
