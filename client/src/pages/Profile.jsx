import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Award, Clock, ArrowRight, ShieldCheck, MapPin, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Edit form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [diet, setDiet] = useState(user?.dietaryPreference || 'veg');
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    api.getMyOrders().then(res => {
      if (res.orders) setOrders(res.orders);
    }).finally(() => setLoadingOrders(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.updateProfile({
        name,
        phone,
        address: { street, city, state: user?.address?.state || 'Haryana', zipCode: user?.address?.zipCode || '122001' },
        dietaryPreference: diet
      });
      await refreshUser();
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      alert('Failed to update: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-forest-700 text-white font-extrabold text-2xl flex items-center justify-center uppercase shadow-md">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{user?.name}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">{user?.email} • {user?.phone || 'No phone set'}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-forest-50 border border-forest-200 p-3 rounded-2xl text-center min-w-[100px]">
            <div className="text-xl font-extrabold text-forest-800">{user?.rewardPoints || 0}</div>
            <div className="text-[10px] text-forest-700 font-semibold">Eco Points</div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-3 rounded-2xl text-center min-w-[100px]">
            <div className="text-xl font-extrabold text-orange-700">{user?.totalMealsRescued || 0}</div>
            <div className="text-[10px] text-orange-800 font-semibold">Meals Rescued</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Edit Profile Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-cream-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-cream-200 pb-2">
            Personal Information & Addresses
          </h2>

          {savedMsg && (
            <div className="bg-emerald-50 text-emerald-800 text-xs p-2.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Street Address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dietary Preference</label>
              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
              >
                <option value="veg">🌱 Vegetarian</option>
                <option value="non-veg">🍗 Non-Vegetarian</option>
                <option value="all">🍽️ All</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-forest-600 hover:bg-forest-700 text-white font-bold py-2.5 rounded-xl transition mt-2 shadow-sm"
            >
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Right: Order History */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-cream-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-cream-200 pb-2">
            <h2 className="text-base font-extrabold text-slate-900">Order History ({orders.length})</h2>
            <span className="text-xs text-slate-400">Click order to view live tracking</span>
          </div>

          {loadingOrders ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 bg-cream-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No orders placed yet.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <Link
                  key={o._id}
                  to={`/orders/${o._id}`}
                  className="block p-4 rounded-2xl border border-cream-200 hover:border-emerald-300 hover:shadow-md transition bg-cream-50/50"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">#{o.orderNumber} • {o.restaurantName}</span>
                    <span className="font-extrabold text-forest-700 bg-forest-100 px-2.5 py-0.5 rounded-full">
                      {o.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                    <div className="truncate max-w-[280px]">
                      {o.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                    <span className="font-extrabold text-slate-900">₹{o.totalAmount}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-cream-200">
                    <span>{new Date(o.createdAt).toLocaleString()}</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      🌱 +{o.ecoPointsEarned || 30} pts earned <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
