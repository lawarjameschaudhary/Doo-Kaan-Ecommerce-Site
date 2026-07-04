import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-extrabold text-primary/20">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-2 mb-2">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary flex items-center gap-2">
        <Home size={16} /> Back to Home
      </Link>
    </div>
  );
}
