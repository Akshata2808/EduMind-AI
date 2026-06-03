import { motion } from 'framer-motion';

const TestimonialGrid = ({ items }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map((it, idx) => (
        <motion.div 
          key={it.name} 
          whileHover={{ scale: 1.03, y: -6 }} 
          transition={{ type: 'spring', stiffness: 200 }} 
          className="group relative overflow-hidden rounded-2xl bg-surface/90 border border-sage/20 p-6 shadow-soft"
        >
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-palegreen opacity-30 blur-3xl" />
          <div className="relative">
            <p className="text-slate-800 font-medium">“{it.quote}”</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-mint/50 border border-sage/20 flex items-center justify-center font-bold text-emerald-950">
                {it.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-slate-900">{it.name}</div>
                <div className="text-xs font-semibold text-slate-500">{it.role}</div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TestimonialGrid;
