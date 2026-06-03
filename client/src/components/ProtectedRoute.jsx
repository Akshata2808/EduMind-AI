import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  if (loading) return <div className="min-h-screen grid place-items-center text-slate-700">Loading...</div>;

  // Allow access to certain features during a guest trial.
  const trialRaw = localStorage.getItem('edumind_trial');
  let trial = null;
  try { trial = trialRaw ? JSON.parse(trialRaw) : null; } catch(e) { trial = null; }
  const allowedSlugs = trial?.features || [];

  // map pathname to simple slug names used by the trial
  const pathToSlug = (p) => {
    if (p.startsWith('/ai')) return 'ai';
    if (p.startsWith('/revision')) return 'revision';
    if (p.startsWith('/roadmap')) return 'roadmap';
    if (p.startsWith('/flashcards')) return 'flashcards';
    if (p.startsWith('/voice')) return 'voice';
    return null;
  };

  const slug = pathToSlug(location.pathname);

  if (!user) {
    // allow if trial grants this slug
    if (slug && allowedSlugs.includes(slug)) return children;
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
