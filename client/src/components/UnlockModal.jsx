import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, XMarkIcon } from '@heroicons/react/24/outline';

const UnlockModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-sage/20 bg-surface/95 p-8 shadow-[0_30px_70px_rgba(35,56,42,0.18)]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full p-1 text-slate-450 transition hover:bg-palegreen/20 hover:text-slate-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          <div className="text-center">
            {/* Lock Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint text-emerald-950 shadow-inner border border-sage/20">
              <LockClosedIcon className="h-8 w-8" />
            </div>

            <h3 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
              Unlock All 10+ Features
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 font-medium">
              You are currently on a guest trial with access to <span className="font-bold text-emerald-900">AI Chat</span> and <span className="font-bold text-emerald-900">Revision Coach</span>. Register a free account to unlock the rest of the toolkit!
            </p>

            {/* Quick list of locked features */}
            <div className="mt-5 grid grid-cols-2 gap-2 text-left text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2 rounded-xl bg-offwhite px-3 py-2 border border-sage/15">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                <span>Quiz Maker</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-offwhite px-3 py-2 border border-sage/15">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                <span>PDF Summaries</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-offwhite px-3 py-2 border border-sage/15">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                <span>Study Roadmaps</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-offwhite px-3 py-2 border border-sage/15">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                <span>Voice Assistant</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => {
                  onClose();
                  navigate('/auth');
                }}
                className="w-full rounded-full bg-palegreen border border-sage/30 py-3 text-sm font-bold text-slate-950 shadow-lg transition hover:bg-sage"
              >
                Register Free Account
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-full border border-sage/25 bg-offwhite py-3 text-sm font-semibold text-slate-600 transition hover:bg-palegreen/20"
              >
                Continue Guest Trial
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UnlockModal;
