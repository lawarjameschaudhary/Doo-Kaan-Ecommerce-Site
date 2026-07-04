import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Section({ title, subtitle, viewAllLink, children }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{subtitle}</p>}
        </div>
        {viewAllLink && (
          <Link to={viewAllLink} className="flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all">
            View All <ChevronRight size={16} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
