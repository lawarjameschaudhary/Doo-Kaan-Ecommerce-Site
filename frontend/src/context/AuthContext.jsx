import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('shopsphere_user');
    const token = localStorage.getItem('shopsphere_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('shopsphere_token', data.token);
    localStorage.setItem('shopsphere_user', JSON.stringify(data.user));
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.first_name || data.user.username}!`);
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await authAPI.signup(payload);
    localStorage.setItem('shopsphere_token', data.token);
    localStorage.setItem('shopsphere_user', JSON.stringify(data.user));
    setUser(data.user);
    toast.success('Account created successfully!');
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('shopsphere_token');
    localStorage.removeItem('shopsphere_user');
    setUser(null);
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
