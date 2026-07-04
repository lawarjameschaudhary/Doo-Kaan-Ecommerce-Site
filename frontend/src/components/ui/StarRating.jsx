import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, size = 14, showValue = true }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= rounded ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}
          />
        ))}
      </div>
      {showValue && <span className="text-xs text-gray-500 dark:text-gray-400">({rating})</span>}
    </div>
  );
}
