import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import api from '../api/axios.js';
import AppleEmoji from '../components/AppleEmoji.jsx';

const MathsSolverPage = () => {
  const [problem, setProblem] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Preseeded sample engineering math problems for instant solving
  const samples = [
    {
      label: 'Matrix Inverse 📊',
      problem: 'Find the inverse of the 3x3 matrix A = [[1, 2, 3], [0, 1, 4], [5, 6, 0]]',
      icon: '📊'
    },
    {
      label: 'Integration by Parts 📈',
      problem: 'Evaluate the integral of x * ln(x) dx',
      icon: '📈'
    },
    {
      label: 'Linear Equation 📐',
      problem: 'Solve the equation 2x + 5 = 15',
      icon: '📐'
    }
  ];

  const parseMathsResult = (rawString) => {
    if (!rawString) return null;
    try {
      let cleanStr = rawString.trim();
      if (cleanStr.startsWith('```')) {
        // strip markdown codeblock syntax if present
        cleanStr = cleanStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      }
      return JSON.parse(cleanStr);
    } catch (err) {
      console.error('Failed to parse math solver JSON:', err);
      // Attempt manual extraction in case JSON is slightly malformed
      try {
        const overviewMatch = rawString.match(/"overview"\s*:\s*"(.*?)"/s);
        const finalAnswerMatch = rawString.match(/"finalAnswer"\s*:\s*"(.*?)"/s);
        if (overviewMatch && finalAnswerMatch) {
          return {
            overview: overviewMatch[1],
            steps: [],
            finalAnswer: finalAnswerMatch[1]
          };
        }
      } catch (innerErr) {
        console.error('Manual fallback parsing failed:', innerErr);
      }
      return null;
    }
  };

  const handleSolve = async (e, customProblem) => {
    if (e) e.preventDefault();
    const queryProblem = customProblem || problem;
    if (!queryProblem.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);
    setActiveStepIndex(0);

    try {
      const { data } = await api.post('/ai/maths', { problem: queryProblem });
      const parsed = parseMathsResult(data.raw);
      if (parsed) {
        setResult(parsed);
      } else {
        throw new Error('Malformed solver response format.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to resolve mathematical solver calculation. Please verify your formula syntax or try again.');
    } finally {
      setLoading(false);
    }
  };

  // Re-run MathJax rendering whenever the mathematical result updates in the DOM
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        if (window.MathJax && window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise()
            .catch((err) => console.warn('MathJax typesetting failed:', err));
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [result]);

  return (
    <main className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12 overflow-hidden">
      {/* Background ambient HSL glows */}
      <div className="absolute top-1/4 left-1/10 -z-10 h-72 w-72 rounded-full bg-palegreen/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 -z-10 h-96 w-96 rounded-full bg-mint/15 blur-[120px] pointer-events-none" />

      <div className="rounded-[32px] bg-white/75 backdrop-blur-xl border border-sage/20 p-6 sm:p-10 shadow-[0_20px_50px_rgba(40,65,50,0.04)] relative overflow-hidden">
        {/* Decorative corner glows */}
        <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-palegreen/20 blur-2xl pointer-events-none" />
        <div className="absolute -right-16 -bottom-16 h-36 w-36 rounded-full bg-mint/20 blur-2xl pointer-events-none" />

        {/* Header Block */}
        <div className="mb-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/55 border border-sage/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950 select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Interactive Solver
          </span>
          <h1 className="mt-4 text-3xl font-black text-slate-950 tracking-tight leading-tight">
            AI Maths Solver & Explainer
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed max-w-lg mx-auto">
            Solve complex engineering maths step-by-step. Get visual flowchart paths, LaTeX derivations, and clear logical walkthroughs.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => handleSolve(e)} className="space-y-4 relative z-10">
          <div className="relative">
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Enter your math problem here (e.g. Find inverse of matrix, integrate x*ln(x), solve linear formulas)..."
              rows="3"
              className="w-full rounded-2xl border border-sage/20 bg-white px-5 py-4 text-xs sm:text-sm font-semibold outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all duration-350 shadow-inner resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Quick pre-seeded questions */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mr-1">Examples:</span>
              {samples.map((samp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    setProblem(samp.problem);
                    handleSolve(e, samp.problem);
                  }}
                  className="rounded-full bg-mint/20 hover:bg-mint/45 border border-sage/15 px-3 py-1.5 text-[10px] font-bold text-emerald-950 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  {samp.label}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !problem.trim()}
              className="rounded-2xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-extrabold px-8 py-3.5 shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-1.5 self-end select-none"
            >
              {loading ? (
                <>
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                  Solving Step-by-Step...
                </>
              ) : (
                <>
                  <span>Solve Problem</span>
                  <AppleEmoji emoji="💡" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Handling Card */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-700 relative z-10"
          >
            <AppleEmoji emoji="⚠️" /> {error}
          </motion.div>
        )}

        {/* Loading mascot */}
        {loading && (
          <div className="rounded-[32px] border border-sage/20 bg-white p-12 mt-8 text-center shadow-inner flex flex-col items-center justify-center min-h-[380px]">
            <div className="h-44 w-44 flex items-center justify-center rounded-3xl bg-mint/25 border border-sage/10 p-4 mb-6 relative">
              <DotLottieReact
                src="https://lottie.host/a4399c41-6732-4e0f-a7b2-6a7064003d5c/KqbEwT33U9.lottie"
                loop
                autoplay
                className="h-32 w-32 object-contain"
                style={{ transform: 'scale(1.3)' }}
              />
              <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"
              />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Deriving Calculus & Linear Solutions...</h3>
            <p className="text-[11px] text-slate-500 mt-2 font-semibold max-w-xs leading-relaxed">
              Gemini is computing numerical derivatives and creating workflow nodes. Local solver is active for backup.
            </p>
          </div>
        )}

        {/* Active Result View */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10 space-y-8 relative z-10"
            >
              {/* Problem Overview Card */}
              <div className="rounded-[28px] border border-sage/20 bg-gradient-to-br from-white/95 to-mint/5 p-6 shadow-sm">
                <span className="rounded-full bg-mint/55 border border-sage/10 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-950 shadow-sm flex items-center gap-1 w-fit select-none">
                  <AppleEmoji emoji="📖" /> Problem Overview
                </span>
                <div className="mt-4 text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed math-rendered">
                  {result.overview}
                </div>
              </div>

              {/* Interactive Flowchart Diagram */}
              {result.steps && result.steps.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest pl-1 flex items-center gap-2 select-none">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <AppleEmoji emoji="🗺️" /> Interactive Solving Flowchart
                  </h3>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 py-6 px-4 bg-white/50 backdrop-blur-sm rounded-[24px] border border-sage/15 shadow-sm">
                    {result.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setActiveStepIndex(idx);
                            const element = document.getElementById(`step-${step.stepNumber}`);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }}
                          className={`flex flex-col items-center p-3 rounded-2xl border transition-all min-w-[120px] max-w-[150px] text-center cursor-pointer shadow-sm ${
                            activeStepIndex === idx
                              ? 'bg-emerald-950 text-white border-emerald-950'
                              : 'bg-white hover:bg-mint/15 text-slate-800 border-sage/20'
                          }`}
                        >
                          <span className={`text-[9px] font-black uppercase tracking-wider mb-1 ${
                            activeStepIndex === idx ? 'text-emerald-300' : 'text-slate-400'
                          }`}>
                            Step {step.stepNumber}
                          </span>
                          <span className="text-xs font-black truncate w-full px-1">
                            {step.diagramLabel || step.title}
                          </span>
                        </motion.button>
                        
                        {idx < result.steps.length - 1 && (
                          <svg className="h-5 w-5 text-emerald-700/60 shrink-0 select-none animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step-by-Step Derivation Cards */}
              {result.steps && result.steps.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest pl-1 flex items-center gap-2 select-none">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <AppleEmoji emoji="🧠" /> Procedural Derivation Steps
                  </h3>

                  <div className="space-y-4">
                    {result.steps.map((step, idx) => (
                      <motion.div
                        id={`step-${step.stepNumber}`}
                        key={idx}
                        onClick={() => setActiveStepIndex(idx)}
                        className={`rounded-3xl border p-6 transition-all duration-300 ${
                          activeStepIndex === idx
                            ? 'border-emerald-700/60 bg-gradient-to-br from-white to-mint/10 shadow-[0_12px_30px_rgba(16,185,129,0.06)] scale-[1.01]'
                            : 'border-sage/20 bg-white/70 hover:bg-white shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 select-none ${
                            activeStepIndex === idx
                              ? 'bg-emerald-950 text-emerald-100'
                              : 'bg-slate-100 text-slate-650'
                          }`}>
                            <AppleEmoji emoji="⚡" /> Step {step.stepNumber}
                          </span>
                          <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase select-none">
                            {step.diagramLabel || 'Derivation'}
                          </span>
                        </div>

                        <h4 className="text-sm font-extrabold text-slate-900 mb-2.5">
                          {step.title}
                        </h4>
                        <div className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed whitespace-pre-line math-rendered">
                          {step.explanation}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Final Answer Highlight Box */}
              <div className="rounded-[32px] border-2 border-dashed border-emerald-500/30 bg-gradient-to-br from-mint/20 to-palegreen/10 p-8 text-center relative overflow-hidden shadow-inner">
                {/* Visual sparkles */}
                <div className="absolute top-4 left-4 text-emerald-600 opacity-20"><AppleEmoji emoji="✨" /></div>
                <div className="absolute bottom-4 right-4 text-emerald-600 opacity-20"><AppleEmoji emoji="✨" /></div>

                <span className="mx-auto rounded-full bg-slate-900 border border-slate-800 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-100 shadow-sm flex items-center gap-1 w-fit select-none">
                  <AppleEmoji emoji="🏆" /> Final Mathematical Result
                </span>

                <div className="mt-6 text-base sm:text-lg font-black text-slate-950 tracking-wide math-rendered">
                  {result.finalAnswer}
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty/Dashboard Mascot - Initial Landing View */}
          {!result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 space-y-8 relative z-10"
            >
              <div className="rounded-[28px] border border-dashed border-sage/30 bg-white/95 p-8 text-center shadow-sm">
                {/* Visual Mascot Container */}
                <div className="relative mx-auto mb-4 flex h-60 w-60 items-center justify-center rounded-full bg-gradient-to-br from-mint/45 to-palegreen/25 border border-sage/20 shadow-inner overflow-hidden">
                  <div className="relative z-10 h-[220px] w-[220px] flex items-center justify-center overflow-hidden">
                    <DotLottieReact
                      src="https://lottie.host/76be0db1-eb79-451e-b83c-62cb6e2cf6c6/8e0nO12UqY.lottie"
                      loop
                      autoplay
                      className="h-full w-full object-contain"
                      style={{ transform: 'scale(1.2)' }}
                    />
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-900">Your Math Solver is online and ready</p>
                <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                  Type matrices, differential formulas, integration, or linear algebra equations to see visual derivations!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default MathsSolverPage;
