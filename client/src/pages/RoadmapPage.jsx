import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import api from '../api/axios.js';
import AppleEmoji from '../components/AppleEmoji.jsx';

const RoadmapPage = () => {
    const [goal, setGoal] = useState('');
  const [branch, setBranch] = useState('Computer Engineering');
  const [semester, setSemester] = useState('Semester 5');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline', 'skills', 'projects', 'interview'

  const cleanBulletText = (text) => {
    if (!text) return '';
    return text
      .replace(/^\*\*|\*\*$/g, '')
      .replace(/^[\s•\-\*]+/, '') // Strip standard bullets, dashes, asterisks
      .replace(/^\d+[\.\)]\s*/, '') // Strip numbers like "1. ", "1) "
      .trim();
  };

  // Preseeded Popular Careers Shortcuts
  const quickCareerTracks = [
    { title: "Frontend Developer", category: "Web Client", desc: "React, CSS architectures, and performance" },
    { title: "Backend Engineer", category: "Server/DB", desc: "Node.js, REST APIs, and system databases" },
    { title: "Machine Learning Engineer", category: "AI & ML", desc: "Neural networks, PyTorch, & LLM integrations" },
    { title: "DevOps & Cloud Specialist", category: "Infrastructure", desc: "Docker, Kubernetes, and CI/CD pipelines" }
  ];

  const generate = async (e) => {
    if (e) e.preventDefault();
    if (!goal.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const { data } = await api.post('/ai/roadmap', { goal, branch, semester });
      setResult(data.raw);
      setActiveTab('timeline'); // Reset to first tab
    } catch (err) {
      setResult('Roadmap generation failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTrackSelect = async (trackTitle) => {
    setGoal(trackTitle);
    setLoading(true);
    setResult('');
    try {
      const { data } = await api.post('/ai/roadmap', { goal: trackTitle, branch, semester });
      setResult(data.raw);
      setActiveTab('timeline');
    } catch (err) {
      setResult('Roadmap generation failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to safely parse JSON from Gemini response (which might contain markdown code blocks and conversational text)
  const getParsedRoadmap = () => {
    if (!result) return null;
    try {
      let cleanText = result.trim();
      
      // Look for code blocks first
      const codeBlockMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (codeBlockMatch) {
        cleanText = codeBlockMatch[1];
      } else {
        // Find outer curly braces
        const firstBrace = cleanText.indexOf('{');
        const lastBrace = cleanText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          cleanText = cleanText.substring(firstBrace, lastBrace + 1);
        }
      }
      
      return JSON.parse(cleanText.trim());
    } catch (e) {
      console.warn("Failed parsing roadmap JSON:", e);
      return null;
    }
  };

  const parsed = getParsedRoadmap();

  // Helper functions to resolve varying JSON keys from LLM output
  const getStageTitle = (stage) => {
    if (typeof stage === 'string') return stage;
    return stage.title || stage.phase || stage.semester || (stage.focus ? `${stage.semester || 'Phase'}: ${stage.focus}` : 'Milestone');
  };

  const getStageDescription = (stage) => {
    if (typeof stage === 'string') return '';
    if (stage.description) return stage.description;
    if (stage.content) return stage.content;
    
    let desc = '';
    if (stage.focus && stage.semester) desc += `${stage.focus}. `;
    
    if (Array.isArray(stage.activities)) {
      desc += stage.activities.map(act => act.replace(/^\*\*|\*\*$/g, '')).join(' • ');
    } else if (Array.isArray(stage.tasks)) {
      desc += stage.tasks.map(t => t.replace(/^\*\*|\*\*$/g, '')).join(' • ');
    }
    return desc || JSON.stringify(stage);
  };

  const getMascotSpeech = () => {
    if (loading) return "Charting custom industrial paths... compiling key projects and interview targets! 🧭🗺";
    if (result) return `Calculated career path for "${goal}" is ready! Click the tabs below to explore the roadmap. 🚀`;
    return "Welcome! I am your Career Navigator. Search your dream job or click a quick-start card to begin! 🏁";
  };

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12 overflow-hidden">
      <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-white/70 hover:bg-white border border-sage/20 px-3.5 py-1.5 text-xs font-bold text-slate-800 transition duration-200 shadow-sm hover:shadow hover:scale-102 mb-6 shrink-0 self-start">
        ← Back to Dashboard
      </Link>
      {/* Background ambient decorative glows */}
      <div className="absolute top-1/4 left-1/10 -z-10 h-72 w-72 rounded-full bg-palegreen/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 -z-10 h-96 w-96 rounded-full bg-mint/20 blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
        
        {/* Left Column: Mascot Card & Quick Career Tips */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          {/* Mascot Glass Box */}
          <div className="relative overflow-hidden rounded-[32px] border border-sage/20 bg-white/70 backdrop-blur-md p-6 text-center shadow-soft">
            <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-palegreen/25 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-mint/25 blur-2xl pointer-events-none" />
            
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-950 border border-sage/10 relative z-10">
              Career Navigator
            </span>
            
            {/* Lottie Mascot Container - Large Career Robot */}
            <div className="relative mx-auto my-5 flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-mint/45 to-palegreen/25 border border-sage/20 shadow-inner overflow-hidden">
              <div className="relative z-10 h-[240px] w-[240px] flex items-center justify-center overflow-hidden">
                <DotLottieReact
                  src="https://lottie.host/f57928c3-dfe8-4e82-a8c3-10ed19741d15/r7jvTW6TDE.lottie"
                  loop
                  autoplay
                  className="h-full w-full object-contain"
                  style={{ transform: 'scale(1.6)' }}
                />
              </div>
              {loading && (
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500 animate-spin" style={{ animationDuration: '6s' }} />
              )}
            </div>

            {/* Speech Bubble */}
            <div className="relative rounded-2xl border border-sage/25 bg-offwhite p-4 shadow-sm text-left">
              <div className="absolute left-1/2 -top-2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-sage/25 bg-offwhite" />
              <p className="relative z-10 text-[11px] font-semibold text-slate-800 leading-relaxed">
                <AppleEmoji emoji={getMascotSpeech()} />
              </p>
            </div>
          </div>

          {/* Quick Career Tips */}
          <div className="rounded-[28px] border border-sage/20 bg-white/70 backdrop-blur-md p-6 shadow-soft text-slate-700">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Quick Tips
            </h3>
            <ul className="mt-4 space-y-3 text-[11px] font-semibold leading-relaxed text-slate-650">
              <li className="flex items-start gap-2.5">
                <AppleEmoji emoji="💡" className="mt-0.5 shrink-0" />
                <span>Tie suggested projects directly to your final year seminar goals.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AppleEmoji emoji="🛠" className="mt-0.5 shrink-0" />
                <span>Focus heavily on learning 'Must-Have' core skills first.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AppleEmoji emoji="🎯" className="mt-0.5 shrink-0" />
                <span>Re-generate anytime when you advance to a new semester!</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Right Column: Goal Form & Results Tabs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[32px] bg-white/75 backdrop-blur-xl border border-sage/20 p-6 sm:p-10 shadow-[0_20px_50px_rgba(40,65,50,0.04)]"
        >
          {/* Header */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/55 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-950 border border-sage/10 select-none">
              <AppleEmoji emoji="🗺" /> Career Mapper
            </span>
            <h1 className="mt-4 text-3xl font-black text-slate-950 tracking-tight leading-none">
              Syllabus-Aligned Career Tracks
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2 max-w-lg leading-relaxed">
              Calculate semester milestones, recommended projects, skills, and mock questions tailored to your goals.
            </p>
          </div>

          {/* Configurable Form */}
          <form onSubmit={generate} className="grid gap-4 sm:grid-cols-3 relative z-10 mb-8">
            <div className="flex flex-col gap-1.5 sm:col-span-3">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Dream Career Goal</label>
              <input 
                value={goal} 
                onChange={(e) => setGoal(e.target.value)} 
                placeholder="e.g. Backend Engineer, Machine Learning Specialist, DevOps Architect..." 
                className="rounded-2xl border border-sage/20 bg-white px-4 py-3.5 text-xs font-semibold outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all duration-350 shadow-inner" 
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Engineering Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="rounded-2xl border border-sage/20 bg-white px-4 py-3.5 text-xs font-semibold outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 cursor-pointer transition shadow-inner"
              >
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Telecommunication">EXTC Engineering</option>
                <option value="Artificial Intelligence & Data Science">AI & DS Engineering</option>
                <option value="Other Branch">Other Specialization</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Current Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="rounded-2xl border border-sage/20 bg-white px-4 py-3.5 text-xs font-semibold outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 cursor-pointer transition shadow-inner"
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i} value={`Semester ${i + 1}`}>Semester {i + 1}</option>
                ))}
                <option value="Graduated">Graduated / Alumni</option>
              </select>
            </div>

            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={loading || !goal.trim()} 
                className="w-full rounded-2xl bg-slate-950 hover:bg-slate-900 py-3.5 text-xs font-black text-white shadow-md transition hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                <span>Generate Path</span>
                <AppleEmoji emoji="🧭" />
              </button>
            </div>
          </form>

          {/* Loading View */}
          {loading && (
            <div className="rounded-[32px] border border-sage/20 bg-white p-12 text-center shadow-inner flex flex-col items-center justify-center min-h-[380px]">
              <div className="h-40 w-40 flex items-center justify-center rounded-2xl bg-mint/25 border border-sage/10 p-4 mb-6 relative">
                <DotLottieReact
                  src="https://lottie.host/e677b229-0ca6-4f53-af49-2f6d1f722fdb/b8KeLmgx3O.lottie"
                  loop
                  autoplay
                  className="h-32 w-32"
                />
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }} 
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">Configuring custom timeline phases...</h3>
              <p className="text-[11px] text-slate-500 mt-2 font-semibold max-w-xs leading-relaxed">
                Mapping target skills and project metrics. Fallbacks will trigger instantly if services are busy.
              </p>
            </div>
          )}

          {/* Quick Career Tracks - displayed when empty/inactive */}
          {!result && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest pl-1 flex items-center gap-2 select-none">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <AppleEmoji emoji="🚀" /> Popular Career Tracks
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {quickCareerTracks.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuickTrackSelect(item.title)}
                    whileHover={{ y: -5, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="bg-white hover:bg-mint/15 border border-sage/15 p-5 rounded-[24px] flex flex-col justify-between text-left transition-all duration-300 shadow-sm hover:border-sage relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 h-16 w-16 rounded-full bg-mint/20 blur-xl pointer-events-none group-hover:bg-mint/45 transition-colors" />
                    <div>
                      <span className="inline-flex rounded-full bg-mint/55 border border-sage/10 text-emerald-950 px-2.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider mb-2">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-950 group-hover:text-emerald-950 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <span className="mt-4 text-[9px] font-black uppercase tracking-wider text-emerald-800 group-hover:text-emerald-950 transition-colors">
                      Map Career path →
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Output Presentation Tabs */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6"
              >
                {parsed ? (
                  <div className="space-y-6">
                    {/* Tab Navigation header */}
                    <div className="flex flex-wrap rounded-full bg-slate-100 border border-sage/15 p-1.5 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setActiveTab('timeline')}
                        className={`flex-1 rounded-full py-2.5 text-center text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 ${
                          activeTab === 'timeline'
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'text-slate-550 hover:text-slate-950'
                        }`}
                      >
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <span>Timeline</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('skills')}
                        className={`flex-1 rounded-full py-2.5 text-center text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 ${
                          activeTab === 'skills'
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'text-slate-550 hover:text-slate-950'
                        }`}
                      >
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Required Skills</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('projects')}
                        className={`flex-1 rounded-full py-2.5 text-center text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 ${
                          activeTab === 'projects'
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'text-slate-550 hover:text-slate-950'
                        }`}
                      >
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span>Suggested Projects</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('interview')}
                        className={`flex-1 rounded-full py-2.5 text-center text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 ${
                          activeTab === 'interview'
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'text-slate-550 hover:text-slate-950'
                        }`}
                      >
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Interview Prep</span>
                      </button>
                    </div>

                    {/* Active Tab View */}
                    <div className="mt-6">
                      
                      {/* Timeline Tab */}
                      {activeTab === 'timeline' && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="rounded-[28px] border border-sage/20 bg-mint/10 p-6 sm:p-8 shadow-sm"
                        >
                          <div className="relative border-l-2 border-dashed border-emerald-500/20 ml-6 pl-8 space-y-8">
                            {Array.isArray(parsed.roadmap) ? (
                              parsed.roadmap.map((stage, idx) => (
                                <div key={idx} className="relative">
                                  {/* Phase indicator node */}
                                  <div className="absolute -left-[50px] top-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-950 to-slate-800 text-white text-xs font-black border-4 border-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] z-10 transition-transform hover:scale-110 select-none">
                                    {idx + 1}
                                  </div>
                                  {typeof stage === 'object' ? (
                                    <div className="bg-white/90 backdrop-blur-sm border border-sage/20 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(40,65,50,0.06)] hover:border-emerald-500/30 transition-all duration-300 card-3d">
                                      <h4 className="text-sm font-black text-slate-900 tracking-tight flex items-center justify-between gap-3">
                                        <span>{getStageTitle(stage)}</span>
                                        {stage.focus && (
                                          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-mint/55 px-2.5 py-0.5 border border-sage/10 rounded-full select-none">
                                            {stage.focus}
                                          </span>
                                        )}
                                      </h4>
                                      
                                      {/* Short overview paragraph */}
                                      {stage.description && (
                                        <p className="mt-2 text-xs text-slate-500 leading-relaxed font-semibold">
                                          {stage.description}
                                        </p>
                                      )}

                                      {/* Bullet points tasks list */}
                                      {Array.isArray(stage.tasks) && stage.tasks.length > 0 && (
                                        <div className="mt-4 space-y-2.5 flex flex-col pl-1">
                                          {stage.tasks.map((taskItem, tIdx) => (
                                            <div key={tIdx} className="flex items-start gap-3 text-xs text-slate-655 font-medium leading-relaxed hover:text-slate-900 transition-colors py-0.5">
                                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_8px_#10b981]" />
                                              <span className="flex-1">{cleanBulletText(taskItem)}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      
                                      {/* Fallback activities list */}
                                      {!stage.tasks && Array.isArray(stage.activities) && stage.activities.length > 0 && (
                                        <div className="mt-4 space-y-2.5 flex flex-col pl-1">
                                          {stage.activities.map((actItem, aIdx) => (
                                            <div key={aIdx} className="flex items-start gap-3 text-xs text-slate-655 font-medium leading-relaxed hover:text-slate-900 transition-colors py-0.5">
                                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_8px_#10b981]" />
                                              <span className="flex-1">{cleanBulletText(actItem)}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {/* Direct string paragraph description if list doesn't exist */}
                                      {!stage.tasks && !stage.activities && (
                                        <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                                          {getStageDescription(stage)}
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="bg-white/90 backdrop-blur-sm border border-sage/20 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                                      <p className="text-xs text-slate-700 font-medium leading-relaxed">{stage}</p>
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-sage/20 shadow-sm">
                                {parsed.roadmap}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Required Skills Tab */}
                      {activeTab === 'skills' && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="rounded-[28px] border border-sage/20 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-sm"
                        >
                          <h3 className="text-sm font-extrabold text-slate-950 mb-5 flex items-center gap-1.5 select-none">
                            <AppleEmoji emoji="🛠" /> Must-Have Engineering Skills
                          </h3>
                          {Array.isArray(parsed.skills) ? (
                            <div className="flex flex-wrap gap-2.5">
                              {parsed.skills.map((skill, idx) => (
                                <motion.span 
                                  key={idx}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  className="rounded-xl bg-palegreen/40 hover:bg-palegreen/60 border border-sage/30 px-3.5 py-1.5 text-xs font-bold text-emerald-950 shadow-[0_2px_8px_rgba(40,65,50,0.04)] transition-all cursor-default select-none"
                                >
                                  {skill}
                                </motion.span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-655 leading-relaxed font-semibold whitespace-pre-line bg-slate-50 rounded-2xl p-5 border">
                              {parsed.skills}
                            </p>
                          )}
                        </motion.div>
                      )}

                      {/* Suggested Projects Tab */}
                      {activeTab === 'projects' && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          {Array.isArray(parsed.projects) ? (
                            parsed.projects.map((proj, idx) => (
                              <div key={idx} className="rounded-3xl border border-sage/20 bg-white/90 backdrop-blur-sm p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(40,65,50,0.06)] hover:border-emerald-500/30 transition-all duration-300 card-3d">
                                {typeof proj === 'object' ? (
                                  <>
                                    <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-[10px] font-black text-white shadow-sm select-none">
                                        P{idx + 1}
                                      </span>
                                      <span>{proj.name || proj.title}</span>
                                    </h4>
                                    <p className="mt-2.5 text-xs text-slate-500 leading-relaxed font-medium">
                                      {proj.description}
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{proj}</p>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-750 leading-relaxed font-medium whitespace-pre-line bg-white rounded-3xl p-6 border shadow-sm">
                              {parsed.projects}
                            </p>
                          )}
                        </motion.div>
                      )}

                      {/* Interview Prep Tab */}
                      {activeTab === 'interview' && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="rounded-[28px] border border-sage/20 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-sm"
                        >
                          <h3 className="text-sm font-extrabold text-slate-950 mb-5 flex items-center gap-1.5 select-none">
                            <AppleEmoji emoji="🎯" /> Interview & Oral Viva Targets
                          </h3>
                          {Array.isArray(parsed.interviewPrep) ? (
                            <ul className="space-y-4">
                              {parsed.interviewPrep.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-3.5 text-xs text-slate-700 font-medium leading-relaxed border-b border-slate-100/50 pb-4 last:border-b-0 last:pb-0">
                                  <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm select-none">
                                    <AppleEmoji emoji="✔️" className="h-2.5 w-2.5" />
                                  </span>
                                  <span className="flex-1 pt-0.5">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line bg-slate-50 rounded-2xl p-5 border">
                              {parsed.interviewPrep}
                            </p>
                          )}
                        </motion.div>
                      )}

                    </div>
                  </div>
                ) : (
                  // Fallback pre-wrapped plain text view
                  <div className="rounded-2xl border border-sage/25 p-6 bg-offwhite text-slate-800 text-xs font-semibold leading-relaxed whitespace-pre-line shadow-inner">
                    {result}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </main>
  );
};

export default RoadmapPage;
