import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/layout/ScrollToTop';
import ChatbotWidget from '../components/chatbot/ChatbotWidget';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Navbar />
      <main className="flex-1 animate-fadeIn">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <ChatbotWidget />
    </div>
  );
}
