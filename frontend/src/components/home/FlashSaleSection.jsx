import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import ProductGrid from '../product/ProductGrid';

function useCountdown(hoursFromNow = 8) {
  const [target] = useState(() => Date.now() + hoursFromNow * 3600 * 1000);
  const [remaining, setRemaining] = useState(target - Date.now());

  useEffect(() => {
    const timer = setInterval(() => setRemaining(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(timer);
  }, [target]);

  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return { h, m, s };
}

export default function FlashSaleSection({ products, loading }) {
  const { h, m, s } = useCountdown(8);

  return (
    <section className="bg-primary/5 dark:bg-gray-900 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-2 rounded-xl">
              <Zap size={22} className="fill-white" />
            </div>
            <div>
              <h2 className="section-title">Flash Sale</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Grab these deals before time runs out!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[['H', h], ['M', m], ['S', s]].map(([label, val]) => (
              <div key={label} className="bg-gray-900 text-white rounded-lg px-3 py-2 text-center min-w-[52px]">
                <p className="text-lg font-bold leading-none">{String(val).padStart(2, '0')}</p>
                <p className="text-[10px] text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <ProductGrid products={products} loading={loading} />
      </div>
    </section>
  );
}
