/** Formats a number as NPR currency, e.g. 1250 -> "Rs. 1,250" */
export function formatPrice(value) {
  const num = Number(value) || 0;
  return `Rs. ${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

/** Truncates text to a max length, appending an ellipsis. */
export function truncate(text, maxLength = 80) {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

/** Formats an ISO date string into a readable date. */
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Returns Tailwind color classes for an order status badge. */
export function statusColor(status) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
}
