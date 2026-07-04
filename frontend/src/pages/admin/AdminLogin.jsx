import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await authAPI.adminLogin(form);
      if (data.success) {
        localStorage.setItem('shopsphere_admin', 'true');
        toast.success('Welcome back, Admin!');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      toast.error('Invalid admin credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="card bg-gray-900 border-gray-800 w-full max-w-sm p-8 animate-scaleIn">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white mx-auto mb-3">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-xl font-bold text-white">ShopSphere Admin</h1>
          <p className="text-sm text-gray-400">Sign in to manage your store</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Signing in...' : 'Login to Dashboard'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-5">Demo credentials: admin / admin123</p>
      </div>
    </div>
  );
}
