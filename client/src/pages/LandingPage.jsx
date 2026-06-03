import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext.jsx';
import ForumSection from '../components/ForumSection.jsx';
import ChatFloatingButton from '../components/ChatFloatingButton.jsx';
import UnlockModal from '../components/UnlockModal.jsx';
import Testimonials from '../components/ui/demo.jsx';
import Footer from '../components/Footer.jsx';
import logo from '../assets/logo.png';
import { LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const features = [
  { title: 'AI Study Chat', description: 'Ask questions, clarify complex concepts, and chat with your smart companion.', to: '/ai', slug: 'ai' },
  { title: 'Revision Coach', description: 'Build smart, tailored study schedules and track subject objectives.', to: '/revision', slug: 'revision' },
  { title: 'Roadmap Generator', description: 'Create dynamic step-by-step learning tracks for exams or career paths.', to: '/roadmap', slug: 'roadmap' },
  { title: 'Flashcards Maker', description: 'Review key terms and test your retention with custom flashcard decks.', to: '/flashcards', slug: 'flashcards' },
  { title: 'PDF Summarizer', description: 'Upload syllabus or note sheets to extract instant summaries.', to: '/pdf', slug: 'pdf' },
  { title: 'Practice Quizzes', description: 'Generate auto-graded mock tests from your text to check performance.', to: '/quiz', slug: 'quiz' },
  { title: 'Study Planner', description: 'Schedule detailed daily blocks and manage tasks smoothly.', to: '/planner', slug: 'planner' },
  { title: 'Maths Solver', description: 'Solve engineering mathematics step-by-step with formulas and flowcharts.', to: '/maths', slug: 'maths' }
];

const faqs = [
  { q: 'Can I use the app for free?', a: 'Yes! We offer a free guest trial with AI Chat and Revision Coach unlocked instantly. To access the other 8+ features, simply register a free account.' },
  { q: 'What is the AI Chat based on?', a: 'It utilizes custom engineering-tuned learning models designed to break down technical topics and create structured study materials.' },
  { q: 'Can I upload files to summarize?', a: 'Absolutely. Upload notes, PDFs, or slides to extract summaries, key formulae, and draft mock viva questions.' }
];

// Entry Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const cardEntryVariant = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 90, damping: 14 }
  }
};

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const startTrial = () => {
    const trial = { features: ['ai', 'revision'], startedAt: Date.now() };
    localStorage.setItem('edumind_trial', JSON.stringify(trial));
    navigate('/ai');
  };

  const handleCardClick = (feature) => {
    const isUnlocked = user || feature.slug === 'ai' || feature.slug === 'revision';
    if (isUnlocked) {
      navigate(feature.to);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Hero Section */}
      <section className="overflow-hidden rounded-[40px] bg-gradient-to-br from-mint/45 via-surface to-offwhite p-8 shadow-[0_40px_100px_rgba(35,56,42,0.06)] border border-sage/20">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <motion.div
              className="inline-flex items-center gap-3 rounded-full border border-sage/35 bg-white/95 px-4 py-2 text-xs font-semibold text-emerald-900 shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120 }}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Free Trial Activated — 2 Core Features Open Instantly</span>
            </motion.div>
            
            <motion.h1
              className="max-w-3xl text-4xl font-extrabold leading-tight text-slate-950 md:text-5.5xl tracking-tight"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 70, delay: 0.1 }}
            >
              Your AI Engineering Study Co-Pilot.
            </motion.h1>
            
            <motion.p
              className="max-w-xl text-xs sm:text-sm leading-relaxed text-slate-600 font-semibold"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 70, delay: 0.2 }}
            >
              Master your syllabus modules, generate instant revision cards, and track your exam milestones in one premium interactive workspace.
            </motion.p>
            
            <motion.div 
              className="flex flex-col gap-4 sm:flex-row pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <button
                onClick={startTrial}
                className="inline-flex items-center justify-center rounded-full bg-palegreen px-8 py-3.5 text-sm font-bold text-slate-950 border border-sage/30 shadow-lg transition duration-300 hover:bg-sage hover:scale-103"
              >
                Try For Free Now
              </button>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-sage/35 bg-offwhite px-8 py-3.5 text-sm font-semibold text-slate-800 transition duration-300 hover:bg-mint/35 hover:scale-103 shadow-sm"
              >
                Explore 10+ Features
              </a>
            </motion.div>
          </div>

          {/* Enthusiastic Student Pic studying with AI */}
          <motion.div 
            className="relative animate-float-3d"
            initial={{ opacity: 0, scale: 0.93, rotate: 1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 50, delay: 0.2 }}
          >
            <div className="absolute inset-0 -z-10 rounded-[36px] bg-gradient-to-br from-emerald-200/50 via-surface to-slate-200/50 blur-3xl" />
            <div className="relative overflow-hidden rounded-[36px] border border-sage/20 bg-surface shadow-2xl transition duration-300 hover:scale-101 flex items-center justify-center p-6 bg-mint/5 min-h-[430px]">
              <dotlottie-player
                src="https://lottie.host/6e87ceba-8c0e-47ec-8228-1e367abf6665/T4N9VfWAfr.lottie"
                background="transparent"
                speed="1"
                style={{ width: '100%', height: '380px' }}
                loop
                autoplay
              ></dotlottie-player>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="mt-28 space-y-12">
        <motion.div 
          className="flex flex-wrap items-center justify-between gap-6 rounded-[32px] bg-gradient-to-r from-palegreen/95 via-palegreen to-sage/45 border border-sage/65 p-8 text-slate-950 shadow-soft"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-emerald-950 font-bold">Featured Toolkit</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Tap into powerful learning workflows</h2>
          </div>
          <div className="rounded-full bg-mint/85 border border-sage/30 px-5 py-3 text-sm text-emerald-950 font-bold shadow-sm">
            Click any card to launch the workspace instantly.
          </div>
        </motion.div>

        {/* Feature Cards with Staggered Entrance Animations & Off-White Green BG */}
        <motion.div 
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-150px' }}
        >
          {features.map((f, index) => {
            const isUnlocked = user || f.slug === 'ai' || f.slug === 'revision';
            return (
              <motion.div
                key={f.title}
                variants={cardEntryVariant}
                onClick={() => handleCardClick(f)}
                whileHover={{ 
                  scale: 1.04, 
                  rotate: index % 2 === 0 ? 0.5 : -0.5, 
                  y: -6
                }}
                className={`group cursor-pointer overflow-hidden rounded-3xl border border-sage/25 bg-surface/90 hover:bg-white p-6 shadow-soft card-3d`}
              >
                <div className="flex items-center justify-between">
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/80 px-2.5 py-1 text-xs font-semibold text-emerald-950 border border-sage/20">
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-offwhite px-2.5 py-1 text-xs font-semibold text-slate-500 border border-sage/20">
                      <LockClosedIcon className="h-3.5 w-3.5" />
                      <span>Register to Unlock</span>
                    </span>
                  )}
                  
                  <span className="text-xs font-bold text-slate-450 uppercase tracking-widest group-hover:text-emerald-800 transition duration-300">
                    Tool {index + 1}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition duration-300">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 font-medium">
                  {f.description}
                </p>
                
                <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 opacity-80 group-hover:opacity-100 transition duration-300">
                  <span>Open {f.title}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Student Forum Section (On Scroll) */}
      <ForumSection />

      {/* Ratings & Feedback Section (On Scroll) */}
      <Testimonials />

      {/* FAQs and Pitch */}
      <section className="mt-28 grid gap-12 lg:grid-cols-[1fr_0.9fr]">
        <motion.div 
          className="space-y-6 rounded-[40px] border border-emerald-100/30 bg-surface/50 p-8 md:p-10 shadow-soft flex flex-col justify-center"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ type: 'spring', stiffness: 80 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 w-fit">
            Why EduMind?
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            A serene approach to student productivity
          </h2>
          <p className="text-slate-600 leading-relaxed font-medium">
            Unlike noisy, cluttered learning platforms, EduMind AI focuses on minimalist layouts, gentle colors, and targeted helper utilities. Engineering subjects can be stressful — your workspace doesn't have to be.
          </p>
        </motion.div>
        
        <motion.div 
          className="rounded-[40px] border border-emerald-100/30 bg-surface/40 p-8 md:p-10 shadow-soft"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ type: 'spring', stiffness: 80 }}
        >
          <h3 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h3>
          <div className="mt-6 space-y-4">
            {faqs.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-sage/15 bg-surface/90 p-5 shadow-soft transition duration-300 hover:border-emerald-250">
                <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-950 focus:outline-none text-sm">
                  <span>{item.q}</span>
                  <span className="ml-1 text-emerald-600 transition group-open:rotate-180">+</span>
                </summary>
                <p className="mt-3 text-xs leading-relaxed text-slate-600 font-medium border-t border-slate-100/50 pt-3">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Unlock Registration Trigger Modal */}
      <UnlockModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Floating Chat Button */}
      <ChatFloatingButton />

      {/* Scroll to Top Button in Pale Green */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white border border-sage text-emerald-800 hover:bg-mint/45 shadow-lg transition hover:scale-105 active:scale-95 focus:outline-none"
          aria-label="Scroll to top"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
        </button>
      )}

      {/* Clean Modern Footer */}
      <Footer />
    </main>
  );
};

export default LandingPage;
