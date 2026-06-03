import { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import AppleEmoji from '../components/AppleEmoji.jsx';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const subjectData = [
  { name: 'Database Systems (DBMS)', value: 32, color: '#047857' },
  { name: 'Operating Systems (OS)', value: 24, color: '#10B981' },
  { name: 'Computer Networks (CN)', value: 18, color: '#34D399' },
  { name: 'Web Dev (React/Vite)', value: 14, color: '#6EE7B7' },
  { name: 'Engineering Maths', value: 12, color: '#A7F3D0' }
];

const trendData = [
  { name: 'Week 1', Hours: 12, Focus: 68 },
  { name: 'Week 2', Hours: 18, Focus: 75 },
  { name: 'Week 3', Hours: 15, Focus: 72 },
  { name: 'Week 4', Hours: 24, Focus: 84 },
  { name: 'Week 5', Hours: 27, Focus: 90 }
];

const parseInlineMarkdown = (text) => {
  if (!text) return '';
  const normalized = text.replace(/\*\*\*/g, '**');
  const parts = normalized.split(/(\*\*)/g);
  let isBold = false;
  
  return parts.map((part, index) => {
    if (part === '**') {
      isBold = !isBold;
      return null;
    }
    if (isBold) {
      return <strong key={index} className="font-extrabold text-slate-950">{part}</strong>;
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

const actions = [
  { label: 'AI Chat', to: '/ai', desc: 'Ask questions, clarify concepts, and conquer tough subjects.' },
  { label: 'Upload Notes', to: '/pdf', desc: 'Extract instant summaries and viva prep sheets.' },
  { label: 'Generate Quiz', to: '/quiz', desc: 'Auto-generate topic-based practice tests.' },
  { label: 'Planner', to: '/planner', desc: 'Organize your daily study schedule and tasks.' }
];

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [statsData, setStatsData] = useState({
    attendance: '85%',
    notesUploaded: '0',
    quizAccuracy: '0%',
    plannerProgress: '0%',
    studyStreak: '0 days'
  });
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStatsData(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const generateReport = async () => {
    setReportLoading(true);
    setReport('');
    try {
      const summaryText = `Attendance: ${statsData.attendance}, Notes Uploaded: ${statsData.notesUploaded}, Quiz Accuracy: ${statsData.quizAccuracy}, Planner Progress: ${statsData.plannerProgress}, Study Streak: ${statsData.studyStreak}`;
      const { data } = await api.post('/ai/analytics', { summaryData: summaryText });
      setReport(data.raw);
    } catch (err) {
      setReport('Failed to generate diagnostic report. Please try again later.');
    } finally {
      setReportLoading(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;
    
    // Clean up markdown formatting to make the downloaded file look extremely neat in plain text editors
    const cleanText = report
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
    link.download = `EduMind_Academic_Audit_${user?.name?.replace(/\s+/g, '_') || 'Student'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: 'Attendance %', value: statsData.attendance, detail: 'On track for the semester' },
    { label: 'Notes Uploaded', value: statsData.notesUploaded, detail: 'AI summaries ready' },
    { label: 'Quiz Accuracy', value: statsData.quizAccuracy, detail: 'Improving weekly' },
    { label: 'Planner Progress', value: statsData.plannerProgress, detail: 'Tasks completed' },
    { label: 'Study Streak', value: statsData.studyStreak, detail: 'Strong focus habits' }
  ];

  // Helper values parsed into integer scores for graphics
  const attendanceVal = parseInt(statsData.attendance) || 0;
  const quizVal = parseInt(statsData.quizAccuracy) || 0;
  const plannerVal = parseInt(statsData.plannerProgress) || 0;
  const streakVal = parseInt(statsData.studyStreak) || 0;

  // Chart data matching Student values vs target standards
  const chartData = [
    { metric: 'Attendance', Student: attendanceVal, Target: 75 },
    { metric: 'Quiz Accuracy', Student: quizVal, Target: 80 },
    { metric: 'Tasks Done', Student: plannerVal, Target: 100 },
    { metric: 'Streak (x10)', Student: Math.min(streakVal * 10, 100), Target: 70 },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Welcome Banner */}
      <div className="mb-10 rounded-[32px] bg-gradient-to-br from-mint/30 via-surface to-offwhite border border-sage/25 p-8 md:p-10 shadow-soft">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-800 font-extrabold">Welcome back</p>
            <h1 className="mt-3 text-3xl md:text-4.5xl font-black text-slate-950 tracking-tight leading-[1.15]">
              Hey {user?.name.split(' ')[0]}, ready to power your semester?
            </h1>
          </div>
          <div className="space-y-1 rounded-[24px] border border-sage/35 bg-palegreen/80 p-5 shrink-0 shadow-sm animate-pulse">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Next live revision</p>
            <p className="text-base font-extrabold text-slate-950">Today at 5:00 PM</p>
          </div>
        </div>
      </div>

      {/* 3D Stat Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((item, index) => {
          // Check label to draw custom progress components
          const isAttendance = item.label.includes('Attendance');
          const isNotes = item.label.includes('Notes');
          const isAccuracy = item.label.includes('Accuracy');
          const isPlanner = item.label.includes('Planner');
          const isStreak = item.label.includes('Streak');

          return (
            <motion.article 
              key={item.label} 
              className="rounded-[28px] bg-white/80 backdrop-blur-md border border-sage/25 p-6 shadow-soft card-3d cursor-default flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-305"
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.05 * index }}
            >
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-800">{item.label}</h2>
                <p className="mt-4 text-3.5xl font-extrabold text-slate-950 tracking-tight">{item.value}</p>
                
                {isAttendance && (
                  <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: item.value }} />
                  </div>
                )}
                {isAccuracy && (
                  <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: item.value }} />
                  </div>
                )}
                {isPlanner && (
                  <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: item.value }} />
                  </div>
                )}
                {isNotes && (
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-mint/55 px-2 py-0.5 text-[9px] font-black text-emerald-950 border border-sage/10">
                    <AppleEmoji emoji="📝" /> Active Summaries
                  </div>
                )}
                {isStreak && (
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-orange-105 px-2 py-0.5 text-[9px] font-black text-orange-705 border border-orange-200/50">
                    <AppleEmoji emoji="🔥" /> Active Habit
                  </div>
                )}
              </div>
              <p className="mt-3.5 text-xs font-semibold text-slate-500 leading-normal">{item.detail}</p>
            </motion.article>
          );
        })}
      </section>

      {/* Analytics Explainer / Benefit Banner */}
      <div className="mt-12 rounded-[28px] border border-sage/20 bg-palegreen/25 backdrop-blur-md p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-mint/45 blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/80 border border-sage/20 flex items-center justify-center shrink-0 shadow-sm text-2xl">
              <AppleEmoji emoji="💡" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-950 tracking-tight">How to use Analytics & Attendance?</h2>
              <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed max-w-2xl">
                Monitor your active lecture attendance percentages and study habits. Use the interactive visual widgets below to pinpoint performance metrics, balance time allocation, and run AI-generated diagnostic audits.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="rounded-2xl bg-white/70 border border-sage/15 p-3 flex items-center gap-3 shrink-0">
              <div className="text-xl"><AppleEmoji emoji="🎓" /></div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Goal</span>
                <span className="text-[11px] font-black text-emerald-950">Earn Badges</span>
              </div>
            </div>
            <div className="rounded-2xl bg-white/70 border border-sage/15 p-3 flex items-center gap-3 shrink-0">
              <div className="text-xl"><AppleEmoji emoji="🤖" /></div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">AI Audit</span>
                <span className="text-[11px] font-black text-emerald-950">Fix Study Gaps</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports & Graphs Section */}
      <section className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Visual Graph Card */}
        <div className="lg:col-span-7 rounded-[32px] border border-sage/25 bg-surface p-6 sm:p-8 shadow-soft flex flex-col justify-between min-h-[420px]">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-mint/55 px-2.5 py-1 text-[9px] font-black text-emerald-950 border border-sage/10 select-none mb-2.5">
              <AppleEmoji emoji="🎯" /> Semester Target Tracker
            </span>
            <h2 className="text-lg font-extrabold text-slate-950 tracking-tight">Performance Summary</h2>
            <p className="text-xs font-semibold text-slate-600 mt-1.5 leading-relaxed">
              Compares your current academic metrics against semester standards. <strong>Benefit:</strong> Visualizes at a glance if you are meeting target percentages to remain eligible for examinations.
            </p>
          </div>
          
          <div className="mt-6 w-full h-[280px] text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="metric" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#F2F4EF', border: '1px solid #A8C3A0', borderRadius: '16px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="Student" fill="#A8C3A0" radius={[8, 8, 0, 0]} maxBarSize={45} />
                <Bar dataKey="Target" fill="#CFE8D5" radius={[8, 8, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Report Audit Card */}
        <div className="lg:col-span-5 rounded-[32px] border border-sage/25 bg-surface p-6 sm:p-8 shadow-soft flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-mint/55 px-2.5 py-1 text-[9px] font-black text-emerald-950 border border-sage/10 select-none mb-2.5">
                <AppleEmoji emoji="🤖" /> Habits Diagnosis
              </span>
              <h2 className="text-lg font-extrabold text-slate-950 tracking-tight">AI Academic Audit</h2>
              <p className="text-xs font-semibold text-slate-650 mt-1.5 leading-relaxed">
                Analyze your performance using our local expert model. <strong>How to use:</strong> Click "Generate" to synthesize an actionable list of learning adjustments and suggestions.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={generateReport}
                disabled={reportLoading}
                className="flex-1 inline-flex items-center justify-center rounded-full bg-slate-950 hover:bg-slate-800 text-offwhite px-5 py-3.5 text-xs font-black shadow-md transition-all active:scale-97 disabled:opacity-60 gap-1.5 select-none cursor-pointer"
              >
                {reportLoading ? (
                  <>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white mr-1" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white mr-1" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white mr-1.5" style={{ animationDelay: '300ms' }} />
                    Compiling Audit...
                  </>
                ) : (
                  <>
                    <span>{report ? 'Re-generate Audit' : 'Generate Report'}</span>
                    <AppleEmoji emoji="📝" />
                  </>
                )}
              </button>
              
              {report && (
                <button
                  onClick={downloadReport}
                  className="inline-flex items-center justify-center rounded-full bg-palegreen hover:bg-sage text-slate-950 px-5 py-3.5 text-xs font-black shadow-md transition-all active:scale-97 border border-sage/35 gap-1.5 select-none cursor-pointer"
                >
                  <span>Download</span>
                  <AppleEmoji emoji="💾" />
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {report && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="rounded-2xl border border-sage/25 bg-white p-5 text-xs text-slate-700 leading-relaxed font-semibold shadow-inner max-h-[220px] overflow-y-auto scrollbar-thin"
                >
                  <p className="text-[10px] font-black uppercase text-emerald-800 tracking-wider mb-2 flex items-center gap-1 select-none">
                    <AppleEmoji emoji="⭐" /> AI Diagnosis Results:
                  </p>
                  <div className="text-slate-800">{renderMarkdown(report)}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {!report && !reportLoading && (
            <div className="rounded-2xl border border-dashed border-sage/30 p-8 text-center bg-offwhite/50">
              <div className="text-2xl block mb-2 select-none">
                <AppleEmoji emoji="📋" />
              </div>
              <p className="text-xs font-bold text-slate-500">Report details will populate here once generated.</p>
            </div>
          )}
        </div>
      </section>

      {/* New Row: Advanced Analytics Trends & Subject Breakdowns */}
      <section className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Weekly Focus Trends (Line Chart) */}
        <div className="lg:col-span-7 rounded-[32px] border border-sage/25 bg-surface p-6 sm:p-8 shadow-soft flex flex-col justify-between min-h-[420px]">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-mint/55 px-2.5 py-1 text-[9px] font-black text-emerald-950 border border-sage/10 select-none mb-2.5">
              <AppleEmoji emoji="📈" /> Study Focus Index
            </span>
            <h2 className="text-lg font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
              Weekly Progress Trends
            </h2>
            <p className="text-xs font-semibold text-slate-650 mt-1.5 leading-relaxed">
              Correlates weekly focus ratings with total revision hours. <strong>Benefit:</strong> Visualizes if you are burning out or studying at peak cognitive efficiency.
            </p>
          </div>
          
          <div className="mt-6 w-full h-[280px] text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#047857" fontSize={11} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#F2F4EF', border: '1px solid #A8C3A0', borderRadius: '16px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line yAxisId="left" type="monotone" dataKey="Hours" name="Study Hours (Hrs)" stroke="#047857" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="Focus" name="Focus Level (%)" stroke="#10B981" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Concentration (Donut Chart) */}
        <div className="lg:col-span-5 rounded-[32px] border border-sage/25 bg-surface p-6 sm:p-8 shadow-soft flex flex-col justify-between min-h-[420px] relative">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-mint/55 px-2.5 py-1 text-[9px] font-black text-emerald-950 border border-sage/10 select-none mb-2.5">
              <AppleEmoji emoji="📚" /> Time Balance
            </span>
            <h2 className="text-lg font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
              Syllabus Distribution
            </h2>
            <p className="text-xs font-semibold text-slate-650 mt-1.5 leading-relaxed">
              Monitors the allocation of your study time across modules. <strong>Benefit:</strong> Prevents you from focusing too heavily on one class while falling behind in others.
            </p>
          </div>

          <div className="mt-6 w-full h-[200px] flex items-center justify-center relative">
            {/* Absolute Centered Value */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 tracking-tight">96h</span>
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Total Time</span>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#F2F4EF', border: '1px solid #A8C3A0', borderRadius: '16px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Subject Custom Legend List */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-700">
            {subjectData.map((subject, index) => (
              <div key={index} className="flex items-center gap-1.5 truncate">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: subject.color }} />
                <span className="truncate">{subject.name} ({subject.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool Launch Shortcuts */}
      <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => (
          <motion.div 
            key={action.label} 
            className="rounded-[28px] border border-sage/20 bg-surface/75 hover:bg-white p-6 shadow-soft card-3d flex flex-col justify-between min-h-[190px]"
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          >
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">0{index + 1}</span>
              <h3 className="mt-2 text-lg font-extrabold text-slate-950 tracking-tight">{action.label}</h3>
              <p className="mt-2 text-xs text-slate-650 font-semibold leading-relaxed">{action.desc}</p>
            </div>
            <Link 
              to={action.to} 
              className="mt-5 inline-flex items-center justify-center rounded-full bg-palegreen/50 hover:bg-palegreen border border-sage/20 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-sm transition duration-300 hover:scale-102"
            >
              Open Workspace
            </Link>
          </motion.div>
        ))}
      </section>
    </main>
  );
};

export default DashboardPage;
