import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import api from '../api/axios.js';
import AppleEmoji from '../components/AppleEmoji.jsx';

const QuizPage = () => {
    const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  // 10 Premium Pre-configured Engineering Quizzes list
  const preconfiguredQuizzes = [
    { title: "Database Normalization", desc: "1NF, 2NF, 3NF, BCNF & dependencies", category: "DBMS" },
    { title: "CPU Scheduling", desc: "SJF, Round Robin, FCFS & waiting calculations", category: "OS" },
    { title: "TCP/IP vs OSI layers", desc: "Network layer model, PDUs, & TCP handshakes", category: "Networks" },
    { title: "React Hooks & Lifecycle", desc: "useState, useEffect, context, & performance", category: "Frontend" },
    { title: "Operating Systems Deadlocks", desc: "Coffman conditions, Banker's safety checks", category: "OS" },
    { title: "Data Structures (Trees & Graphs)", desc: "BST traversals, AVL balancing, BFS/DFS, Kruskal's", category: "Algorithms" },
    { title: "SQL vs NoSQL Databases", desc: "ACID vs CAP, horizontal scaling, sharding", category: "DBMS" },
    { title: "Computer Networks Routing", desc: "IP subnetting, RIP, OSPF, BGP protocols", category: "Networks" },
    { title: "Object-Oriented Programming (OOP)", desc: "Inheritance, polymorphism, encapsulation, abstraction", category: "Core CS" },
    { title: "Web Security Basics", desc: "XSS, CSRF, HTTPS handshakes, JWT tokens", category: "Security" }
  ];

  const generate = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setQuiz(null);
    setScore(null);
    setAnswers({});
    
    try {
      const { data } = await api.post('/quiz/generate', { topic });
      setQuiz(data.quiz);
    } catch (error) {
      console.error(error);
      alert("Failed to generate quiz. Please try again! 🦉");
    } finally {
      setLoading(false);
    }
  };

  // Quick Action Handler for Preconfigured Topic cards
  const handleQuickQuizSelect = async (selectedTopic) => {
    setTopic(selectedTopic);
    setLoading(true);
    setQuiz(null);
    setScore(null);
    setAnswers({});
    
    try {
      const { data } = await api.post('/quiz/generate', { topic: selectedTopic });
      setQuiz(data.quiz);
    } catch (error) {
      console.error(error);
      alert("Failed to load preseeded quiz. Please try again! 🦉");
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (!quiz) return;
    try {
      const { data } = await api.post('/quiz/submit', { quizId: quiz._id, answers });
      setScore(data.score);
    } catch (err) {
      console.error(err);
      alert("Failed to submit answers. Please try again!");
    }
  };

  const handleOptionSelect = (qQuestion, optionText) => {
    if (score !== null) return; // Prevent selection changes after submission
    setAnswers({ ...answers, [qQuestion]: optionText });
  };

  // Mascot smart speech response block
  const getOwlSpeech = () => {
    if (loading) return `Hoo-hoo! 🦉 Researching syllabus databases for "${topic}"... Generating test sheets!`;
    if (score !== null) {
      const percentage = (score / quiz?.questions.length) * 100;
      if (percentage === 100) return `Astonishing! Perfect score of ${score}/${quiz?.questions.length}! You're an engineering genius! 🏆🥇`;
      if (percentage >= 80) return `Superb job! You scored ${score}/${quiz?.questions.length}! Take a moment to review the errors below. 🌟`;
      if (percentage >= 60) return `Good effort! You scored ${score}/${quiz?.questions.length}. A bit more study, and you will hit 100%! 📚💪`;
      return `Score: ${score}/${quiz?.questions.length}. No worries, failure is the first step to wisdom! Let's revise this in AI Chat. 🧭`;
    }
    if (quiz) return `Your custom quiz on "${quiz.topic}" is calculated! Select answers and click submit when ready. 🎯`;
    return "Hello! I am Professor Owl. Pick one of the 10 quick-start quizzes or search a custom chapter above to start! 🎓";
  };

  // Calculations for active progress bar
  const totalQuestions = quiz ? quiz.questions.length : 0;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // Grade badge calculator
  const getGradeInfo = (correctCount, totalCount) => {
    const pct = totalCount > 0 ? (correctCount / totalCount) * 105 : 0;
    if (correctCount === totalCount) {
      return { title: "GENIUS 🏆", color: "bg-emerald-500 border-emerald-600 text-white", text: "Perfect accuracy! You possess excellent retention of this concept." };
    }
    if (pct >= 80) {
      return { title: "EXCELLENT 🥇", color: "bg-teal-500 border-teal-600 text-white", text: "Great understanding! Just a few details to polish next time." };
    }
    if (pct >= 60) {
      return { title: "PASSED 🌟", color: "bg-amber-500 border-amber-600 text-white", text: "Solid performance, but review incorrect answers to verify edge cases." };
    }
    return { title: "RE-STUDY REQUIRED 📚", color: "bg-rose-500 border-rose-600 text-white", text: "We recommend reviewing the summary PDF and re-taking the quiz." };
  };

  const gradeInfo = score !== null ? getGradeInfo(score, totalQuestions) : null;

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12 overflow-hidden">
      <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-white/70 hover:bg-white border border-sage/20 px-3.5 py-1.5 text-xs font-bold text-slate-800 transition duration-200 shadow-sm hover:shadow hover:scale-102 mb-6 shrink-0 self-start">
        ← Back to Dashboard
      </Link>
      {/* Background decoration glows */}
      <div className="absolute top-1/4 left-1/10 -z-10 h-72 w-72 rounded-full bg-palegreen/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 -z-10 h-96 w-96 rounded-full bg-mint/20 blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
        
        {/* Left Column: Mascot Speech and Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          {/* Owl Mascot Card */}
          <div className="relative overflow-hidden rounded-[32px] border border-sage/20 bg-white/70 backdrop-blur-md p-6 text-center shadow-soft">
            <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-palegreen/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-mint/25 blur-2xl pointer-events-none" />
            
            <span className="inline-flex items-center gap-1 rounded-full bg-mint px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-950 border border-sage/10 relative z-10">
              Quiz Evaluator
            </span>
            
            {/* Mascot Container - Lottie Animated Owl */}
            <div className="relative mx-auto my-5 flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-mint/45 to-palegreen/25 border border-sage/20 shadow-inner overflow-hidden">
              <div className="relative z-10 h-[240px] w-[240px] flex items-center justify-center overflow-hidden">
                <DotLottieReact
                  src="https://lottie.host/f359ad3c-e6e3-4748-9636-0196b47f0fb5/OVjgtjiRfz.lottie"
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
                {getOwlSpeech()}
              </p>
            </div>
          </div>
          
          {/* Instructions Panel */}
          <div className="rounded-[28px] border border-sage/20 bg-white/70 backdrop-blur-md p-6 shadow-soft text-slate-700">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Guidelines
            </h3>
            <ul className="mt-4 space-y-3 text-[11px] font-semibold leading-relaxed text-slate-600">
              <li className="flex items-start gap-2.5">
                <AppleEmoji emoji="⏱" className="mt-0.5 shrink-0" />
                <span>No strict timers: focus on understanding.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AppleEmoji emoji="🔄" className="mt-0.5 shrink-0" />
                <span>Instant reviews showing the correct answer keys.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AppleEmoji emoji="🧠" className="mt-0.5 shrink-0" />
                <span>Preseeded quizzes run locally without Gemini rate limits.</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Right Column: Interactive Quiz Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[32px] bg-white/75 backdrop-blur-xl border border-sage/20 p-6 sm:p-10 shadow-[0_20px_50px_rgba(40,65,50,0.04)]"
        >
          {/* Header */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/55 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-950 border border-sage/10 select-none">
              <AppleEmoji emoji="⚡" /> Evaluator Panel
            </span>
            <h1 className="mt-4 text-3xl font-black text-slate-950 tracking-tight leading-none">
              Premium Practice Quizzes
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2 max-w-lg leading-relaxed">
              Test your engineering retention. Type custom study terms or click one of our preseeded modules.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={generate} className="flex flex-col gap-3 sm:flex-row relative z-10 mb-8">
            <input 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              placeholder="Enter custom topic (e.g. OS Page Replacement, DBMS normal forms)" 
              className="flex-1 rounded-2xl border border-sage/20 bg-white px-5 py-4 text-xs font-semibold outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all duration-350 shadow-inner" 
            />
            <button 
              type="submit" 
              disabled={loading || !topic.trim()} 
              className="rounded-2xl bg-slate-950 hover:bg-slate-900 px-8 py-4 text-xs font-extrabold text-white shadow-md transition hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-1.5 select-none"
            >
              <span>Generate Quiz</span>
              <AppleEmoji emoji="📝" />
            </button>
          </form>

          {/* Loading Mascot view */}
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
              <h3 className="text-sm font-extrabold text-slate-900">Formulating custom MCQ paper...</h3>
              <p className="text-[11px] text-slate-500 mt-2 font-semibold max-w-xs leading-relaxed">
                We are crafting 10 high-quality questions. If API is busy, we will automatically load a local match!
              </p>
            </div>
          )}

          {/* 10 Preseeded Quizzes Grid - displayed when inactive/empty */}
          {!quiz && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest pl-1 flex items-center gap-2 select-none">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <AppleEmoji emoji="📦" /> 10 Premium Preseeded Quizzes
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {preconfiguredQuizzes.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuickQuizSelect(item.title)}
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
                      Start Quiz (10 MCQs) →
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Active Quiz Card Board */}
          <AnimatePresence>
            {quiz && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Active Progress Bar indicator */}
                <div className="rounded-2xl bg-slate-50 border border-sage/15 p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-slate-550">
                    <span>Topic: {quiz.topic}</span>
                    <span>{score === null ? `Progress: ${answeredCount}/${totalQuestions} Answered` : 'Quiz Complete'}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${score !== null ? 'bg-emerald-500' : 'bg-slate-900'}`}
                      style={{ width: `${score !== null ? 100 : progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Score & Evaluation Report Grid */}
                {score !== null && gradeInfo && (
                  <motion.div 
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded-[28px] border border-sage/20 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">Retrospective Summary</span>
                        <h2 className="text-2xl font-black tracking-tight leading-none">Your Evaluation Report</h2>
                        <p className="text-xs text-slate-350 max-w-sm leading-relaxed font-semibold">
                          {gradeInfo.text}
                        </p>
                      </div>

                      <div className="flex gap-4 shrink-0">
                        {/* Score stats pill */}
                        <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-center min-w-[100px]">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                          <span className="block text-3xl font-black text-emerald-300 mt-1">{score} <span className="text-lg text-slate-400 font-semibold">/ {totalQuestions}</span></span>
                        </div>
                        {/* Grade stats pill */}
                        <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-center min-w-[120px]">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Accuracy</span>
                          <span className="block text-3xl font-black text-white mt-1">{Math.round((score / totalQuestions) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Questions sheet */}
                <div className="space-y-5">
                  {quiz.questions.map((item, index) => {
                    const selectedAns = answers[item.question];
                    return (
                      <motion.div 
                        key={item.question} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="rounded-2xl border border-sage/20 bg-white/95 p-5 sm:p-6 shadow-sm"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-950 leading-relaxed">
                            {index + 1}. {item.question}
                          </h3>
                          {score !== null && (
                            selectedAns === item.answer ? (
                              <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-[9px] font-black uppercase">Correct</span>
                            ) : (
                              <span className="rounded-full bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 text-[9px] font-black uppercase">Incorrect</span>
                            )
                          )}
                        </div>
                        
                        {/* Options list */}
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {item.options.map((option) => {
                            const isSelected = selectedAns === option;
                            const isCorrect = item.answer === option;
                            const isSubmitted = score !== null;

                            // Dynamic conditional styling classes
                            let borderClass = "border-sage/15 bg-slate-50 text-slate-700 hover:border-sage/40 hover:bg-mint/10";
                            let checkIcon = null;

                            if (isSubmitted) {
                              if (isCorrect) {
                                borderClass = "border-emerald-500 bg-emerald-50 text-emerald-950 font-extrabold shadow-sm shadow-emerald-100/50";
                                checkIcon = <span className="text-[10px] ml-1 shrink-0 font-extrabold text-emerald-800">✅ Correct Option</span>;
                              } else if (isSelected) {
                                borderClass = "border-rose-400 bg-rose-50 text-rose-950 font-bold";
                                checkIcon = <span className="text-[10px] ml-1 shrink-0 font-bold text-rose-700">❌ Your Pick</span>;
                              } else {
                                borderClass = "border-slate-100 bg-white/40 text-slate-400 cursor-not-allowed";
                              }
                            } else if (isSelected) {
                              borderClass = "border-slate-950 bg-palegreen/50 text-slate-950 font-extrabold shadow-sm";
                            }

                            return (
                              <div 
                                key={option}
                                onClick={() => handleOptionSelect(item.question, option)}
                                className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 text-[11px] font-semibold transition duration-200 ${borderClass} ${isSubmitted ? 'pointer-events-none' : ''}`}
                              >
                                <div className="flex items-center gap-3">
                                  {/* Custom radio circular checker */}
                                  {!isSubmitted && (
                                    <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition ${
                                      isSelected ? 'border-slate-950 bg-slate-950' : 'border-sage/40 bg-white'
                                    }`}>
                                      {isSelected && (
                                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                      )}
                                    </div>
                                  )}
                                  <span className="pr-2">{option}</span>
                                </div>
                                {checkIcon}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Submissions Control row */}
                <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-sage/10 pt-6">
                  {score === null ? (
                    <button 
                      onClick={submitQuiz}
                      disabled={answeredCount < totalQuestions}
                      className="rounded-full bg-slate-950 hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed px-10 py-4 text-xs font-black text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto cursor-pointer"
                    >
                      Submit Answers <AppleEmoji emoji="✔" />
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-between">
                      <p className="text-[11px] font-bold text-slate-500">Practice complete! Choose another chapter to continue reviewing.</p>
                      
                      <button 
                        onClick={() => {
                          setQuiz(null);
                          setScore(null);
                          setAnswers({});
                        }}
                        className="rounded-full border border-sage/40 bg-white hover:bg-mint/20 px-8 py-3.5 text-xs font-extrabold text-slate-800 transition shadow-sm w-full sm:w-auto text-center cursor-pointer"
                      >
                        Try Another Topic <AppleEmoji emoji="🔁" />
                      </button>
                    </div>
                  )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </main>
  );
};

export default QuizPage;
