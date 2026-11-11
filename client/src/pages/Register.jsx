import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, ChefHat, Bike, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [vehicle, setVehicle] = useState('Electric Scooter EV');
  const [dietaryPreference, setDietaryPreference] = useState('veg');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password,
        role,
        phone,
        restaurantName: role === 'restaurant_owner' ? restaurantName : undefined,
        vehicle: role === 'delivery_partner' ? vehicle : undefined,
        dietaryPreference: role === 'customer' ? dietaryPreference : undefined
      };

      const res = await register(payload);
      if (res.user?.role === 'restaurant_owner') navigate('/restaurant-dashboard');
      else if (res.user?.role === 'delivery_partner') navigate('/delivery-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest-600 mx-auto flex items-center justify-center text-white shadow-md">
            <Leaf className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs text-slate-500">
            Join the movement for SDG 12 Responsible Consumption & Zero Waste
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="bg-cream-100 p-1.5 rounded-2xl grid grid-cols-3 gap-1 border border-cream-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              role === 'customer' ? 'bg-white text-forest-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('restaurant_owner')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              role === 'restaurant_owner' ? 'bg-white text-amber-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5 text-amber-600" />
            <span>Restaurant</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('delivery_partner')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              role === 'delivery_partner' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bike className="w-3.5 h-3.5 text-blue-600" />
            <span>Delivery EV</span>
          </button>
        </div>

        {/* Register Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-sm space-y-4 text-xs">
          {error && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jane Doe"
                className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimum 6 characters"
                className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            {/* Role specific inputs */}
            {role === 'restaurant_owner' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Restaurant Name</label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  required
                  placeholder="Green Leaf Organic Bistro"
                  className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            )}

            {role === 'delivery_partner' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">EV Vehicle Model</label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder="Ather 450X / Ola S1 Pro (EV)"
                  className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            )}

            {role === 'customer' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Dietary Preference</label>
                <select
                  value={dietaryPreference}
                  onChange={(e) => setDietaryPreference(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
                >
                  <option value="veg">🌱 Vegetarian</option>
                  <option value="non-veg">🍗 Non-Vegetarian</option>
                  <option value="all">🍽️ All</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest-600 hover:bg-forest-700 disabled:opacity-50 text-white font-extrabold py-3 px-4 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 mt-4"
            >
              <span>{loading ? 'Creating...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-cream-200">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-forest-700 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
