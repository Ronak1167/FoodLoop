import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Store,
  Bike,
  Package,
  TrendingUp,
  DollarSign,
  Flame,
  Leaf,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { api } from '../services/api';
import SDGBadge from '../components/common/SDGBadge';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'restaurants' | 'orders' | 'users' | 'categories'
  const [loading, setLoading] = useState(true);

  // New category form modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');

  const loadAdminData = async () => {
    try {
      const [analyticsRes, restRes, ordersRes, usersRes, catRes] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminRestaurants(),
        api.getAdminOrders(),
        api.getAdminUsers(),
        api.getCategories()
      ]);
      if (analyticsRes) setAnalytics(analyticsRes);
      if (restRes.restaurants) setRestaurants(restRes.restaurants);
      if (ordersRes.orders) setOrders(ordersRes.orders);
      if (usersRes.users) setUsers(usersRes.users);
      if (catRes.categories) setCategories(catRes.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleRestaurantStatus = async (restaurantId, currentStatus) => {
    const nextStatus = currentStatus === 'approved' ? 'suspended' : 'approved';
    try {
      await api.toggleRestaurantStatus(restaurantId, nextStatus);
      loadAdminData();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      await api.addCategory({
        name: newCatName,
        image: newCatImage || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'
      });
      setShowCategoryModal(false);
      setNewCatName('');
      setNewCatImage('');
      loadAdminData();
    } catch (err) {
      alert('Failed to add category: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-28 bg-cream-200 rounded-3xl" />
        <div className="grid grid-cols-4 gap-6">
          <div className="h-24 bg-cream-200 rounded-2xl" />
          <div className="h-24 bg-cream-200 rounded-2xl" />
          <div className="h-24 bg-cream-200 rounded-2xl" />
          <div className="h-24 bg-cream-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const summary = analytics?.summary || {};
  const charts = analytics?.charts || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Platform Admin & SDG Oversight
            </span>
            <SDGBadge goal="12" size="sm" />
            <SDGBadge goal="9" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            FoodLoop Executive Operations Console
          </h1>
          <p className="text-xs text-purple-200/80">
            Real-time compliance monitoring, surplus rescue analytics, and platform governance
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Platform GMV</div>
          <div className="text-2xl font-extrabold text-slate-900">₹{(summary.totalRevenue || 0).toLocaleString()}</div>
          <div className="text-[11px] text-emerald-700 font-semibold">{summary.completedOrders || 0} orders completed</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meals Rescued (SDG 12)</div>
          <div className="text-2xl font-extrabold text-orange-600">{summary.totalMealsRescued || 0}</div>
          <div className="text-[11px] text-orange-800 font-semibold">{summary.activeSurplusDeals || 0} deals currently live</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Waste Prevented</div>
          <div className="text-2xl font-extrabold text-forest-700">{summary.totalWasteKg || 0} kg</div>
          <div className="text-[11px] text-teal-700 font-semibold">~{summary.totalCo2SavedKg || 0} kg CO2 averted</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Ecosystem Users</div>
          <div className="text-2xl font-extrabold text-purple-700">{summary.totalUsers || 0}</div>
          <div className="text-[11px] text-slate-500 font-medium">
            {summary.totalRestaurants || 0} restaurants • {summary.totalDeliveryPartners || 0} EV couriers
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
            activeTab === 'overview' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:bg-cream-100'
          }`}
        >
          Analytics & Trends
        </button>

        <button
          onClick={() => setActiveTab('restaurants')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
            activeTab === 'restaurants' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:bg-cream-100'
          }`}
        >
          Restaurants ({restaurants.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
            activeTab === 'orders' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:bg-cream-100'
          }`}
        >
          All Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
            activeTab === 'users' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:bg-cream-100'
          }`}
        >
          Users & Fleet ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
            activeTab === 'categories' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:bg-cream-100'
          }`}
        >
          Food Categories ({categories.length})
        </button>
      </div>

      {/* Tab 1: Overview & Interactive SVG Charts */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Chart 1: Monthly Food Rescue Growth */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Food Rescue & SDG 12 Diverted Waste Growth</h3>
                <p className="text-xs text-slate-500">Monthly trajectory of surplus meals rescued from landfill</p>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                +48% MoM Growth
              </span>
            </div>

            {/* SVG Bar Chart */}
            <div className="h-60 w-full pt-4">
              <svg className="w-full h-full" viewBox="0 0 500 200">
                {/* Horizontal gridlines */}
                <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1.5" />

                {charts.monthlyTrends?.map((item, idx) => {
                  const x = 60 + idx * 72;
                  const barHeight = Math.min(140, (item.mealsRescued / 1800) * 140);
                  const y = 170 - barHeight;
                  return (
                    <g key={item.month}>
                      <rect
                        x={x}
                        y={y}
                        width="38"
                        height={barHeight}
                        rx="6"
                        fill="url(#greenGrad)"
                        className="hover:opacity-80 transition"
                      />
                      <text x={x + 19} y={y - 6} fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle">
                        {item.mealsRescued}
                      </text>
                      <text x={x + 19} y="188" fill="#64748b" fontSize="10" textAnchor="middle">
                        {item.month}
                      </text>
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Chart 2: Category Breakdown */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Order Volume by Category</h3>
              <p className="text-xs text-slate-500">Distribution across menu categories</p>
            </div>

            <div className="space-y-3">
              {charts.categoryBreakdown?.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{cat.name}</span>
                    <span>{cat.percentage}% ({cat.count} items)</span>
                  </div>
                  <div className="w-full bg-cream-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-cream-200 text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>All partner restaurants are active and comply with SDG 12 standards.</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Restaurants Management */}
      {activeTab === 'restaurants' && (
        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-cream-200 flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">Partner Restaurants Directory</h3>
            <span className="text-xs text-slate-400">Total: {restaurants.length}</span>
          </div>

          <div className="divide-y divide-cream-100">
            {restaurants.map((r) => (
              <div key={r._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cream-50/50 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{r.name}</h4>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {r.status}
                    </span>
                    {r.ecoPackagingAvailable && (
                      <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-1.5 py-0.5 rounded">
                        🌱 Zero Plastic
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{r.cuisines?.join(', ')} • Rating: ★ {r.rating}</p>
                  <p className="text-[11px] text-slate-400">{r.address?.street}, {r.address?.city}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right text-xs">
                    <div className="font-extrabold text-orange-600">{r.mealsRescuedCount || 0} Rescued</div>
                    <div className="text-slate-400 text-[10px]">{r.wastePreventedKg || 0} kg waste saved</div>
                  </div>

                  <button
                    onClick={() => handleToggleRestaurantStatus(r._id, r.status)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                      r.status === 'approved'
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {r.status === 'approved' ? 'Suspend' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: All Orders Audit */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-cream-200 flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">Platform Orders Audit</h3>
            <span className="text-xs text-slate-400">{orders.length} orders recorded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/70 text-slate-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3 pl-5">Order #</th>
                  <th className="p-3">Restaurant</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Cutlery Avoided</th>
                  <th className="p-3 pr-5">Eco Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-cream-50/50">
                    <td className="p-3 pl-5 font-bold text-slate-900">#{o.orderNumber}</td>
                    <td className="p-3 text-slate-700">{o.restaurantName}</td>
                    <td className="p-3 text-slate-700">{o.customerName}</td>
                    <td className="p-3 font-extrabold text-slate-900">₹{o.totalAmount}</td>
                    <td className="p-3">
                      <span className="bg-cream-100 text-slate-800 font-bold px-2 py-0.5 rounded-md">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-emerald-700">
                      {o.noCutlery ? 'Yes (Zero Waste)' : 'No'}
                    </td>
                    <td className="p-3 pr-5 font-bold text-emerald-800">
                      +{o.ecoPointsEarned || 30} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Users Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-cream-200 flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">Registered Users & Couriers</h3>
            <span className="text-xs text-slate-400">{users.length} registered accounts</span>
          </div>

          <div className="divide-y divide-cream-100">
            {users.map((u) => (
              <div key={u._id} className="p-4 flex items-center justify-between hover:bg-cream-50/50 transition">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{u.name}</span>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-cream-100 text-slate-700">
                      {u.role?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{u.email} • {u.phone || 'No phone'}</p>
                </div>

                <div className="text-right text-xs">
                  {u.role === 'customer' && (
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                      {u.rewardPoints || 0} Eco Points
                    </span>
                  )}
                  {u.role === 'delivery_partner' && (
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                      EV Courier (₹{u.totalEarnings || 0})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Categories Manager */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Active Food Categories</h3>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c._id} className="bg-white p-4 rounded-3xl border border-cream-200 shadow-sm flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream-100 shrink-0">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{c.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">/{c.slug}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {showCategoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
                <h3 className="text-base font-extrabold text-slate-900">Add Category</h3>
                <form onSubmit={handleAddCategory} className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category Name</label>
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      required
                      placeholder="e.g. Healthy Bowls"
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                    <input
                      type="text"
                      value={newCatImage}
                      onChange={(e) => setNewCatImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(false)}
                      className="px-3 py-2 rounded-xl font-bold text-slate-600 bg-cream-100 hover:bg-cream-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl font-bold text-white bg-purple-700 hover:bg-purple-800"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
