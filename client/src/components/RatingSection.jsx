import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const initialReviews = [
  { 
    id: 1, 
    name: 'Arifa Shah', 
    major: 'IT Student', 
    type: 'student',
    rating: 5, 
    quote: 'Yes the experience was great. Classes are pretty good with very good instructions. The coordinator Rose Mary is awesome and follows up to see how we are doing and if there are any issues.', 
    avatar: 'AS'
  },
  { 
    id: 2, 
    name: 'Zara Head Milan', 
    major: 'IT Student', 
    type: 'student',
    rating: 5, 
    quote: 'Quickly maximize visionary solutions after mission critical action item productivity premium portals for impactful e-services inactively negotiate enabled niche markets via growth strategies.', 
    avatar: 'ZH'
  },
  { 
    id: 3, 
    name: 'ALEX', 
    major: 'IT Student', 
    type: 'student',
    rating: 5, 
    quote: 'Eduminds Learning exceed my expectations. Support was stellar-swift and helpful. Instructors are experts genuinely care. Program content is well-organized practical. Worth every penny for a hassle-free learning experience.', 
    avatar: 'AX'
  },
  { 
    id: 4, 
    name: 'Prof. Sneha', 
    major: 'Applied Mathematics Expert', 
    type: 'expert',
    rating: 5, 
    quote: "EduMind's AI coaching tools are revolutionary for classroom integration. The auto-generated study planners and practice quizzes help my students stay highly engaged and track their progress in real-time.", 
    avatar: 'PS'
  },
  { 
    id: 5, 
    name: 'Dr. Amit Roy', 
    major: 'EE Department HOD & Expert Advisor', 
    type: 'expert',
    rating: 5, 
    quote: "As an educator, seeing students actively debug schemas and share derivations in the Community Space is incredibly rewarding. EduMind bridges the gap between structured curriculum and active learning.", 
    avatar: 'AR'
  },
  { 
    id: 6, 
    name: 'Rose Mary', 
    major: 'Academic Student Advisor', 
    type: 'expert',
    rating: 5, 
    quote: "The combination of the PDF summarizer and attendance prediction analytics provides students with clear feedback to organize their semester. It's a game-changer for student support services.", 
    avatar: 'RM'
  }
];

const RatingSection = () => {
  const scrollRef = useRef(null);
  const [filter, setFilter] = useState('all');

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.6; // Scroll 60% of container width
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const filteredReviews = filter === 'all' 
    ? initialReviews 
    : initialReviews.filter(r => r.type === filter);

  return (
    <section className="relative mt-20 space-y-6">
      {/* Decorative background gradients */}
      <div className="absolute -left-20 top-10 h-40 w-40 rounded-full bg-palegreen/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 bottom-10 h-40 w-40 rounded-full bg-mint/15 blur-3xl pointer-events-none" />

      {/* Decorative Wavy Lines on the Left */}
      <svg className="absolute -left-6 top-16 h-28 w-8 text-sage/35 pointer-events-none hidden lg:block" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 30 100">
        <path d="M5 0 Q 15 10, 5 20 T 5 40 T 5 60 T 5 80 T 5 100" />
        <path d="M12 0 Q 22 10, 12 20 T 12 40 T 12 60 T 12 80 T 12 100" />
        <path d="M19 0 Q 29 10, 19 20 T 19 40 T 19 60 T 19 80 T 19 100" />
      </svg>

      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10 max-w-7xl mx-auto px-4">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-800">
            <svg className="w-4.5 h-4.5 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            TESTIMONIALS & FEEDBACK
          </span>
          <h2 className="text-2xl md:text-3.5xl font-black tracking-tight text-slate-950 font-heading">
            What Students & Experts Say!
          </h2>
        </div>

        {/* Arrow controls at top-right */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button 
            onClick={() => scroll('left')}
            aria-label="Scroll Left"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-sage/25 text-slate-800 hover:bg-mint/45 shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none"
          >
            <ChevronLeftIcon className="h-5 w-5 text-emerald-700" />
          </button>
          <button 
            onClick={() => scroll('right')}
            aria-label="Scroll Right"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-sage/25 text-slate-800 hover:bg-mint/45 shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none"
          >
            <ChevronRightIcon className="h-5 w-5 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 relative z-10 max-w-7xl mx-auto px-4 mt-2">
        {[
          { label: 'All Feedbacks 💬', value: 'all' },
          { label: 'Student Reviews 🎓', value: 'student' },
          { label: 'Educator Experts 🧠', value: 'expert' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`rounded-full px-5 py-2 text-xs font-bold border transition-all duration-300 ${
              filter === tab.value
                ? 'bg-slate-950 border-slate-950 text-white shadow-md'
                : 'bg-white border-sage/25 text-slate-700 hover:bg-mint/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Horizontal Carousel */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-none py-6 px-4 relative z-10 max-w-7xl mx-auto snap-x snap-mandatory"
      >
        {filteredReviews.map((rev) => (
          <motion.div
            key={rev.id}
            whileHover={{ y: -6 }}
            className="relative w-[300px] md:w-[360px] h-[240px] shrink-0 bg-white border border-sage/20 rounded-[28px] p-6 md:p-8 shadow-[0_12px_30px_rgba(35,56,42,0.04)] flex flex-col justify-between overflow-hidden snap-start"
          >
            {/* Pale Green/Sage bottom-left corner accent block */}
            <div className="absolute bottom-0 left-0 w-8 h-12 bg-palegreen rounded-tr-2xl rounded-bl-[28px] pointer-events-none" />

            <div>
              {/* Star Rating & Value */}
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4.5 w-4.5 ${
                        i < rev.rating ? 'text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-slate-500 font-sans mt-0.5">
                  (4.7)
                </span>
              </div>

              {/* Quote text */}
              <p className="text-xs md:text-sm font-semibold leading-relaxed text-slate-700 font-sans mt-3.5 line-clamp-4">
                “{rev.quote}”
              </p>
            </div>

            {/* Profile Row */}
            <div className="relative z-10 flex items-center justify-between mt-4">
              <div className="pl-6">
                <div className="font-bold text-slate-950 text-sm md:text-base font-sans tracking-wide leading-none">
                  {rev.name}
                </div>
                <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mt-1.5 font-sans leading-none">
                  {rev.major}
                </div>
              </div>

              {/* Outline Quote Icon in Pale Green/Sage */}
              <svg className="w-14 h-14 text-sage/35 absolute bottom-0 right-0 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.25" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 11a3 3 0 11-3-3H10v3zm10 0a3 3 0 11-3-3H20v3z" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RatingSection;
