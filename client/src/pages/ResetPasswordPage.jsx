import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppleEmoji from '../components/AppleEmoji.jsx';
import api from '../api/axios.js';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      setStatus(data.message || 'Password updated successfully!');
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-16 flex items-center min-h-[calc(100vh-80px)]">
      <motion.div 
        className="w-full rounded-[36px] p-6 md:p-8 shadow-soft bg-white/75 backdrop-blur-xl border border-sage/25 overflow-hidden relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute -left-12 -top-12 h-28 w-28 rounded-full bg-palegreen/20 blur-2xl" />
        <div className="absolute -right-12 -bottom-12 h-28 w-28 rounded-full bg-mint/30 blur-2xl" />

        <div className="relative z-10 text-center mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-palegreen/55 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-950 border border-sage/20 mb-2">
            <AppleEmoji emoji="🔑" /> Security Update
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950 font-heading">
            Choose New Password
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Ensure your new password is secure and at least 6 characters.
          </p>
        </div>

        {status && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 flex items-start gap-2 relative z-10"
          >
            <AppleEmoji emoji="✨" className="mt-0.5 shrink-0" />
            <div>
              <p>{status}</p>
              <p className="text-[10px] font-medium text-emerald-600 mt-1">Redirecting you to Login page in 3 seconds...</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl bg-rose-100 border border-rose-200 p-4 text-xs font-bold text-rose-800 flex items-start gap-2 relative z-10"
          >
            <AppleEmoji emoji="⚠️" className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {!status && (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">🔑 New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-sage/25 bg-offwhite px-4 py-3 text-sm text-slate-900 outline-none transition-all hover:border-sage/55 focus:border-sage focus:ring-2 focus:ring-sage/25 shadow-inner"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">🔁 Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-sage/25 bg-offwhite px-4 py-3 text-sm text-slate-900 outline-none transition-all hover:border-sage/55 focus:border-sage focus:ring-2 focus:ring-sage/25 shadow-inner"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full bg-palegreen border border-sage/35 py-3.5 text-sm font-black text-slate-950 shadow-md hover:bg-sage hover:scale-101 active:scale-99 hover:shadow-lg transition-all duration-300 disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Updating...' : 'Update Password 🌟'}
            </button>
          </form>
        )}
      </motion.div>
    </main>
  );
};

export default ResetPasswordPage;
