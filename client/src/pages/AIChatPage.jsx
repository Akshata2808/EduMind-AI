import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import api from '../api/axios.js';

// Sub-parser for bold (**text**), italics (*text* or _text_), and inline code (`code`)
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
        parts.push(<strong key={keyIndex++} className={`font-extrabold ${isAI ? 'text-slate-950' : 'text-white'}`}>{matchText}</strong>);
      } else if (first.type === 'code') {
        parts.push(<code key={keyIndex++} className={`bg-slate-100/10 border ${isAI ? 'border-slate-200 text-emerald-800 bg-slate-100' : 'border-white/20 text-emerald-300'} rounded px-1.5 py-0.5 font-mono text-[10px] font-bold`}>{matchText}</code>);
      } else if (first.type === 'italic') {
        parts.push(<em key={keyIndex++} className={`italic ${isAI ? 'text-slate-900' : 'text-slate-100'}`}>{matchText}</em>);
      }
      remaining = remaining.substring(closeIndex + first.len);
    }
  }
  return parts;
};

// Line-by-line simple Markdown-to-JSX compiler
const renderMarkdown = (text, isAI = true) => {
  if (!text) return null;
  const textColor = isAI ? 'text-slate-700' : 'text-slate-100';
  const listColor = isAI ? 'text-slate-700' : 'text-slate-200';
  const headerColor = isAI ? 'text-slate-950' : 'text-white';
  const hrColor = isAI ? 'border-sage/20' : 'border-white/10';

  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let cleanLine = line;
    
    if (cleanLine.trim() === '---') {
      return <hr key={idx} className={`my-4 ${hrColor}`} />;
    }
    
    if (cleanLine.startsWith('### ')) {
      return (
        <h3 key={idx} className={`text-xs font-black ${headerColor} tracking-tight mt-4.5 mb-1.5 flex items-center gap-1.5`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isAI ? 'bg-emerald-500' : 'bg-emerald-400'} shrink-0`} />
          {parseInlineStyle(cleanLine.substring(4), isAI)}
        </h3>
      );
    }
    if (cleanLine.startsWith('## ')) {
      return (
        <h2 key={idx} className={`text-sm font-extrabold ${headerColor} tracking-tight mt-5 mb-2 flex items-center gap-1.5`}>
          <span className={`h-2 w-2 rounded-full ${isAI ? 'bg-emerald-500' : 'bg-emerald-400'} shrink-0`} />
          {parseInlineStyle(cleanLine.substring(3), isAI)}
        </h2>
      );
    }
    if (cleanLine.startsWith('# ')) {
      return (
        <h1 key={idx} className={`text-base font-black ${headerColor} tracking-tight mt-5 mb-2`}>
          {parseInlineStyle(cleanLine.substring(2), isAI)}
        </h1>
      );
    }
    
    if (cleanLine.trim().startsWith('* ') || cleanLine.trim().startsWith('- ')) {
      const listContent = cleanLine.trim().substring(2);
      return (
        <li key={idx} className={`ml-4 list-disc pl-0.5 text-xs ${listColor} leading-relaxed font-semibold my-1`}>
          {parseInlineStyle(listContent, isAI)}
        </li>
      );
    }

    const numMatch = cleanLine.trim().match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      return (
        <div key={idx} className={`ml-2 pl-0.5 text-xs ${listColor} leading-relaxed font-semibold my-1 flex gap-2`}>
          <span className={`${isAI ? 'text-emerald-700' : 'text-emerald-400'} font-extrabold shrink-0`}>{numMatch[1]}.</span>
          <span className="flex-1">{parseInlineStyle(numMatch[2], isAI)}</span>
        </div>
      );
    }

    return (
      <p key={idx} className={`text-xs ${textColor} leading-relaxed font-semibold my-1 min-h-[1px]`}>
        {parseInlineStyle(cleanLine, isAI)}
      </p>
    );
  });
};

const AIChatPage = () => {
    const [mode, setMode] = useState('standard');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;
    
    const prompt = message.trim();
    setMessage('');
    setLoading(true);
    
    const nextHistory = [...history, { role: 'user', text: prompt }];
    setHistory(nextHistory);
    
    try {
      const { data } = await api.post('/ai/chat', { message: prompt, mode });
      setHistory((prev) => [
        ...prev, 
        { 
          role: 'assistant', 
          text: data.answer,
          isLocal: data.isLocal,
          source: data.source
        }
      ]);
    } catch (error) {
      setHistory((prev) => [...prev, { role: 'assistant', text: 'Oops! My circuits got a bit tangled. Please try again in a moment! ⚡' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestionText) => {
    setMessage(suggestionText);
  };

  const suggestions = [
    { text: "OS Syllabus", icon: "🎓", prompt: "What is the Mumbai University syllabus for Operating Systems?" },
    { text: "Study Schedule", icon: "📅", prompt: "How do I plan a study schedule for my engineering exams?" },
    { text: "Normalization Help", icon: "💡", prompt: "What is the best way to understand and learn Database Normalization?" },
    { text: "React useEffect", icon: "📝", prompt: "Explain the React useEffect hook in simple terms with an example." }
  ];

  // Dynamic speech bubble text based on chat state
  const getMascotSpeech = () => {
    if (loading) return "Hmm, let me think... 🧠 Processing your request!";
    if (history.length === 0) return "Hi! I'm EduMind Bot. Let's conquer this semester together! Ask me anything. 🚀";
    
    const lastMsg = history[history.length - 1];
    if (lastMsg.role === 'user') return "A great question! Preparing the answer for you... 📝";
    return "There you go! Need me to explain further or have another question? 🌟";
  };

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12 overflow-hidden">
      <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-white/70 hover:bg-white border border-sage/20 px-3.5 py-1.5 text-xs font-bold text-slate-800 transition duration-200 shadow-sm hover:shadow hover:scale-102 mb-6 shrink-0 self-start">
        ← Back to Dashboard
      </Link>

      {/* Immersive Background Glow Elements */}
      <div className="absolute top-1/4 left-1/10 -z-10 h-72 w-72 rounded-full bg-palegreen/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 -z-10 h-96 w-96 rounded-full bg-mint/15 blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        
        {/* Left Column: Mascot Companion Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          {/* Mascot Glass Container */}
          <div className="relative overflow-hidden rounded-[32px] bg-white/70 backdrop-blur-md p-6 text-center border border-sage/20 shadow-soft">
            {/* Background decorative glow */}
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-palegreen/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-mint/30 blur-3xl pointer-events-none" />
            
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/60 border border-sage/30 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.25em] text-emerald-950">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Your Study Copilot
            </span>
            
            {/* Mascot Image Container with Dynamic Animations (Using Lottie files component) */}
            <div className="relative mx-auto my-6 flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-mint/45 via-white/80 to-palegreen/25 border border-sage/20 p-2 shadow-soft">
              <motion.div
                className="h-36 w-36 z-10 flex items-center justify-center"
                animate={loading ? {
                  y: [0, -10, 0],
                  rotate: [0, -2, 2, 0],
                  scale: [1, 1.03, 0.97, 1],
                  transition: {
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                } : {
                  y: [0, -5, 0],
                  transition: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <DotLottieReact
                  src="https://lottie.host/e677b229-0ca6-4f53-af49-2f6d1f722fdb/b8KeLmgx3O.lottie"
                  loop
                  autoplay
                />
              </motion.div>
              
              {/* Thinking dots overlay when loading */}
              {loading && (
                <div className="absolute bottom-3 z-20 flex gap-1.5 rounded-full bg-slate-950 px-3 py-1 shadow-lg border border-slate-800">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-palegreen" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-palegreen" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-palegreen" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>

            {/* Mascot Dynamic Speech Bubble */}
            <div className="relative rounded-2xl border border-sage/15 bg-white/95 p-4 shadow-sm text-left">
              <div className="absolute left-1/2 -top-2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-sage/15 bg-white" />
              <p className="relative z-10 text-xs font-semibold text-slate-800 leading-relaxed">
                {getMascotSpeech()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col rounded-[32px] border border-sage/20 bg-white/80 backdrop-blur-md shadow-soft overflow-hidden h-[700px] lg:h-[760px]"
        >
          {/* Chat Header */}
          <div className="border-b border-sage/15 bg-white/50 px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse border-2 border-white shadow-sm" />
              <div>
                <h1 className="text-xl font-extrabold text-slate-950 tracking-tight">Ask EduMind AI</h1>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Instant explanations, code help, and exam tips</p>
              </div>
            </div>
            
            {/* Evenly proportioned Mode Switcher */}
            <div className="flex rounded-full bg-slate-100 border border-sage/20 p-1 shadow-inner relative w-64 sm:w-72 select-none shrink-0">
              <button 
                onClick={() => setMode('standard')}
                className={`flex-1 text-center rounded-full py-1.5 text-xs font-bold transition duration-300 ${mode === 'standard' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Standard Mode
              </button>
              <button 
                onClick={() => setMode('mumbai')}
                className={`flex-1 text-center rounded-full py-1.5 text-xs font-bold transition duration-300 ${mode === 'mumbai' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Mumbai Syllabus
              </button>
            </div>
          </div>

          {/* Chat History Panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-offwhite/10 scrollbar-thin">
            {history.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                <div className="max-w-md space-y-6">
                  {/* Premium Starter Greeting */}
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-950 tracking-tight">How can I help you today?</h2>
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                      Select one of the queries below to start, or type a custom prompt.
                    </p>
                  </div>

                  {/* Clean Suggestion Pills */}
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(sug.prompt)}
                        className="flex items-center gap-2 rounded-full border border-sage/15 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-mint/25 hover:border-sage transition duration-300 shadow-sm animate-pulse-subtle"
                      >
                        <span>{sug.icon}</span>
                        <span>{sug.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence initial={false}>
                  {history.map((item, index) => {
                    const isAI = item.role === 'assistant';
                    return (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-3 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                      >
                        {/* Avatar */}
                        <div className={`flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full border text-xs font-bold shadow-sm ${
                          isAI 
                            ? 'bg-gradient-to-br from-mint to-palegreen border-sage/35 text-slate-900' 
                            : 'bg-slate-900 border-slate-950 text-white'
                        }`}>
                          {isAI ? '🤖' : '👤'}
                        </div>
                        
                        {/* Bubble */}
                        <div className={`rounded-3xl p-5 border shadow-sm leading-relaxed text-sm ${
                          isAI 
                            ? 'bg-gradient-to-br from-mint/20 via-white to-white border-sage/20 text-slate-800 rounded-tl-none font-medium' 
                            : 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-950 text-white rounded-tr-none font-semibold'
                        }`}>
                          <div className="flex items-center justify-between gap-4 mb-2.5">
                            <p className={`text-[9px] uppercase tracking-widest font-extrabold ${isAI ? 'text-emerald-900 opacity-80' : 'text-emerald-400'}`}>
                              {isAI ? 'EduMind AI Tutor' : 'You'}
                            </p>
                            
                            {/* Local Knowledge Base Badge */}
                            {isAI && item.isLocal && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300/40 px-2 py-0.5 text-[8px] font-black text-emerald-800 uppercase tracking-wider shadow-sm select-none">
                                ⚡ Local Match
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-1">{renderMarkdown(item.text, isAI)}</div>
                          
                          {isAI && item.isLocal && item.source && (
                            <p className="mt-3.5 text-[8.5px] font-bold text-slate-400 border-t border-slate-100 pt-2 text-right select-none">
                              Resolved locally via {item.source}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {/* Thinking message animation */}
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 max-w-[80%] mr-auto"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-gradient-to-br from-mint to-palegreen border-sage/35 text-xs font-bold">
                      🤖
                    </div>
                    <div className="rounded-3xl bg-gradient-to-br from-mint/20 via-white to-white border border-sage/25 p-5 rounded-tl-none shadow-sm">
                      <div className="flex items-center gap-1.5 py-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-sage" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-sage" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-sage" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Form Textarea Controls */}
          <div className="border-t border-sage/15 bg-white/50 p-6">
            <form onSubmit={sendMessage} className="relative flex items-end gap-3 bg-white border border-sage/20 rounded-[24px] p-2 focus-within:border-sage focus-within:ring-2 focus-within:ring-sage/20 transition-all duration-350 shadow-sm">
              <textarea 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows="2" 
                placeholder="Ask your doubts, solve code issues, or plan study targets..." 
                className="flex-1 resize-none bg-transparent px-4 py-2.5 text-xs text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button 
                type="submit" 
                disabled={loading || !message.trim()} 
                className="flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-6 text-xs font-bold text-white transition-all duration-200 hover:bg-slate-950 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 disabled:scale-100 shadow-sm shrink-0"
              >
                {loading ? '...' : 'Send 🚀'}
              </button>
            </form>
            <p className="mt-2.5 text-[10px] text-center text-slate-500 font-semibold">Press Enter to send, Shift+Enter for new line.</p>
          </div>
        </motion.div>

      </div>
    </main>
  );
};

export default AIChatPage;
