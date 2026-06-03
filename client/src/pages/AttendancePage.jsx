import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import api from '../api/axios.js';
import AppleEmoji from '../components/AppleEmoji.jsx';

const AttendancePage = () => {
  const [form, setForm] = useState({ totalLectures: 30, attended: 26, skipEstimate: 2 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadSavedAttendance = async () => {
    try {
      const { data } = await api.get('/attendance');
      if (data) {
        setResult(data);
        setForm({
          totalLectures: data.totalLectures,
          attended: data.attended,
          skipEstimate: data.skipEstimate
        });
      }
    } catch (err) {
      console.warn("Failed to load saved attendance log.", err.message);
    }
  };

  useEffect(() => {
    loadSavedAttendance();
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/attendance/predict', form);
      setResult(data);
    } catch (error) {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const data = result ? [
    { name: 'Current Attendance', value: result.current },
    { name: 'Predicted Attendance', value: result.predicted }
  ] : [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12 overflow-hidden relative">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/4 left-1/10 -z-10 h-72 w-72 rounded-full bg-palegreen/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 -z-10 h-96 w-96 rounded-full bg-mint/20 blur-[120px] pointer-events-none" />

      {/* Page Header */}
      <div className="mb-10 text-center relative z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/55 border border-sage/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-950 shadow-sm select-none">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          AI Safety Calculator
        </span>
        <h1 className="mt-4 text-3xl sm:text-4.5xl font-black text-slate-950 tracking-tight leading-none">
          Attendance Predictor
        </h1>
        <p className="mt-2.5 text-xs sm:text-sm font-semibold text-slate-500 max-w-xl mx-auto leading-relaxed">
          Verify your semester exam eligibility, calculate current percentages, and predict the safety of future leaves before skipping.
        </p>
      </div>

      {/* Attendance Explainer / Benefit Banner */}
      <div className="mb-10 rounded-[28px] border border-sage/20 bg-palegreen/25 backdrop-blur-md p-6 relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-mint/45 blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/80 border border-sage/20 flex items-center justify-center shrink-0 shadow-sm text-2xl">
              <AppleEmoji emoji="💡" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-950 tracking-tight">Why is the Attendance Predictor Important?</h2>
              <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed max-w-2xl">
                Most universities require a strict <strong>75% attendance threshold</strong>. Falling below this limit can lead to <strong>exam debarment</strong> (not being allowed to sit for final papers). Use this calculator to plan your upcoming leaves safely without dropping below the safety zone.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="rounded-2xl bg-white/70 border border-sage/15 p-3 flex items-center gap-3 shrink-0">
              <div className="text-xl"><AppleEmoji emoji="⚖️" /></div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Target Limit</span>
                <span className="text-[11px] font-black text-emerald-950">75% Attendance</span>
              </div>
            </div>
            <div className="rounded-2xl bg-white/70 border border-sage/15 p-3 flex items-center gap-3 shrink-0">
              <div className="text-xl"><AppleEmoji emoji="🛡️" /></div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Benefit</span>
                <span className="text-[11px] font-black text-emerald-950">Prevent Debarment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Instruction Pipeline Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="rounded-[20px] border border-sage/25 bg-palegreen/30 backdrop-blur-md px-5 py-4 shadow-sm flex items-center gap-3.5"
        >
          <div className="h-9 w-9 rounded-xl bg-white/60 border border-sage/15 flex items-center justify-center shrink-0 shadow-inner">
            <AppleEmoji emoji="🏫" />
          </div>
          <div>
            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block leading-none">Step 01</span>
            <h3 className="text-xs font-black text-slate-900 tracking-wide mt-1">Input Classes Held</h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="rounded-[20px] border border-sage/25 bg-palegreen/30 backdrop-blur-md px-5 py-4 shadow-sm flex items-center gap-3.5"
        >
          <div className="h-9 w-9 rounded-xl bg-white/60 border border-sage/15 flex items-center justify-center shrink-0 shadow-inner">
            <AppleEmoji emoji="✅" />
          </div>
          <div>
            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block leading-none">Step 02</span>
            <h3 className="text-xs font-black text-slate-900 tracking-wide mt-1">Enter Your Attendance</h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="rounded-[20px] border border-sage/25 bg-palegreen/30 backdrop-blur-md px-5 py-4 shadow-sm flex items-center gap-3.5"
        >
          <div className="h-9 w-9 rounded-xl bg-white/60 border border-sage/15 flex items-center justify-center shrink-0 shadow-inner">
            <AppleEmoji emoji="✈️" />
          </div>
          <div>
            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block leading-none">Step 03</span>
            <h3 className="text-xs font-black text-slate-900 tracking-wide mt-1">Estimate Future Skips</h3>
          </div>
        </motion.div>
      </div>

      {/* Main Form Box */}
      <div className="rounded-[32px] bg-white/75 backdrop-blur-xl border border-sage/20 p-6 sm:p-8 shadow-[0_20px_50px_rgba(40,65,50,0.04)] relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-3">
            {/* Total Lectures */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 select-none">
                <AppleEmoji emoji="🏫" /> Total Lectures Conducted
              </label>
              <input 
                type="number" 
                value={form.totalLectures} 
                onChange={(e) => setForm({ ...form, totalLectures: Number(e.target.value) })} 
                placeholder="e.g. 30" 
                className="w-full rounded-2xl border border-sage/20 bg-white px-4 py-3.5 text-xs font-semibold outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all duration-350 shadow-inner" 
              />
              <span className="text-[9px] font-semibold text-slate-400 block leading-tight">Total classes held by the faculty so far this term.</span>
            </div>

            {/* Lectures Attended */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 select-none">
                <AppleEmoji emoji="✅" /> Lectures Attended
              </label>
              <input 
                type="number" 
                value={form.attended} 
                onChange={(e) => setForm({ ...form, attended: Number(e.target.value) })} 
                placeholder="e.g. 26" 
                className="w-full rounded-2xl border border-sage/20 bg-white px-4 py-3.5 text-xs font-semibold outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all duration-350 shadow-inner" 
              />
              <span className="text-[9px] font-semibold text-slate-400 block leading-tight">Total number of sessions you sat in.</span>
            </div>

            {/* Skip Estimate */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 select-none">
                <AppleEmoji emoji="✈️" /> Estimated Future Skips
              </label>
              <input 
                type="number" 
                value={form.skipEstimate} 
                onChange={(e) => setForm({ ...form, skipEstimate: Number(e.target.value) })} 
                placeholder="e.g. 2" 
                className="w-full rounded-2xl border border-sage/20 bg-white px-4 py-3.5 text-xs font-semibold outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all duration-350 shadow-inner" 
              />
              <span className="text-[9px] font-semibold text-slate-400 block leading-tight">Classes you plan/expect to skip next.</span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="rounded-2xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-extrabold shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 px-8 py-3.5 flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            {loading ? 'Calculating...' : (
              <>
                <span>Predict Attendance & Check Status</span>
                <AppleEmoji emoji="📊" />
              </>
            )}
          </button>
        </form>

        {/* Results Visual Segment */}
        {result && (
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
            {/* Verdict Card */}
            <div className="rounded-[28px] bg-mint/20 border border-sage/20 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[9px] font-black text-emerald-950 border border-sage/10 select-none mb-4">
                  <AppleEmoji emoji="⚖️" /> Safety Verdict
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Projected Attendance</p>
                <p className="mt-3 text-4.5xl font-black text-slate-950 tracking-tight leading-none">
                  {result.predicted}%
                </p>
                <p className="mt-4 text-xs text-slate-650 font-semibold leading-relaxed">
                  Your current attendance stands at <strong className="text-slate-900">{result.current}%</strong>. If you skip <strong className="text-emerald-705 font-bold">{form.skipEstimate}</strong> classes, it is expected to reach <strong className="text-slate-900">{result.predicted}%</strong>.
                </p>
              </div>

              <div className={`mt-6 p-4 rounded-2xl border text-xs font-extrabold flex items-center gap-3 ${
                result.predicted >= 75 
                  ? 'bg-mint/45 border-sage/30 text-emerald-950' 
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}>
                <div className="text-xl">
                  <AppleEmoji emoji={result.predicted >= 75 ? '🎉' : '⚠️'} />
                </div>
                <div>
                  <h4 className="uppercase tracking-wider text-[10px]">Status Check</h4>
                  <p className="font-semibold text-slate-705 mt-0.5 leading-snug">{result.warning}</p>
                </div>
              </div>
            </div>

            {/* Comparison Visual Chart */}
            <div className="rounded-[28px] border border-sage/20 bg-surface/50 p-6 shadow-soft">
              <span className="inline-flex items-center gap-1 rounded-full bg-mint/55 px-2.5 py-1 text-[9px] font-black text-emerald-950 border border-sage/10 select-none mb-4">
                <AppleEmoji emoji="📈" /> Safety Threshold Graph
              </span>
              <div className="h-[250px] w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#F2F4EF', border: '1px solid #A8C3A0', borderRadius: '16px' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                      formatter={(value) => `${value}%`}
                    />
                    <Bar dataKey="value" fill="#A8C3A0" radius={[12, 12, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AttendancePage;
