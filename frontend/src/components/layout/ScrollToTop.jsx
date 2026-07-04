import { ArrowUp } from 'lucide-react';
import { useScrollTop } from '../../hooks/useScrollTop';

export default function ScrollToTop() {
  const { visible, scrollToTop } = useScrollTop();
  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-5 z-40 bg-primary hover:bg-primary-700 text-white p-3 rounded-full shadow-lg animate-fadeIn transition-transform hover:-translate-y-1"
      title="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}
