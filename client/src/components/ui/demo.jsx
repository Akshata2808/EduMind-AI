import { TestimonialsColumn } from "./testimonials-columns-1";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "EduMind's AI Study Chat transformed my exam prep. The custom notes and practice quizzes kept me organized and stress-free.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Implementing the Mumbai University roadmap was incredibly easy. I normalise my study hours and track syllabus chapters with the visual path maker.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Bilal Ahmed",
    role: "IT Student",
  },
  {
    text: "The PDF Summarizer saves hours of manual note-taking. It extracts formulas and drafts direct viva questions instantly.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Saman Malik",
    role: "Student Advisor",
  },
  {
    text: "EduMind's attendance tracker predicted my exact skipping buffer, keeping my semester records well above the university's 75% limit.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Omar Raza",
    role: "CS Sophomore",
  },
  {
    text: "Flipping the custom 3D flashcards made learning complex state machines and calculus formulas highly interactive for our study group.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Zainab Hussain",
    role: "Maths Expert",
  },
  {
    text: "Our study streak on the dynamic planner helped our entire batch stay focused during final exam weeks.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Aliza Khan",
    role: "Engineering Freshman",
  },
  {
    text: "The community forum feed is a lifesaver. I get instant replies and solved derivations from senior students and expert educators.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Farhan Siddiqui",
    role: "EXTC Student",
  },
  {
    text: "EduMind's voice assistant lets me review concepts hands-free while travelling to college. Genuinely care about student productivity.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Sana Sheikh",
    role: "IT Junior",
  },
  {
    text: "Generating dynamic practice tests with the AI Quiz Maker boosted my exam score and confidence significantly.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Hassan Ali",
    role: "E-commerce Sophomore",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section className="my-20 relative">
      <div className="container z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/80 border border-sage/25 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-950">
              💬 Campus Buzz
            </span>
          </div>

          <h2 className="text-2xl md:text-3.5xl font-black tracking-tight mt-5 text-center text-slate-950 font-heading">
            What our users say
          </h2>
          <p className="text-center mt-3 text-xs font-semibold text-slate-700 max-w-sm">
            Discover how EduMind AI is elevating exam productivity and grades for engineering students.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[640px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
