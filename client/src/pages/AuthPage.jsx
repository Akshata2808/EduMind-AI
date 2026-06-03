import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext.jsx';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import AppleEmoji from '../components/AppleEmoji.jsx';

const AuthPage = () => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '', branch: '', semester: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Network Error: Could not connect to the server. Please check if the backend server is running on http://localhost:5000.');
      } else {
        setError(err.response.data.message || 'Authentication failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 flex items-center min-h-[calc(100vh-80px)]">
      <div className="grid w-full gap-8 lg:grid-cols-12 rounded-[36px] p-6 md:p-10 shadow-soft overflow-hidden glass-premium border border-sage/25 card-3d">
        
        {/* Left Side: Animated Form */}
        <motion.div 
          className="lg:col-span-7 flex flex-col justify-center pr-0 lg:pr-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-palegreen/55 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-950 border border-sage/20">
                <AppleEmoji emoji="⚡" /> {isRegister ? 'New Member Registration' : 'Welcome Back'}
              </span>
              <h1 className="mt-3.5 text-3xl md:text-4.5xl font-black tracking-tight text-slate-950 font-heading flex flex-wrap items-center gap-2">
                {isRegister ? (
                  <>Join EduMind AI <AppleEmoji emoji="🧠" /></>
                ) : (
                  <>Sign in to EduMind <AppleEmoji emoji="🚀" /></>
                )}
              </h1>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                {isRegister ? 'Start your academic productivity journey today.' : 'Enter your credentials to access your smart workspace.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsRegister((prev) => !prev)}
              className="self-start sm:self-center rounded-full bg-palegreen border border-sage/35 px-5 py-2.5 text-xs font-black text-slate-950 hover:bg-sage hover:shadow-md transition-all duration-300 hover:scale-103 cursor-pointer"
            >
              {isRegister ? (
                'Have an account? Login'
              ) : (
                <span className="flex items-center gap-1.5">Create Account <AppleEmoji emoji="✨" /></span>
              )}
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-2xl bg-rose-100/90 border border-rose-200 p-4 text-xs font-bold text-rose-800 flex items-start gap-2"
            >
              <AppleEmoji emoji="⚠️" className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4.5">
            <AnimatePresence mode="wait">
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid gap-4.5 overflow-hidden"
                >
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <AppleEmoji emoji="👤" /> Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Rohan Gupta"
                      className="w-full rounded-2xl border border-sage/25 bg-offwhite px-4 py-3 text-sm text-slate-900 outline-none transition-all hover:border-sage/55 focus:border-sage focus:ring-2 focus:ring-sage/25 focus:scale-[1.01] shadow-inner duration-200"
                      required={isRegister}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <AppleEmoji emoji="✉️" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@college.edu"
                className="w-full rounded-2xl border border-sage/25 bg-offwhite px-4 py-3 text-sm text-slate-900 outline-none transition-all hover:border-sage/55 focus:border-sage focus:ring-2 focus:ring-sage/25 focus:scale-[1.01] shadow-inner duration-200"
                required
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <AppleEmoji emoji="🔑" /> Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-sage/25 bg-offwhite px-4 py-3 text-sm text-slate-900 outline-none transition-all hover:border-sage/55 focus:border-sage focus:ring-2 focus:ring-sage/25 focus:scale-[1.01] shadow-inner duration-200"
                required
              />
            </div>

            <AnimatePresence mode="wait">
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid gap-4 overflow-hidden"
                >
                  <div className="grid gap-4.5 sm:grid-cols-3">
                    <div>
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                        <AppleEmoji emoji="🎓" /> College
                      </label>
                      <input
                        name="college"
                        value={form.college}
                        onChange={handleChange}
                        placeholder="e.g. MIT"
                        className="w-full rounded-2xl border border-sage/25 bg-offwhite px-4 py-3 text-sm text-slate-900 outline-none transition-all hover:border-sage/55 focus:border-sage focus:ring-2 focus:ring-sage/25 focus:scale-[1.01] shadow-inner duration-200"
                        required={isRegister}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                        <AppleEmoji emoji="📚" /> Branch
                      </label>
                      <input
                        name="branch"
                        value={form.branch}
                        onChange={handleChange}
                        placeholder="e.g. CS"
                        className="w-full rounded-2xl border border-sage/25 bg-offwhite px-4 py-3 text-sm text-slate-900 outline-none transition-all hover:border-sage/55 focus:border-sage focus:ring-2 focus:ring-sage/25 focus:scale-[1.01] shadow-inner duration-200"
                        required={isRegister}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                        <AppleEmoji emoji="📅" /> Semester
                      </label>
                      <input
                        name="semester"
                        value={form.semester}
                        onChange={handleChange}
                        placeholder="e.g. 4th"
                        className="w-full rounded-2xl border border-sage/25 bg-offwhite px-4 py-3 text-sm text-slate-900 outline-none transition-all hover:border-sage/55 focus:border-sage focus:ring-2 focus:ring-sage/25 focus:scale-[1.01] shadow-inner duration-200"
                        required={isRegister}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-palegreen border border-sage/35 py-3.5 text-sm font-black text-slate-950 shadow-md hover:bg-sage hover:scale-101 active:scale-99 hover:shadow-lg transition-all duration-300 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                'Processing...'
              ) : isRegister ? (
                <span className="flex items-center justify-center gap-1.5">Register & Begin <AppleEmoji emoji="🌟" /></span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">Sign In <AppleEmoji emoji="🔑" /></span>
              )}
            </button>
          </form>
        </motion.div>

        {/* Right Side: Attractive Visual Panel */}
        <motion.div 
          className="lg:col-span-5 hidden lg:flex flex-col justify-between rounded-[28px] bg-gradient-to-br from-palegreen/55 via-mint/45 to-sage/35 border border-sage/35 p-8 relative overflow-hidden shadow-lg"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >

          
          <div className="relative z-10">
            <h2 className="text-xl font-heading font-black text-slate-950 flex items-center gap-2">
              EduMind AI Ecosystem
            </h2>
            <p className="text-xs font-semibold text-slate-700 mt-2 leading-relaxed">
              Step into a unified, high-performance workspace engineered for engineering students. Learn faster, recall better, and collaborate with ease.
            </p>
          </div>

          {/* Core Illustration - Animated Lottie */}
          <div className="my-2 flex justify-center items-center relative w-full h-[240px]">
            <div className="absolute inset-0 bg-white/25 blur-3xl rounded-full scale-75" />
            <div className="relative z-10 w-full h-full max-h-[240px] flex items-center justify-center">
              <DotLottieReact
                src="https://lottie.host/ac451374-8d20-4d36-8ffb-9d7c524cf48f/6fjE4RTYBm.lottie"
                loop
                autoplay
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Quick highlights list */}
          <div className="space-y-3 relative z-10">
            {[
              {
                title: 'AI Study Companion',
                desc: 'Clear engineering doubts instantly with curriculum context.',
                emoji: '🧠',
                bg: 'bg-white/85 border border-sage/25 shadow-sm hover:border-emerald-600/30'
              },
              {
                title: 'Smart Quizzes & Analytics',
                desc: 'Measure preparation depth and topic retention automatically.',
                emoji: '📊',
                bg: 'bg-white/85 border border-sage/25 shadow-sm hover:border-emerald-600/30'
              },
              {
                title: 'Student & Expert Forum',
                desc: 'Access discussions, shared notes, and peer study groups.',
                emoji: '👥',
                bg: 'bg-white/85 border border-sage/25 shadow-sm hover:border-emerald-600/30'
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className={`rounded-[20px] p-3 text-left transition-all duration-300 shadow-sm ${item.bg}`}
                whileHover={{ scale: 1.025, x: 4 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center p-1.5 rounded-xl bg-palegreen/50 text-base shrink-0">
                    <AppleEmoji emoji={item.emoji} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 leading-normal">{item.title}</h4>
                    <p className="text-[10px] font-semibold text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>

      </div>
    </main>
  );
};

export default AuthPage;
