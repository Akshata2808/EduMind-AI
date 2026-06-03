import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import api from '../api/axios.js';
import AppleEmoji from '../components/AppleEmoji.jsx';

// Sub-parser for inline Markdown highlights inside revision notes
const parseInlineStyle = (text, isAI = true) => {
  if (!text) return '';
  const parts = [];
  let remaining = text;
  
  if (!remaining.includes('**') && !remaining.includes('*') && !remaining.includes('`')) {
    return remaining;
  }
  
  let keyIndex = 0;
  while (remaining) {
    const boldIndex = remaining.indexOf('**');
    const codeIndex = remaining.indexOf('`');
    const italicIndex = remaining.indexOf('*');
    
    const indices = [
      { type: 'bold', index: boldIndex, len: 2 },
      { type: 'code', index: codeIndex, len: 1 },
      { type: 'italic', index: italicIndex, len: 1 }
    ].filter(item => item.index !== -1).sort((a, b) => a.index - b.index);
    
    if (indices.length === 0) {
      parts.push(remaining);
      break;
    }
    
    const first = indices[0];
    if (first.index > 0) {
      parts.push(remaining.substring(0, first.index));
    }
    
    const searchFrom = first.index + first.len;
    let closeIndex = remaining.indexOf(first.type === 'bold' ? '**' : first.type === 'code' ? '`' : '*', searchFrom);
    
    if (closeIndex === -1) {
      parts.push(remaining.substring(first.index, searchFrom));
      remaining = remaining.substring(searchFrom);
    } else {
      const matchText = remaining.substring(searchFrom, closeIndex);
      if (first.type === 'bold') {
        parts.push(<strong key={keyIndex++} className="font-extrabold text-slate-950">{matchText}</strong>);
      } else if (first.type === 'code') {
        parts.push(<code key={keyIndex++} className="bg-slate-100 border border-slate-200 text-emerald-800 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold">{matchText}</code>);
      } else if (first.type === 'italic') {
        parts.push(<em key={keyIndex++} className="italic text-slate-900">{matchText}</em>);
      }
      remaining = remaining.substring(closeIndex + first.len);
    }
  }
  return parts;
};

// Line-by-line simple Markdown-to-JSX compiler
const renderMarkdown = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let cleanLine = line;
    
    if (cleanLine.trim() === '---') {
      return <hr key={idx} className="my-4 border-sage/20" />;
    }
    
    if (cleanLine.startsWith('### ')) {
      return (
        <h3 key={idx} className="text-xs font-black text-slate-955 tracking-tight mt-4.5 mb-1.5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
          {parseInlineStyle(cleanLine.substring(4))}
        </h3>
      );
    }
    if (cleanLine.startsWith('## ')) {
      return (
        <h2 key={idx} className="text-sm font-extrabold text-slate-955 tracking-tight mt-5 mb-2 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          {parseInlineStyle(cleanLine.substring(3))}
        </h2>
      );
    }
    if (cleanLine.startsWith('# ')) {
      return (
        <h1 key={idx} className="text-base font-black text-slate-955 tracking-tight mt-5 mb-2">
          {parseInlineStyle(cleanLine.substring(2))}
        </h1>
      );
    }
    
    if (cleanLine.trim().startsWith('* ') || cleanLine.trim().startsWith('- ')) {
      const listContent = cleanLine.trim().substring(2);
      return (
        <li key={idx} className="ml-4 list-disc pl-0.5 text-xs text-slate-700 leading-relaxed font-semibold my-1">
          {parseInlineStyle(listContent)}
        </li>
      );
    }

    const numMatch = cleanLine.trim().match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      return (
        <div key={idx} className="ml-2 pl-0.5 text-xs text-slate-700 leading-relaxed font-semibold my-1 flex gap-2">
          <span className="text-emerald-700 font-extrabold shrink-0">{numMatch[1]}.</span>
          <span className="flex-1">{parseInlineStyle(numMatch[2])}</span>
        </div>
      );
    }

    return (
      <p key={idx} className="text-xs text-slate-700 leading-relaxed font-semibold my-1 min-h-[1px]">
        {parseInlineStyle(cleanLine)}
      </p>
    );
  });
};

const RevisionPage = () => {
  const [subjects, setSubjects] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('priorities');

  const generate = async (e) => {
    e.preventDefault();
    if (!subjects.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/ai/revision', { 
        subjects: subjects.split(',').map(s => s.trim()).filter(Boolean) 
      });
      
      // Clean and parse JSON response safely
      let parsed = null;
      try {
        const cleanJson = data.raw.replace(/```json|```/g, '').trim();
        parsed = JSON.parse(cleanJson);
      } catch (parseError) {
        console.warn("JSON parsing failed, formatting as raw text.");
        parsed = {
          notes: data.raw,
          topics: [],
          questions: [],
          priorities: []
        };
      }
      
      setResult(parsed);
      setActiveTab('priorities');
    } catch (err) {
      setResult({
        notes: 'Failed to generate revision guidelines. Please check your network and try again!',
        topics: [],
        questions: [],
        priorities: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12 overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/10 -z-10 h-72 w-72 rounded-full bg-palegreen/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 -z-10 h-96 w-96 rounded-full bg-mint/15 blur-[120px] pointer-events-none" />

      <div className="rounded-[32px] bg-white/75 backdrop-blur-xl border border-sage/20 p-6 sm:p-10 shadow-[0_20px_50px_rgba(40,65,50,0.04)] relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-palegreen/20 blur-2xl pointer-events-none" />
        <div className="absolute -right-16 -bottom-16 h-36 w-36 rounded-full bg-mint/20 blur-2xl pointer-events-none" />

        <div className="mb-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/55 border border-sage/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950 select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Revision Coach
          </span>
          <h1 className="mt-4 text-3xl font-black text-slate-950 tracking-tight leading-tight">
            Smart Revision Coach
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed max-w-lg mx-auto">
            Input your subjects or chapters to generate dynamic study priorities, concise notes, and targeted viva questions.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={generate} className="grid gap-3 sm:grid-cols-[1fr_200px] relative z-10 mb-8">
          <input 
            value={subjects} 
            onChange={(e) => setSubjects(e.target.value)} 
            placeholder="e.g. Data Structures, Operating Systems, DBMS" 
            className="rounded-2xl border border-sage/20 bg-white px-4.5 py-3.5 text-xs font-semibold outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all duration-350 shadow-inner" 
          />
          <button 
            type="submit" 
            disabled={loading || !subjects.trim()} 
            className="rounded-2xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-extrabold shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-1.5 select-none"
          >
            {loading ? (
              <>
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                Planning...
              </>
            ) : (
              <>
                <span>Generate Coach</span>
                <AppleEmoji emoji="🧠" />
              </>
            )}
          </button>
        </form>

        {/* Main Dashboard Output Area */}
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 relative z-10"
            >
              {/* Tab Header Selector */}
              <div className="flex flex-wrap rounded-full bg-slate-100 border border-sage/15 p-1.5 shadow-inner select-none">
                <button 
                  onClick={() => setActiveTab('priorities')}
                  className={`flex-1 rounded-full py-2.5 text-center text-xs font-black transition-all duration-200 ${activeTab === 'priorities' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-550 hover:text-slate-950'}`}
                >
                  Priorities
                </button>
                <button 
                  onClick={() => setActiveTab('topics')}
                  className={`flex-1 rounded-full py-2.5 text-center text-xs font-black transition-all duration-200 ${activeTab === 'topics' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-550 hover:text-slate-950'}`}
                >
                  Key Concepts
                </button>
                <button 
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 rounded-full py-2.5 text-center text-xs font-black transition-all duration-200 ${activeTab === 'notes' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-550 hover:text-slate-950'}`}
                >
                  Syllabus Notes
                </button>
                <button 
                  onClick={() => setActiveTab('questions')}
                  className={`flex-1 rounded-full py-2.5 text-center text-xs font-black transition-all duration-200 ${activeTab === 'questions' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-550 hover:text-slate-950'}`}
                >
                  Viva Questions
                </button>
              </div>

              {/* Tab Panel Contents */}
              <div className="min-h-[300px]">
                
                {/* Priorities Tab (Animated Progress Bars) */}
                {activeTab === 'priorities' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2 select-none">
                        <AppleEmoji emoji="📊" /> Chapter & Module Weightage Priorities
                      </h3>
                      <p className="text-[10px] font-semibold text-slate-400 mt-1">Focus on high scoring modules first to maximize efficiency.</p>
                    </div>

                    <div className="space-y-5 bg-white/90 backdrop-blur-sm rounded-3xl border border-sage/20 p-6 shadow-sm">
                      {result.priorities && result.priorities.length > 0 ? (
                        result.priorities.map((item, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-800">{item.chapter}</span>
                              <span className="text-emerald-800 font-black">{item.score}% Weight</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.score}%` }}
                                transition={{ duration: 1, delay: idx * 0.08, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-emerald-400 to-mint rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs font-semibold text-slate-500 italic">No priorities scored.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Topics List Tab */}
                {activeTab === 'topics' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2 select-none">
                        <AppleEmoji emoji="✅" /> Important Revision Checklist
                      </h3>
                      <p className="text-[10px] font-semibold text-slate-400 mt-1">Cross off these topics as you review them during study blocks.</p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-sage/20 p-6 shadow-sm">
                      {result.topics && result.topics.length > 0 ? (
                        <ul className="space-y-3">
                          {result.topics.map((topicItem, idx) => (
                            <motion.li 
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-center gap-3 text-xs text-slate-700 font-semibold py-1.5 hover:text-slate-900 transition-colors border-b border-slate-50 last:border-b-0"
                            >
                              <input type="checkbox" className="rounded border-sage/40 text-emerald-600 focus:ring-emerald-500 cursor-pointer h-4.5 w-4.5" />
                              <span className="select-none">{topicItem}</span>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs font-semibold text-slate-500 italic">No topics extracted.</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Syllabus Notes (Parsed Markdown) */}
                {activeTab === 'notes' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2 select-none">
                        <AppleEmoji emoji="📖" /> Concise Syllabus Revision Guidelines
                      </h3>
                      <p className="text-[10px] font-semibold text-slate-400 mt-1">Core textbook concepts compressed for quick reading.</p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-sage/20 p-6 shadow-sm min-h-[150px] leading-relaxed">
                      {renderMarkdown(result.notes)}
                    </div>
                  </motion.div>
                )}

                {/* Viva Questions Tab */}
                {activeTab === 'questions' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2 select-none">
                        <AppleEmoji emoji="❓" /> Oral Viva Mock Prep Questions
                      </h3>
                      <p className="text-[10px] font-semibold text-slate-400 mt-1">Be ready for professor interrogations on lab exams.</p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-sage/20 p-6 shadow-sm">
                      {result.questions && result.questions.length > 0 ? (
                        <ul className="space-y-4">
                          {result.questions.map((qItem, idx) => (
                            <motion.li 
                              key={idx}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-start gap-3.5 text-xs text-slate-700 leading-relaxed font-semibold border-b border-slate-50 pb-3 last:border-b-0 last:pb-0"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm select-none">
                                <AppleEmoji emoji="✔️" className="h-2.5 w-2.5" />
                              </span>
                              <span className="flex-1 pt-0.5">{qItem}</span>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs font-semibold text-slate-500 italic">No viva questions available.</p>
                      )}
                    </div>
                  </motion.div>
                )}

              </div>
            </motion.div>
          ) : !loading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 relative z-10"
            >
              {/* Empty Dashboard Card */}
              <div className="rounded-[28px] border border-dashed border-sage/30 bg-white/95 p-8 text-center shadow-sm">
                
                {/* Visual Mascot Container - Lottie Animated Revision Coach */}
                <div className="relative mx-auto mb-4 flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-mint/45 to-palegreen/25 border border-sage/20 shadow-inner overflow-hidden">
                  <div className="relative z-10 h-[240px] w-[240px] flex items-center justify-center overflow-hidden">
                    <DotLottieReact
                      src="https://lottie.host/4bb86121-ce19-4fb0-96e4-796272e4d026/g19fXyIhdG.lottie"
                      loop
                      autoplay
                      className="h-full w-full object-contain"
                      style={{ transform: 'scale(1.6)' }}
                    />
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-900">Your revision schedule is ready to plan</p>
                <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                  Type one or more subjects (comma-separated) in the input box above to generate custom study plans!
                </p>
              </div>
              
              {/* Recommended Subject Combos */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest pl-1 flex items-center gap-2 select-none">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <AppleEmoji emoji="💡" /> Suggested Subject Combinations
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Data Structures, Algorithms', desc: 'Binary Trees, Dynamic Programming, Graphs', icon: '🌳' },
                    { label: 'Operating Systems, Unix', desc: 'Starvation, CPU Scheduling, Virtual Memory', icon: '⏱' },
                    { label: 'DBMS, SQL Queries', desc: 'Normalization, ACID properties, Indexing', icon: '📊' },
                    { label: 'Computer Networks, TCP/IP', desc: 'OSI layers, Routing, Flow control', icon: '🌐' }
                  ].map((combo) => (
                    <motion.button
                      key={combo.label}
                      type="button"
                      onClick={() => setSubjects(combo.label)}
                      whileHover={{ y: -5, scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="bg-white hover:bg-mint/15 border border-sage/15 p-5 rounded-2xl flex flex-col justify-between hover:border-sage shadow-sm transition-all duration-300 cursor-pointer text-left group"
                    >
                      <div>
                        <span className="text-xl block mb-2 select-none">
                          <AppleEmoji emoji={combo.icon} />
                        </span>
                        <h4 className="text-xs font-bold text-slate-950 leading-snug group-hover:text-emerald-950 transition-colors">{combo.label}</h4>
                        <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed font-semibold">{combo.desc}</p>
                      </div>
                      <span className="text-[9px] font-black text-emerald-800 group-hover:text-emerald-950 uppercase mt-4 block tracking-wider transition-colors">Select Combo →</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

      </div>
    </main>
  );
};

export default RevisionPage;
