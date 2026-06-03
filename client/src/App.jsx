import { useContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthContext } from './context/AuthContext.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AIChatPage from './pages/AIChatPage.jsx';
import PDFSummaryPage from './pages/PDFSummaryPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import PlannerPage from './pages/PlannerPage.jsx';
import MathsSolverPage from './pages/MathsSolverPage.jsx';
import RevisionPage from './pages/RevisionPage.jsx';
import RoadmapPage from './pages/RoadmapPage.jsx';
import FlashcardsPage from './pages/FlashcardsPage.jsx';
import ForumPage from './pages/ForumPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25 } }
};

function App() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-offwhite text-slate-900">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<motion.div {...pageTransition}><LandingPage /></motion.div>} />
          <Route path="/auth" element={<motion.div {...pageTransition}><AuthPage /></motion.div>} />
          <Route path="/reset-password/:token" element={<motion.div {...pageTransition}><ResetPasswordPage /></motion.div>} />
          <Route path="/dashboard" element={<ProtectedRoute><motion.div {...pageTransition}><DashboardPage /></motion.div></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><motion.div {...pageTransition}><AIChatPage /></motion.div></ProtectedRoute>} />
          <Route path="/forum" element={<motion.div {...pageTransition}><ForumPage /></motion.div>} />
          <Route path="/revision" element={<ProtectedRoute><motion.div {...pageTransition}><RevisionPage /></motion.div></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute><motion.div {...pageTransition}><RoadmapPage /></motion.div></ProtectedRoute>} />
          <Route path="/flashcards" element={<ProtectedRoute><motion.div {...pageTransition}><FlashcardsPage /></motion.div></ProtectedRoute>} />
          <Route path="/pdf" element={<ProtectedRoute><motion.div {...pageTransition}><PDFSummaryPage /></motion.div></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><motion.div {...pageTransition}><QuizPage /></motion.div></ProtectedRoute>} />
          <Route path="/planner" element={<ProtectedRoute><motion.div {...pageTransition}><PlannerPage /></motion.div></ProtectedRoute>} />
          <Route path="/maths" element={<ProtectedRoute><motion.div {...pageTransition}><MathsSolverPage /></motion.div></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><motion.div {...pageTransition}><AdminPage /></motion.div></ProtectedRoute>} />
          <Route path="*" element={<motion.div {...pageTransition}><NotFoundPage /></motion.div>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
