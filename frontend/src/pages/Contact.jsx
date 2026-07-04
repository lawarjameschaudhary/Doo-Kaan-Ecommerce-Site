import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactAPI.send(form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Could not send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="section-title mb-2">Contact Us</h1>
        <p className="text-gray-500 dark:text-gray-400">We'd love to hear from you. Reach out anytime!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required placeholder="Your Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input-field" />
              <input required type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="input-field" />
            </div>
            <input placeholder="Subject" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} className="input-field" />
            <textarea required placeholder="Your Message" rows={5} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} className="input-field" />
            <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
              <Send size={16} /> {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="card p-4 flex items-center gap-3">
              <MapPin className="text-primary shrink-0" size={20} />
              <p className="text-sm">Bharatpur-18, Bagmati, Nepal</p>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <Phone className="text-primary shrink-0" size={20} />
              <p className="text-sm">+977 9817246783</p>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <Mail className="text-primary shrink-0" size={20} />
              <p className="text-sm">sudiphero67@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden min-h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center text-gray-400">
            <MapPin size={40} className="mx-auto mb-2" />
            <p className="text-sm">Google Map Placeholder</p>
            <p className="text-xs">(Embed an interactive map here in production)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
