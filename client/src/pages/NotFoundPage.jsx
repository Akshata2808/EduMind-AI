import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-3xl flex-col items-center justify-center px-6 text-center">
    <h1 className="text-6xl font-bold text-slate-900">404</h1>
    <p className="mt-4 text-lg text-slate-700">Page not found. Return to the EduMind dashboard and continue your flow.</p>
    <Link to="/" className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-offwhite transition hover:bg-slate-800">Back home</Link>
  </div>
);

export default NotFoundPage;
