import StarRating from '../ui/StarRating';

const REVIEWS = [
  { name: 'Bishal Karki', role: 'Verified Buyer', text: 'ShopSphere has the best prices I have found online. Delivery was quick and the packaging was excellent!', rating: 5 },
  { name: 'Anjali Gurung', role: 'Verified Buyer', text: 'Great variety of products and the customer support team resolved my issue within minutes.', rating: 5 },
  { name: 'Rohan Thapa', role: 'Verified Buyer', text: 'I love the flash sale section — always find great deals on electronics. Highly recommend!', rating: 4 },
];

export default function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h2 className="section-title">What Our Customers Say</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Real feedback from real ShopSphere shoppers</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {REVIEWS.map((r, i) => (
          <div key={i} className="card p-6 animate-fadeIn">
            <StarRating rating={r.rating} showValue={false} size={16} />
            <p className="text-sm text-gray-600 dark:text-gray-300 my-4 leading-relaxed">"{r.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                {r.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{r.name}</p>
                <p className="text-xs text-gray-400">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
