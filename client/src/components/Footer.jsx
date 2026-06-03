import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const Footer = () => {
  return (
    <motion.footer 
      className="mt-24 rounded-t-[40px] border-t border-sage/30 bg-gradient-to-b from-surface via-surface to-mint/20 px-6 py-12 md:px-12 shadow-soft"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 50, damping: 20 }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:items-start">
          
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 text-slate-950">
              <img src={logo} alt="EduMind AI logo" className="h-11 w-11 object-contain mix-blend-multiply hover:scale-105 transition-transform duration-200" />
              <span className="text-lg font-extrabold tracking-tight text-slate-900">EduMind AI</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-600">
              A calm, confident study companion for engineering students who want more focus and faster progress.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-800">Quick Links</h4>
            <div className="mt-4 flex flex-col gap-2.5 text-sm font-medium text-slate-600">
              <motion.div whileHover={{ x: 6 }} className="w-fit">
                <Link to="/" className="group relative w-fit transition duration-200 hover:text-emerald-700">
                  Home
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 6 }} className="w-fit">
                <Link to="/ai" className="group relative w-fit transition duration-200 hover:text-emerald-700">
                  AI Chat
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 6 }} className="w-fit">
                <Link to="/revision" className="group relative w-fit transition duration-200 hover:text-emerald-700">
                  Revision Coach
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 6 }} className="w-fit">
                <Link to="/flashcards" className="group relative w-fit transition duration-200 hover:text-emerald-700">
                  Flashcards
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 6 }} className="w-fit">
                <Link to="/forum" className="group relative w-fit transition duration-200 hover:text-emerald-700">
                  Community Forum
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-800">Contact Info</h4>
            <div className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600 font-medium">
              <div>hello@edumind.ai</div>
              <div>+91 98765 43210</div>
              <div>EduMind AI Community Hub</div>
            </div>
          </div>

          {/* Socials & AI Shortcut */}
          <div className="flex flex-col justify-between h-full space-y-6">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-800">Follow Us</h4>
              {/* Social Media Icons */}
              <div className="mt-4 flex items-center gap-3">
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  whileHover={{ scale: 1.18, rotate: 6 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-offwhite border border-sage/20 text-slate-650 shadow-sm transition-all duration-300 hover:bg-palegreen hover:text-emerald-950"
                >
                  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  whileHover={{ scale: 1.18, rotate: 6 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-offwhite border border-sage/20 text-slate-650 shadow-sm transition-all duration-300 hover:bg-palegreen hover:text-emerald-950"
                >
                  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Discord"
                  whileHover={{ scale: 1.18, rotate: 6 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-offwhite border border-sage/20 text-slate-650 shadow-sm transition-all duration-300 hover:bg-palegreen hover:text-emerald-950"
                >
                  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.873-.894.076.076 0 01-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 01.077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 01.078.009c.12.099.246.195.373.289a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36 1.954.772 3.193 1.225 1.992a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                  </svg>
                </motion.a>
              </div>
            </div>

            {/* Floating direct-to-chat shortcut icon */}
            <div className="flex items-center gap-3">
              <Link to="/ai" aria-label="Open AI chat shortcut">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(168, 195, 160, 0.4)',
                      '0 0 0 10px rgba(168, 195, 160, 0)',
                      '0 0 0 0 rgba(168, 195, 160, 0)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-palegreen text-slate-950 shadow-md cursor-pointer transition hover:bg-sage hover:text-slate-950 border border-sage/20"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                </motion.div>
              </Link>
              <div className="text-xs font-bold text-emerald-950">
                <Link to="/ai" className="hover:underline">Quick AI Assistant</Link>
              </div>
            </div>
          </div>

        </div>

        {/* Divider and Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-sage/20 pt-6 text-sm text-slate-500 sm:flex-row">
          <span>© 2026 EduMind AI · Built for modern student success</span>
          <div className="flex gap-4 font-medium">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
          </div>
        </div>

      </div>
    </motion.footer>
  );
};

export default Footer;
