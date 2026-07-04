import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm_password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Please enter your full name.';
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!/^\d{7,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number.';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirm_password) errs.confirm_password = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await signup(form);
      navigate('/');
    } catch (err) {
      const apiErrors = err.response?.data;
      if (apiErrors?.email) toast.error(apiErrors.email[0]);
      else toast.error('Could not create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, icon, type = 'text') => (
    <div>
      <div className="relative">
        {icon}
        <input
          type={type}
          placeholder={label}
          value={form[name]}
          onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
          className="input-field pl-10"
        />
      </div>
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8 animate-scaleIn">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">S</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Join Doo-Kaan and start shopping today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {field('name', 'Full Name', <User size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />)}
          {field('email', 'Email Address', <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />, 'email')}
          {field('phone', 'Phone Number', <Phone size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />)}
          {field('password', 'Password', <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />, 'password')}
          {field('confirm_password', 'Confirm Password', <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />, 'password')}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
