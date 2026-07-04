/**
 * Simple rule-based chatbot engine.
 * Matches keywords in the user's message to a canned response.
 * No AI/API calls — fully deterministic, ideal for a college demo.
 */

const RULES = [
  { keywords: ['hello', 'hi', 'hey'], response: "Hello! Welcome to ShopSphere. How can I help you today?" },
  { keywords: ['order', 'track', 'status'], response: "You can track your orders anytime from the 'My Orders' page after logging in. Just click your profile icon → My Orders." },
  { keywords: ['payment', 'pay', 'esewa', 'khalti', 'cod', 'card'], response: "We accept Cash on Delivery, eSewa, Khalti, and Credit Card payments. You can choose your preferred method at checkout." },
  { keywords: ['return', 'refund', 'exchange'], response: "Items can be returned within 7 days of delivery if unused and in original packaging. Please contact our support team to start a return." },
  { keywords: ['delivery', 'shipping', 'ship'], response: "Standard delivery takes 2-5 business days depending on your location. Express delivery options are available at checkout." },
  { keywords: ['contact', 'phone', 'email', 'support'], response: "You can reach us at support@shopsphere.com or call +977 61-000000. Or use our Contact page to send a message!" },
  { keywords: ['discount', 'coupon', 'sale', 'offer'], response: "Check out our Flash Sale section on the homepage for time-limited discounts! We also send exclusive coupons to newsletter subscribers." },
  { keywords: ['cart', 'add to cart'], response: "You can add items to your cart from any product page or product card. View your cart anytime using the cart icon in the navbar." },
  { keywords: ['wishlist', 'save', 'favorite'], response: "Tap the heart icon on any product to save it to your wishlist. You can move wishlist items to your cart anytime." },
  { keywords: ['account', 'login', 'signup', 'register'], response: "You can create an account via the Sign Up page, or log in if you already have one. It only takes a minute!" },
  { keywords: ['product', 'item', 'stock', 'available'], response: "Browse our full catalog on the Products page, with filters for category, price, rating, and availability." },
  { keywords: ['thank', 'thanks'], response: "You're very welcome! Happy shopping at ShopSphere. 😊" },
  { keywords: ['bye', 'goodbye'], response: "Goodbye! Come back soon for more great deals at ShopSphere." },
];

export const SUGGESTED_QUESTIONS = [
  "How do I track my order?",
  "What payment methods do you accept?",
  "What is your return policy?",
  "How can I contact support?",
];

export function getBotResponse(message) {
  const lower = message.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      return rule.response;
    }
  }
  return "Sorry, I couldn't understand that. Please ask about products, payments, orders or contact information.";
}
