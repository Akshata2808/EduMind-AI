import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import api from '../api/axios.js';
import AppleEmoji from '../components/AppleEmoji.jsx';

const PlannerPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'

  const loadTasks = async () => {
    try {
      const { data } = await api.get('/planner');
      setTasks(data.tasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    if (e) e.preventDefault();
    if (!newTask.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/planner', { title: newTask, dueDate });
      setTasks((prev) => [...prev, data.task]);
      setNewTask('');
      setDueDate('');
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (task) => {
    try {
      const { data } = await api.patch(`/planner/${task.id}`, { completed: !task.completed });
      setTasks(data.tasks);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const deleteTask = async (task) => {
    try {
      const { data } = await api.delete(`/planner/${task.id}`);
      setTasks(data.tasks);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // Quick Suggestion Tasks handler
  const addSuggestedTask = async (title) => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    try {
      const { data } = await api.post('/planner', { title, dueDate: today });
      setTasks((prev) => [...prev, data.task]);
    } catch (error) {
      console.error('Failed to add suggested task:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtering Logic
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const totalCount = tasks.length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  // Circular progress calculations
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  // Quick Study milestones matching standard CS/engineering concepts
  const quickSuggestions = [
    { title: 'Revise Database Normalization (1NF, 2NF, 3NF)', tag: 'DBMS' },
    { title: 'Study CPU Scheduling (FIFO vs Round Robin)', tag: 'OS' },
    { title: 'Compare TCP/IP vs OSI layering & handshakes', tag: 'Networks' },
    { title: 'Review React Hooks (useState & useEffect)', tag: 'Frontend' }
  ];

  // Dynamic chatbot coach remarks based on milestones
  const getMascotSpeech = () => {
    if (loading) return "Syncing your academic roadmap... ⚡";
    if (totalCount === 0) return "Your study checklist is clean. Let's schedule some targets for today! 🏆";
    if (pendingCount === 0) return "Brilliant! You've cleared all your planner tasks. Treat yourself! 🌟";
    if (pendingCount <= 2) return `Almost there! Just ${pendingCount} remaining task${pendingCount > 1 ? 's' : ''} to reach 100% completion! 🚀`;
    return `You have ${pendingCount} active goals to tackle. Pick one and conquer it! 🧠`;
  };

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12 overflow-hidden">
      {/* Dynamic ambient backgrounds */}
      <div className="absolute top-1/4 left-1/10 -z-10 h-72 w-72 rounded-full bg-palegreen/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 -z-10 h-96 w-96 rounded-full bg-mint/20 blur-[120px] pointer-events-none" />

      {/* Main Header badge block */}
      <div className="mb-10 text-center relative z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/55 border border-sage/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-950 shadow-sm select-none">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Premium Workspace
        </span>
        <h1 className="mt-4 text-3xl sm:text-4.5xl font-black text-slate-950 tracking-tight leading-none">
          Study Planner & Schedule
        </h1>
        <p className="mt-2.5 text-xs sm:text-sm font-semibold text-slate-500 max-w-xl mx-auto leading-relaxed">
          Plan daily lecture objectives, map out syllabus milestones, and measure your academic retention progress in real-time.
        </p>
      </div>

      {/* Visual Instruction Pipeline Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ scale: 1.03, y: -2 }}
          className="rounded-[20px] border border-sage/25 bg-palegreen/30 backdrop-blur-md px-5 py-4 shadow-sm hover:shadow-[0_8px_30px_rgba(35,56,42,0.06)] hover:bg-palegreen/45 hover:border-emerald-500/20 transition-all duration-300 flex items-center gap-3.5 cursor-pointer"
        >
          <div className="h-9 w-9 rounded-xl bg-white/60 border border-sage/15 flex items-center justify-center shrink-0 shadow-inner">
            <AppleEmoji emoji="🎯" />
          </div>
          <div>
            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block leading-none">Step 01</span>
            <h3 className="text-xs font-black text-slate-900 tracking-wide mt-1">Schedule Milestones</h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.03, y: -2 }}
          className="rounded-[20px] border border-sage/25 bg-palegreen/30 backdrop-blur-md px-5 py-4 shadow-sm hover:shadow-[0_8px_30px_rgba(35,56,42,0.06)] hover:bg-palegreen/45 hover:border-emerald-500/20 transition-all duration-300 flex items-center gap-3.5 cursor-pointer"
        >
          <div className="h-9 w-9 rounded-xl bg-white/60 border border-sage/15 flex items-center justify-center shrink-0 shadow-inner">
            <AppleEmoji emoji="⚡" />
          </div>
          <div>
            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block leading-none">Step 02</span>
            <h3 className="text-xs font-black text-slate-900 tracking-wide mt-1">Track Analytics</h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.03, y: -2 }}
          className="rounded-[20px] border border-sage/25 bg-palegreen/30 backdrop-blur-md px-5 py-4 shadow-sm hover:shadow-[0_8px_30px_rgba(35,56,42,0.06)] hover:bg-palegreen/45 hover:border-emerald-500/20 transition-all duration-300 flex items-center gap-3.5 cursor-pointer"
        >
          <div className="h-9 w-9 rounded-xl bg-white/60 border border-sage/15 flex items-center justify-center shrink-0 shadow-inner">
            <AppleEmoji emoji="🤖" />
          </div>
          <div>
            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block leading-none">Step 03</span>
            <h3 className="text-xs font-black text-slate-900 tracking-wide mt-1">AI Recommendations</h3>
          </div>
        </motion.div>
      </div>

      {/* Two-Column Premium Workspace Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.55fr_1fr] relative z-10">
        
        {/* Left Side: Tasks & Scheduler Form */}
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white/75 backdrop-blur-xl border border-sage/20 p-6 sm:p-8 shadow-[0_20px_50px_rgba(40,65,50,0.04)] relative">
            <div className="flex flex-col gap-1.5 mb-6">
              <h2 className="text-base font-extrabold text-slate-950 tracking-tight flex items-center gap-2 select-none">
                <AppleEmoji emoji="📅" /> Add Target Milestone
              </h2>
              <p className="text-[10px] font-semibold text-slate-400 pl-8 leading-normal">
                Define the chapters, topics, or practical exams you want to study. Setting a target date adds them to your active checklist.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={addTask} className="grid gap-3 sm:grid-cols-[1.6fr_1fr_auto] mb-8">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New study task (e.g. review normal forms)"
                className="rounded-2xl border border-sage/20 bg-white px-4 py-3.5 text-xs font-semibold outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all duration-350 shadow-inner"
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded-2xl border border-sage/20 bg-white px-4 py-3.5 text-xs font-semibold outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition shadow-inner"
              />
              <button
                type="submit"
                disabled={loading || !newTask.trim()}
                className="rounded-2xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-extrabold shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 px-6 py-3.5"
              >
                {loading ? (
                  <span>Adding...</span>
                ) : (
                  <div className="flex items-center justify-center gap-1 select-none">
                    <span>Add Task</span>
                    <AppleEmoji emoji="✍️" />
                  </div>
                )}
              </button>
            </form>

            <div className="border-t border-sage/10 pt-6">
              {/* Filters Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-extrabold text-slate-950 tracking-tight">Active Checklist</h3>
                  <p className="text-[10px] font-semibold text-slate-400 leading-normal">
                    Toggle items to complete them, or delete them to prune your syllabus schedule.
                  </p>
                </div>
                
                {/* Filter Pill Tabs */}
                <div className="flex rounded-full bg-slate-100 border border-sage/15 p-1 shadow-inner self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className={`rounded-full px-4 py-1.5 text-[10px] font-extrabold transition-all duration-200 ${
                      filter === 'all'
                        ? 'bg-white text-emerald-950 shadow-sm'
                        : 'text-slate-505 hover:text-emerald-950'
                    }`}
                  >
                    All ({totalCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('pending')}
                    className={`rounded-full px-4 py-1.5 text-[10px] font-extrabold transition-all duration-200 ${
                      filter === 'pending'
                        ? 'bg-white text-emerald-950 shadow-sm'
                        : 'text-slate-505 hover:text-emerald-950'
                    }`}
                  >
                    Pending ({pendingCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('completed')}
                    className={`rounded-full px-4 py-1.5 text-[10px] font-extrabold transition-all duration-200 ${
                      filter === 'completed'
                        ? 'bg-white text-emerald-950 shadow-sm'
                        : 'text-slate-505 hover:text-emerald-950'
                    }`}
                  >
                    Done ({completedCount})
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3.5">
                <AnimatePresence initial={false}>
                  {filteredTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
                      layout
                      className={`flex flex-col gap-3 rounded-2xl border p-4.5 transition-all duration-300 hover:scale-[1.01] ${
                        task.completed
                          ? 'bg-white/50 backdrop-blur-md border-sage/10 opacity-75 shadow-sm'
                          : 'bg-white border-sage/15 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-emerald-500/30'
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          {/* Toggle Checkmark button */}
                          <button
                            type="button"
                            onClick={() => toggleTask(task)}
                            className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
                              task.completed
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                                : 'border-slate-200 hover:border-emerald-500/60 bg-white hover:scale-105 active:scale-95'
                            }`}
                          >
                            {task.completed && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </motion.svg>
                            )}
                          </button>
                          
                          <span className={`text-xs sm:text-sm font-semibold transition-all duration-300 ${
                            task.completed ? 'text-slate-450 line-through' : 'text-slate-900'
                          }`}>
                            {task.title}
                          </span>
                        </div>

                        {/* Badges & Actions */}
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-extrabold border ${
                            task.completed
                              ? 'bg-slate-50 border-slate-200 text-slate-400'
                              : 'bg-mint/45 border-sage/30 text-emerald-950 shadow-sm'
                          }`}>
                            <AppleEmoji emoji="📅" /> {task.dueDate || 'Unscheduled'}
                          </span>
                          
                          <button
                            onClick={() => deleteTask(task)}
                            className="rounded-full bg-rose-50 border border-rose-200/55 hover:bg-rose-100/90 hover:border-rose-300 px-3.5 py-1.5 text-[9px] font-black text-rose-600 transition-all duration-200 active:scale-95"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredTasks.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border border-dashed border-sage/30 bg-white/50 p-10 text-center"
                  >
                    <div className="text-2xl block mb-2 select-none">
                      <AppleEmoji emoji="✨" />
                    </div>
                    <p className="text-xs font-bold text-slate-500">No tasks in this category.</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Analytics, Lottie Robot, Quick Suggestions */}
        <div className="space-y-6">
          
          {/* Dashboard Summary Card */}
          <div className="rounded-[32px] bg-white/75 backdrop-blur-xl border border-sage/20 p-6 sm:p-8 shadow-[0_20px_50px_rgba(40,65,50,0.04)] relative overflow-hidden">
            {/* Inner background ambient light */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-palegreen/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-mint/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/45 border border-sage/20 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-950 select-none">
                <AppleEmoji emoji="⚡" /> Realtime Analytics
              </span>
              <p className="text-[10px] font-bold text-slate-500 mt-2 tracking-wide leading-normal">
                Calculates your completed-to-scheduled study ratio automatically.
              </p>

              {/* Circular Radial Completion Ring */}
              <div className="relative my-6 flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r={radius}
                    className="stroke-slate-100"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r={radius}
                    className="stroke-emerald-500 transition-all duration-500 ease-out"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))' }}
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-slate-900">{completionPercentage}%</span>
                  <span className="block text-[8px] uppercase tracking-widest text-slate-400 font-black">Tasks Done</span>
                </div>
              </div>

              {/* Progress Detail */}
              <p className="text-xs text-slate-600 font-semibold leading-relaxed max-w-xs">
                You have completed <strong className="text-emerald-600 font-extrabold">{completedCount}</strong> out of <strong className="text-slate-900 font-extrabold">{totalCount}</strong> scheduled syllabus goals.
              </p>

              {/* Gamified Study Badges Roadmap */}
              <div className="mt-6 w-full border-t border-sage/10 pt-5 text-left">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3 select-none">
                  🎓 Earnable Study Badges
                </h4>
                
                <div className="grid gap-3">
                  {/* Badge 1 */}
                  <div className={`flex items-center gap-3.5 p-3 rounded-2xl border transition duration-300 ${
                    completedCount >= 1 
                      ? 'bg-mint/35 border-sage/25 text-emerald-950 shadow-sm'
                      : 'bg-slate-50 border-slate-100 text-slate-405'
                  }`}>
                    <div className="text-2xl select-none">
                      <AppleEmoji emoji="🥉" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[11px] font-black">Level 1: Daily Starter</h5>
                        <span className="text-[9px] font-black uppercase">
                          {completedCount >= 1 ? '🎉 Unlocked' : 'Locked'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium leading-normal mt-0.5">
                        Earned by completing 1 target milestone today.
                      </p>
                    </div>
                  </div>

                  {/* Badge 2 */}
                  <div className={`flex items-center gap-3.5 p-3 rounded-2xl border transition duration-300 ${
                    completedCount >= 3 
                      ? 'bg-mint/35 border-sage/25 text-emerald-950 shadow-sm'
                      : 'bg-slate-50 border-slate-100 text-slate-405'
                  }`}>
                    <div className="text-2xl select-none">
                      <AppleEmoji emoji="🥈" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[11px] font-black">Level 2: Revision Champ</h5>
                        <span className="text-[9px] font-black uppercase">
                          {completedCount >= 3 ? '🎉 Unlocked' : `${completedCount}/3 Completed`}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium leading-normal mt-0.5">
                        Earned by completing 3 milestones. Shows solid syllabus progress.
                      </p>
                    </div>
                  </div>

                  {/* Badge 3 */}
                  <div className={`flex items-center gap-3.5 p-3 rounded-2xl border transition duration-300 ${
                    completedCount >= 5 
                      ? 'bg-mint/35 border-sage/25 text-emerald-950 shadow-sm'
                      : 'bg-slate-50 border-slate-100 text-slate-405'
                  }`}>
                    <div className="text-2xl select-none">
                      <AppleEmoji emoji="🥇" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[11px] font-black">Level 3: Exam Crusher</h5>
                        <span className="text-[9px] font-black uppercase">
                          {completedCount >= 5 ? '🎉 Unlocked' : `${completedCount}/5 Completed`}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium leading-normal mt-0.5">
                        Earned by completing 5 milestones. Ready to conquer your university exam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coach Chatbot Card with mascot robot Lottie */}
          <div className="rounded-[32px] bg-white/70 backdrop-blur-md border border-sage/20 p-6 shadow-soft relative overflow-hidden">
            <div className="flex gap-4.5 items-center">
              {/* Small Mascot Lottie wrapper */}
              <div className="h-20 w-20 shrink-0 bg-gradient-to-br from-mint/55 to-palegreen/25 border border-sage/20 rounded-2xl flex items-center justify-center p-1.5 shadow-inner">
                <DotLottieReact
                  src="https://lottie.host/e677b229-0ca6-4f53-af49-2f6d1f722fdb/b8KeLmgx3O.lottie"
                  loop
                  autoplay
                  className="h-16 w-16"
                />
              </div>

              <div className="flex-1">
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-widest pl-1">Planner Companion</h4>
                <p className="text-[9px] font-bold text-emerald-800/80 mb-2 pl-1 leading-normal">
                  Your AI assistant suggesting dynamic goals based on checklist status.
                </p>
                <div className="mt-1.5 rounded-2xl bg-mint/35 border border-sage/25 p-3.5 text-[11px] font-semibold text-emerald-950 leading-relaxed shadow-sm relative">
                  <div className="absolute -left-2 top-4 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-mint/35 border-b-[8px] border-b-transparent" />
                  <AppleEmoji emoji={getMascotSpeech()} />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Suggestions milestone quick action card */}
          <div className="rounded-[32px] bg-white/70 backdrop-blur-md border border-sage/20 p-6 shadow-soft">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest pl-1 flex items-center gap-2 select-none">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <AppleEmoji emoji="💡" /> Recommended Objectives
            </h3>
            <p className="text-[9px] font-semibold text-slate-500 pl-1 mb-4 leading-normal">
              High-yield core subjects. Click "+ Add" to dynamically schedule them into your checklist.
            </p>
            
            <div className="space-y-3">
              {quickSuggestions.map((sug, index) => (
                <button
                  key={index}
                  onClick={() => addSuggestedTask(sug.title)}
                  className="w-full bg-white hover:bg-mint/15 border border-sage/10 p-3.5 rounded-2xl flex items-center justify-between transition-all duration-300 hover:border-sage text-left hover:-translate-y-0.5 active:translate-y-0 group"
                >
                  <div className="pr-3">
                    <span className="inline-flex rounded-full bg-mint/55 text-emerald-950 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider mb-1.5 border border-sage/10">
                      {sug.tag}
                    </span>
                    <h4 className="text-[11px] font-bold text-slate-900 leading-snug group-hover:text-emerald-950 transition-colors">
                      {sug.title}
                    </h4>
                  </div>
                  <span className="text-xs shrink-0 select-none text-slate-400 group-hover:text-emerald-800 font-extrabold transition-colors flex items-center gap-1">
                    <AppleEmoji emoji="➕" /> Add
                  </span>
                </button>
              ))}
            </div>

            <div className="border-t border-sage/15 mt-5 pt-4 flex justify-between items-center text-[10px] font-bold text-slate-500">
              <span>Looking for deep-dive?</span>
              <Link to="/ai" className="text-emerald-800 hover:text-emerald-950 font-black uppercase tracking-wider flex items-center gap-1.5">
                Open Chat Bot <AppleEmoji emoji="➡️" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
};

export default PlannerPage;
