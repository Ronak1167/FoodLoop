import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Lock, Mail, ArrowRight, User, ChefHat, Bike, Shield } from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, quickLoginAs } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.user?.role === 'restaurant_owner') navigate('/restaurant-dashboard');
      else if (res.user?.role === 'delivery_partner') navigate('/delivery-dashboard');
      else if (res.user?.role === 'admin') navigate('/admin-dashboard');
      else navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (roleKey) => {
    try {
      await quickLoginAs(roleKey);
      if (roleKey === 'restaurant_owner') navigate('/restaurant-dashboard');
      else if (roleKey === 'delivery_partner') navigate('/delivery-dashboard');
      else if (roleKey === 'admin') navigate('/admin-dashboard');
      else navigate(redirectPath);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest-600 mx-auto flex items-center justify-center text-white shadow-md">
            <Leaf className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to FoodLoop
          </h2>
          <p className="text-xs text-slate-500">
            Smart & Sustainable Food Delivery System
          </p>
        </div>

        {/* 1-Click Demo Login Bar */}
        <div className="bg-cream-100/80 p-4 rounded-3xl border border-cream-300 space-y-2.5">
          <span className="text-xs font-bold text-slate-600 block text-center uppercase tracking-wider">
            ⚡ 1-Click Demo Role Sign-In
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="bg-white hover:bg-forest-50 border border-cream-300 hover:border-forest-400 p-2 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('restaurant_owner')}
              className="bg-white hover:bg-amber-50 border border-cream-300 hover:border-amber-400 p-2 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-600" />
              <span>Restaurant Owner</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('delivery_partner')}
              className="bg-white hover:bg-blue-50 border border-cream-300 hover:border-blue-400 p-2 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <Bike className="w-3.5 h-3.5 text-blue-600" />
              <span>Delivery EV Partner</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="bg-white hover:bg-purple-50 border border-cream-300 hover:border-purple-400 p-2 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin Director</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-sm space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-forest-600"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-forest-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest-600 hover:bg-forest-700 disabled:opacity-50 text-white font-extrabold py-3 px-4 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-cream-200">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-forest-700 hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
