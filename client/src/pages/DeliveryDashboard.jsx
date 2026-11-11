import React, { useState, useEffect } from 'react';
import {
  Bike,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  DollarSign,
  Award,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { api } from '../services/api';
import SDGBadge from '../components/common/SDGBadge';
import { useAuth } from '../context/AuthContext';

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDeliveries = async () => {
    try {
      const [availRes, myRes] = await Promise.all([
        api.getAvailableDeliveries(),
        api.getMyDeliveries()
      ]);
      if (availRes.deliveries) setAvailableDeliveries(availRes.deliveries);
      if (myRes.active) setActiveDeliveries(myRes.active);
      if (myRes.completed) setCompletedDeliveries(myRes.completed);
      if (myRes.summary) setSummary(myRes.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    try {
      await api.acceptDelivery(orderId);
      loadDeliveries();
    } catch (err) {
      alert('Failed to accept: ' + err.message);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus, `Courier updated to ${newStatus}`);
      loadDeliveries();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-28 bg-cream-200 rounded-3xl" />
        <div className="grid grid-cols-3 gap-6">
          <div className="h-24 bg-cream-200 rounded-2xl" />
          <div className="h-24 bg-cream-200 rounded-2xl" />
          <div className="h-24 bg-cream-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Bike className="w-3.5 h-3.5" /> Delivery Partner Portal
            </span>
            <SDGBadge goal="9" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Courier Hub: {user?.name || 'Rohan Das'}
          </h1>
          <p className="text-xs text-blue-200/80">
            Assigned Vehicle: <span className="font-bold text-white">{summary?.vehicle || 'Zero-Emission Electric Scooter'}</span>
          </p>
        </div>

        {/* Courier metrics */}
        <div className="flex gap-4">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
            <div className="text-xl font-extrabold text-emerald-300">₹{summary?.totalEarnings || 3820}</div>
            <div className="text-[10px] text-blue-200 uppercase font-semibold">Total Earnings</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
            <div className="text-xl font-extrabold text-amber-300">★ {summary?.rating || 4.9}</div>
            <div className="text-[10px] text-blue-200 uppercase font-semibold">Driver Rating</div>
          </div>
        </div>
      </div>

      {/* Active Trip in Progress (Priority View) */}
      {activeDeliveries.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
            <span>Active Delivery Assignment in Progress</span>
          </h2>

          {activeDeliveries.map((order) => (
            <div key={order._id} className="bg-white rounded-3xl p-6 border-2 border-orange-300 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-slate-900">Order #{order.orderNumber}</span>
                    <span className="text-xs font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Pickup: <span className="font-bold text-slate-800">{order.restaurantName}</span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Payout for this trip:</span>
                  <span className="text-base font-extrabold text-emerald-700">₹65 (₹50 base + ₹15 green tip)</span>
                </div>
              </div>

              {/* Pickup & Delivery Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-cream-50 p-3.5 rounded-2xl border border-cream-200 space-y-1">
                  <span className="font-bold text-forest-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> 1. Pickup Point (Kitchen)
                  </span>
                  <p className="font-semibold text-slate-900">{order.restaurantName}</p>
                  <p className="text-slate-500">{order.restaurantAddress?.street || 'Galleria Market, Sector 28, Gurugram'}</p>
                </div>

                <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-200 space-y-1">
                  <span className="font-bold text-blue-700 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5" /> 2. Drop-off Point (Customer)
                  </span>
                  <p className="font-semibold text-slate-900">{order.customerName}</p>
                  <p className="text-slate-500">{order.deliveryAddress?.street || 'Tower 5, Lotus Boulevard, Gurugram'}</p>
                  <button
                    onClick={() => alert(`Dialing customer at ${order.customerPhone || '+91 98765 43210'}`)}
                    className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 pt-1"
                  >
                    <Phone className="w-3 h-3" /> Call Customer
                  </button>
                </div>
              </div>

              {/* Status Update Progression Buttons for Courier */}
              <div className="pt-2 flex flex-wrap gap-2">
                {order.status === 'Ready for Pickup' && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'Picked Up')}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition"
                  >
                    ✓ Confirm Food Picked Up from Kitchen
                  </button>
                )}

                {order.status === 'Picked Up' && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'Out for Delivery')}
                    className="bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition"
                  >
                    ⚡ Start EV Ride (Out for Delivery)
                  </button>
                )}

                {order.status === 'Out for Delivery' && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition"
                  >
                    🎉 Mark Order Delivered (Complete Trip)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Available Deliveries to Accept */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">
            Available Pickup Requests ({availableDeliveries.length})
          </h2>
          <span className="text-xs text-slate-400">First to accept secures the trip</span>
        </div>

        {availableDeliveries.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-cream-200 text-center text-xs text-slate-400">
            No unassigned deliveries right now. You're all caught up!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableDeliveries.map((d) => (
              <div key={d._id} className="bg-white rounded-3xl p-5 border border-cream-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">Order #{d.orderNumber}</span>
                    <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      ₹60 payout
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-semibold">{d.restaurantName}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {d.items?.length || 1} item(s) • Drop at {d.deliveryAddress?.city || 'Gurugram'}
                  </div>
                </div>

                <button
                  onClick={() => handleAcceptOrder(d._id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm transition"
                >
                  Accept Delivery Assignment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Deliveries History */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900">
          Completed Trips History ({completedDeliveries.length})
        </h2>

        <div className="bg-white rounded-3xl border border-cream-200 p-5 shadow-sm divide-y divide-cream-100">
          {completedDeliveries.slice(0, 5).map((cd) => (
            <div key={cd._id} className="py-3 flex items-center justify-between text-xs first:pt-0 last:pb-0">
              <div>
                <span className="font-bold text-slate-800">#{cd.orderNumber} • {cd.restaurantName}</span>
                <span className="text-[11px] text-slate-400 block">{new Date(cd.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-emerald-700">+₹65.00</span>
                <span className="text-[10px] text-slate-400 block">Delivered on EV</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
