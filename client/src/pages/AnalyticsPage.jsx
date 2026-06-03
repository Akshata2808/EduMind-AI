import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios.js';
import AnalyticsCharts from '../components/AnalyticsCharts.jsx';
import AppleEmoji from '../components/AppleEmoji.jsx';

const parseInlineMarkdown = (text) => {
  if (!text) return '';
  const parts = text.split(/(\*\*)/g);
  let isBold = false;
  return parts.map((part, index) => {
    if (part === '**') {
      isBold = !isBold;
      return null;
    }
    if (isBold) {
      return <strong key={index} className="font-black text-slate-900">{part}</strong>;
    }
    return part;
  });
};

const renderMarkdown = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('#### ')) {
      return <h5 key={index} className="text-xs font-black text-emerald-950 mt-3 mb-1">{parseInlineMarkdown(trimmed.slice(5))}</h5>;
    }
    if (trimmed.startsWith('### ')) {
      return <h4 key={index} className="text-xs font-black text-emerald-900 mt-3.5 mb-1">{parseInlineMarkdown(trimmed.slice(4))}</h4>;
    }
    if (trimmed.startsWith('## ')) {
      return <h3 key={index} className="text-xs font-black text-slate-900 mt-4 mb-1.5">{parseInlineMarkdown(trimmed.slice(3))}</h3>;
    }
    if (trimmed.startsWith('# ')) {
      return <h2 key={index} className="text-sm font-black text-slate-950 mt-4 mb-2">{parseInlineMarkdown(trimmed.slice(2))}</h2>;
    }
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      return (
        <ul key={index} className="list-disc pl-4 my-1 text-slate-700">
          <li className="font-semibold text-xs leading-relaxed">{parseInlineMarkdown(trimmed.slice(2))}</li>
        </ul>
      );
    }
    if (trimmed === '---') {
      return <hr key={index} className="my-3 border-t border-sage/30" />;
    }
    if (!trimmed) return <div key={index} className="h-2" />;
    return (
      <p key={index} className="my-1.5 leading-relaxed text-slate-700 font-semibold">
        {parseInlineMarkdown(line)}
      </p>
    );
  });
};

const AnalyticsPage = () => {
  const [attendance, setAttendance] = useState(80);
  const [quizAccuracy, setQuizAccuracy] = useState(70);
  const [notesUploaded, setNotesUploaded] = useState(3);
  const [plannerProgress, setPlannerProgress] = useState(50);
  const [studyStreak, setStudyStreak] = useState(2);

  const [dataText, setDataText] = useState('');
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync inputs to textual prompt
  useEffect(() => {
    setDataText(`Attendance: ${attendance}%, Quiz Accuracy: ${quizAccuracy}%, Notes Uploaded: ${notesUploaded}, Planner Progress: ${plannerProgress}%, Study Streak: ${studyStreak} days`);
  }, [attendance, quizAccuracy, notesUploaded, plannerProgress, studyStreak]);

  const run = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/ai/analytics', { summaryData: dataText });
      setInsights(data.raw);
    } catch (err) {
      setInsights('### ⚠️ Diagnostic Failure\nFailed to compile audit. Please verify your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!insights) return;
    const cleanText = insights
      .replace(/\*\*\*/g, '')
      .replace(/\*\*/g, '')
      .replace(/####\s+/g, '• ')
      .replace(/###\s+/g, '')
      .replace(/##\s+/g, '')
      .replace(/#\s+/g, '')
      .replace(/---\n/g, '\n');

    const blob = new Blob([cleanText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EduMind_Academic_Audit.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12 overflow-hidden relative">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/10 -z-10 h-72 w-72 rounded-full bg-palegreen/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 -z-10 h-96 w-96 rounded-full bg-mint/20 blur-[120px] pointer-events-none" />

      {/* Page Header */}
      <div className="mb-10 text-center relative z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/55 border border-sage/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-950 shadow-sm select-none">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          AI Performance Analytics
        </span>
        <h1 className="mt-4 text-3xl sm:text-4.5xl font-black text-slate-950 tracking-tight leading-none">
          Study Analytics Hub
        </h1>
        <p className="mt-2.5 text-xs sm:text-sm font-semibold text-slate-500 max-w-xl mx-auto leading-relaxed">
          Audit your study habits, verify your examination eligibility, and receive a customized learning roadmap instantly.
        </p>
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
            <AppleEmoji emoji="🎯" />
          </div>
          <div>
            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block leading-none">Step 01</span>
            <h3 className="text-xs font-black text-slate-900 tracking-wide mt-1">Configure Metrics</h3>
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
            <AppleEmoji emoji="🤖" />
          </div>
          <div>
            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block leading-none">Step 02</span>
            <h3 className="text-xs font-black text-slate-900 tracking-wide mt-1">Run AI Neural Audit</h3>
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
            <AppleEmoji emoji="📋" />
          </div>
          <div>
            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block leading-none">Step 03</span>
            <h3 className="text-xs font-black text-slate-900 tracking-wide mt-1">Get Study Action Plan</h3>
          </div>
        </motion.div>
      </div>

      {/* Main Workspace Split Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr] relative z-10">
        
        {/* Left Column: Configure Sliders & Prompt */}
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white/75 backdrop-blur-xl border border-sage/20 p-6 sm:p-8 shadow-[0_20px_50px_rgba(40,65,50,0.04)]">
            <div className="flex flex-col gap-1.5 mb-6">
              <h2 className="text-base font-extrabold text-slate-950 tracking-tight flex items-center gap-2 select-none">
                <AppleEmoji emoji="🛠️" /> 1. Configure Your Metrics
              </h2>
              <p className="text-[10px] font-semibold text-slate-400 pl-8 leading-normal">
                Drag the sliders to adjust your values or click a quick profile helper below to load test templates.
              </p>
            </div>

            {/* Presets Row */}
            <div className="mb-6 border-b border-sage/10 pb-5">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-2 select-none">Quick Test Profiles</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAttendance(92);
                    setQuizAccuracy(85);
                    setNotesUploaded(5);
                    setPlannerProgress(90);
                    setStudyStreak(12);
                  }}
                  className="rounded-full bg-mint/50 hover:bg-mint border border-sage/15 px-3 py-1.5 text-[9px] font-black text-emerald-950 transition active:scale-95 shadow-sm"
                >
                  🚀 High Performer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAttendance(68);
                    setQuizAccuracy(55);
                    setNotesUploaded(1);
                    setPlannerProgress(30);
                    setStudyStreak(1);
                  }}
                  className="rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 text-[9px] font-black text-rose-700 transition active:scale-95 shadow-sm"
                >
                  ⚠️ Critical Warning
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAttendance(80);
                    setQuizAccuracy(72);
                    setNotesUploaded(3);
                    setPlannerProgress(60);
                    setStudyStreak(4);
                  }}
                  className="rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-350 px-3 py-1.5 text-[9px] font-black text-slate-800 transition active:scale-95 shadow-sm"
                >
                  🎓 Sem Standard
                </button>
              </div>
            </div>

            {/* Sliders Grid */}
            <form onSubmit={run} className="space-y-5">
              {/* Attendance */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5 select-none">
                    <AppleEmoji emoji="📅" /> Lecture Attendance
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${attendance >= 75 ? 'bg-mint/45 text-emerald-950 border border-sage/10' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                    {attendance}% {attendance >= 75 ? '(Eligible)' : '(Warning)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={attendance}
                  onChange={(e) => setAttendance(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                />
              </div>

              {/* Quiz Accuracy */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5 select-none">
                    <AppleEmoji emoji="🎯" /> Quiz Accuracy
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-mint/45 text-emerald-950 border border-sage/10 text-[10px] font-black">
                    {quizAccuracy}% Accuracy
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={quizAccuracy}
                  onChange={(e) => setQuizAccuracy(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                />
              </div>

              {/* Notes Uploaded */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5 select-none">
                    <AppleEmoji emoji="📝" /> Notes Uploaded
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-mint/45 text-emerald-950 border border-sage/10 text-[10px] font-black">
                    {notesUploaded} Documents
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={notesUploaded}
                  onChange={(e) => setNotesUploaded(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                />
              </div>

              {/* Planner Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5 select-none">
                    <AppleEmoji emoji="📋" /> Planner Completion
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-mint/45 text-emerald-950 border border-sage/10 text-[10px] font-black">
                    {plannerProgress}% Done
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={plannerProgress}
                  onChange={(e) => setPlannerProgress(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                />
              </div>

              {/* Study Streak */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5 select-none">
                    <AppleEmoji emoji="🔥" /> Study Streak
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-black">
                    {studyStreak} Day Habit
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={studyStreak}
                  onChange={(e) => setStudyStreak(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                />
              </div>

              {/* Compiled Summary Text Area Preview */}
              <div className="pt-4 border-t border-sage/10 space-y-2.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block select-none">Compiled Summary Data</label>
                <textarea
                  value={dataText}
                  onChange={(e) => setDataText(e.target.value)}
                  className="w-full rounded-2xl border border-sage/20 bg-slate-50 px-4 py-3.5 text-[11px] font-semibold outline-none focus:border-sage transition shadow-inner font-mono text-slate-650"
                  rows={2}
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-extrabold shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 py-4 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" style={{ animationDelay: '300ms' }} />
                    Analyzing Study Profile...
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 select-none">
                    <span>Generate AI Diagnostic Report</span>
                    <AppleEmoji emoji="⚙️" />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: AI Reports & Charts */}
        <div className="space-y-6">
          {/* AI Diagnostic Output */}
          <div className="rounded-[32px] bg-white/75 backdrop-blur-xl border border-sage/20 p-6 sm:p-8 shadow-[0_20px_50px_rgba(40,65,50,0.04)] flex flex-col justify-between min-h-[280px]">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-mint/55 px-2.5 py-1 text-[9px] font-black text-emerald-950 border border-sage/10 select-none mb-2">
                    <AppleEmoji emoji="🤖" /> Performance Audit
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-950 tracking-tight">AI Diagnostic Insights</h2>
                </div>

                {insights && (
                  <button
                    onClick={downloadReport}
                    className="inline-flex items-center justify-center rounded-full bg-palegreen/50 hover:bg-palegreen text-slate-950 px-4 py-2 border border-sage/35 text-[10px] font-extrabold shadow-sm transition active:scale-95 gap-1 select-none cursor-pointer"
                  >
                    <span>Download Plan</span>
                    <AppleEmoji emoji="💾" />
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {insights ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-sage/20 bg-white p-5 text-xs text-slate-700 leading-relaxed font-semibold shadow-inner max-h-[300px] overflow-y-auto scrollbar-thin"
                  >
                    <div className="text-slate-800">{renderMarkdown(insights)}</div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border border-dashed border-sage/25 p-10 text-center bg-slate-50"
                  >
                    <div className="text-2xl block mb-2 select-none">
                      <AppleEmoji emoji="📋" />
                    </div>
                    <p className="text-xs font-bold text-slate-500">Your AI diagnostic report will populate here. Adjust the metrics on the left and click "Generate".</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Visual study trend graphs */}
          <div className="rounded-[32px] bg-white/75 backdrop-blur-xl border border-sage/20 p-6 sm:p-8 shadow-[0_20px_50px_rgba(40,65,50,0.04)]">
            <span className="inline-flex items-center gap-1 rounded-full bg-mint/55 px-2.5 py-1 text-[9px] font-black text-emerald-950 border border-sage/10 select-none mb-2">
              <AppleEmoji emoji="📈" /> Study Hours vs Quiz Score
            </span>
            <h2 className="text-lg font-extrabold text-slate-950 tracking-tight">Syllabus Practice Trends</h2>
            <p className="text-xs font-semibold text-slate-500 mt-1 mb-5">
              Visualization of study consistency and average test scores per week.
            </p>

            <div className="rounded-2xl border border-sage/15 p-4 bg-slate-50">
              <AnalyticsCharts />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default AnalyticsPage;
