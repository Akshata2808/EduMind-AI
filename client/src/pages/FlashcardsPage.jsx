import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import api from '../api/axios.js';
import AppleEmoji from '../components/AppleEmoji.jsx';

const FlashcardsPage = () => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(10);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Ready for future custom Lottie URL from user
  const [lottieUrl, setLottieUrl] = useState(''); 

  const generate = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setResult('');
    setActiveIndex(0);
    setFlipped(false);
    try {
      const { data } = await api.post('/ai/flashcards', { topic, count });
      setResult(data.raw);
    } catch (err) {
      setResult('Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper parser converting raw numbered lines (Q: ... - A: ...) into card arrays
  const parseFlashcards = (text) => {
    if (!text) return [];
    const cards = [];
    const lines = text.split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      const match = trimmed.match(/(?:Q|Question):\s*(.*?)\s*-\s*(?:A|Answer):\s*(.*)/i) || 
                    trimmed.match(/^\d+[\.\s]+(?:Q:\s*)?(.*?)\s*-\s*(?:A:\s*)?(.*)/i) ||
                    trimmed.match(/(?:Q:\s*)(.*?)\s*(?:A:\s*)(.*)/i);
      
      if (match) {
        cards.push({
          question: match[1].trim(),
          answer: match[2].trim()
        });
      } else {
        const parts = trimmed.split(/\s*-\s*/);
        if (parts.length >= 2) {
          cards.push({
            question: parts[0].replace(/^\d+[\.\s]*/, '').replace(/^[Qq]:\s*/, '').trim(),
            answer: parts[1].replace(/^[Aa]:\s*/, '').trim()
          });
        }
      }
    });
    return cards;
  };

  const cards = parseFlashcards(result);

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setFlipped(false);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
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
            Retention Tool
          </span>
          <h1 className="mt-4 text-3xl font-black text-slate-950 tracking-tight leading-tight">
            AI Flashcard Generator
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed max-w-lg mx-auto">
            Accelerate your exam revision with customized, high-yield digital study cards generated instantly.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={generate} className="grid gap-3 sm:grid-cols-[1fr_120px_140px] relative z-10">
          <input 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            placeholder="Enter study topic (e.g., CPU Scheduling, Database Normalization)" 
            className="rounded-2xl border border-sage/20 bg-white px-4.5 py-3.5 text-xs font-semibold outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all duration-350 shadow-inner" 
          />
          <div className="relative flex items-center">
            <input 
              type="number" 
              min="1"
              max="25"
              value={count} 
              onChange={(e) => setCount(Number(e.target.value))} 
              className="w-full rounded-2xl border border-sage/20 bg-white px-3 py-3.5 text-xs font-bold outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition text-center" 
            />
            <span className="absolute right-3 text-[9px] font-extrabold text-slate-400 select-none uppercase pointer-events-none">Cards</span>
          </div>
          <button 
            type="submit" 
            disabled={loading || !topic.trim()} 
            className="rounded-2xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-extrabold shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-1.5 select-none"
          >
            {loading ? (
              <>
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                Generating...
              </>
            ) : (
              <>
                <span>Create Deck</span>
                <AppleEmoji emoji="🎴" />
              </>
            )}
          </button>
        </form>

        {/* Interactive 3D Deck */}
        <AnimatePresence mode="wait">
          {cards.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10 flex flex-col items-center relative z-10"
            >
              {/* Progress Count */}
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">
                Card {activeIndex + 1} of {cards.length}
              </p>

              {/* 3D Flip Card */}
              <div className="perspective-1000 w-full max-w-xl h-[280px]">
                <div 
                  onClick={() => setFlipped(!flipped)}
                  className={`relative w-full h-full transition-transform duration-500 preserve-3d cursor-pointer ${flipped ? 'rotate-y-180' : ''}`}
                >
                  {/* Front Card (Question) */}
                  <div className="absolute inset-0 w-full h-full rounded-[32px] border border-sage/20 bg-gradient-to-br from-white/95 via-white/90 to-mint/10 p-8 flex flex-col justify-between shadow-[0_12px_40px_rgba(40,65,50,0.06)] backface-hidden">
                    <span className="self-start rounded-full bg-mint/55 border border-sage/10 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-950 shadow-sm flex items-center gap-1 select-none">
                      <AppleEmoji emoji="❓" /> Question
                    </span>
                    <div className="my-auto text-center px-4">
                      <p className="text-base sm:text-lg font-extrabold text-slate-950 leading-relaxed">
                        {cards[activeIndex].question}
                      </p>
                    </div>
                    <div className="text-[9px] text-center font-extrabold text-slate-400 uppercase tracking-widest animate-pulse flex items-center justify-center gap-1 select-none">
                      <AppleEmoji emoji="👆" /> Click to reveal answer
                    </div>
                  </div>

                  {/* Back Card (Answer) */}
                  <div className="absolute inset-0 w-full h-full rounded-[32px] border border-sage/25 bg-gradient-to-br from-mint/20 via-white/95 to-palegreen/10 p-8 flex flex-col justify-between shadow-[0_12px_40px_rgba(40,65,50,0.06)] backface-hidden rotate-y-180">
                    <span className="self-start rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-100 shadow-sm flex items-center gap-1 select-none">
                      <AppleEmoji emoji="💡" /> Answer Key
                    </span>
                    <div className="my-auto text-center px-4">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
                        {cards[activeIndex].answer}
                      </p>
                    </div>
                    <div className="text-[9px] text-center font-extrabold text-emerald-800 uppercase tracking-widest flex items-center justify-center gap-1 select-none">
                      <AppleEmoji emoji="👆" /> Click to view question
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="mt-8 flex items-center gap-4 select-none">
                <button
                  onClick={handlePrev}
                  className="inline-flex items-center justify-center rounded-full bg-white hover:bg-mint/15 border border-sage/25 px-6 py-3 text-xs font-black text-slate-850 shadow-sm transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
                >
                  <AppleEmoji emoji="◀" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={handleNext}
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 hover:bg-slate-900 border border-slate-950 px-8 py-3 text-xs font-black text-white shadow-md transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next Card</span>
                  <AppleEmoji emoji="▶" />
                </button>
              </div>

            </motion.div>
          ) : result && !loading ? (
            // Fallback pre-formatted display in case AI parsing yields empty card stack
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 rounded-2xl border border-sage/20 p-6 bg-white/90 text-slate-800 text-xs font-semibold leading-relaxed whitespace-pre-line shadow-inner"
            >
              {result}
            </motion.div>
          ) : !result && !loading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 space-y-8 relative z-10"
            >
              {/* Empty Dashboard Card */}
              <div className="rounded-[28px] border border-dashed border-sage/30 bg-white/95 p-8 text-center shadow-sm">
                
                {/* Visual Mascot Container - Lottie Animated Flashcard Coach */}
                <div className="relative mx-auto mb-4 flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-mint/45 to-palegreen/25 border border-sage/20 shadow-inner overflow-hidden">
                  <div className="relative z-10 h-[240px] w-[240px] flex items-center justify-center overflow-hidden">
                    <DotLottieReact
                      src="https://lottie.host/a4399c41-6732-4e0f-a7b2-6a7064003d5c/KqbEwT33U9.lottie"
                      loop
                      autoplay
                      className="h-full w-full object-contain"
                      style={{ transform: 'scale(1.6)' }}
                    />
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-900">Your flashcard deck is ready to build</p>
                <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                  Type any engineering topic or exam concept in the input box above to generate custom study cards!
                </p>
              </div>
              
              {/* Recommended Topics Cards Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest pl-1 flex items-center gap-2 select-none">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <AppleEmoji emoji="💡" /> Popular Topics to Generate
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'REST APIs', desc: 'HTTP methods, status codes, and design rules', icon: '💻' },
                    { label: 'CPU Scheduling', desc: 'FCFS, SJF, Round Robin, and MLFQ algorithms', icon: '⏱' },
                    { label: 'Database Normalization', desc: '1NF, 2NF, 3NF, and BCNF dependencies', icon: '📊' },
                    { label: 'Data Structures', desc: 'Linked Lists, Binary Trees, and Hash Maps', icon: '🌳' }
                  ].map((topicItem) => (
                    <motion.button
                      key={topicItem.label}
                      type="button"
                      onClick={() => setTopic(topicItem.label)}
                      whileHover={{ y: -5, scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="bg-white hover:bg-mint/15 border border-sage/15 p-5 rounded-2xl flex flex-col justify-between hover:border-sage shadow-sm transition-all duration-300 cursor-pointer text-left group"
                    >
                      <div>
                        <span className="text-xl block mb-2 select-none">
                          <AppleEmoji emoji={topicItem.icon} />
                        </span>
                        <h4 className="text-xs font-bold text-slate-950 group-hover:text-emerald-950 transition-colors">{topicItem.label}</h4>
                        <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed font-semibold">{topicItem.desc}</p>
                      </div>
                      <span className="text-[9px] font-black text-emerald-800 group-hover:text-emerald-950 uppercase mt-4 block tracking-wider transition-colors">Select Topic →</span>
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

export default FlashcardsPage;
