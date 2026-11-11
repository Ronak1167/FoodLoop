import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Bike,
  MapPin,
  Leaf,
  ShieldCheck,
  Star,
  Phone,
  MessageSquare,
  Package,
  Flame,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import SDGBadge from '../components/common/SDGBadge';

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review state
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await api.getOrderById(id);
      if (res.order) setOrder(res.order);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll updates every 6 seconds to reflect real-time courier movement
    const interval = setInterval(fetchOrder, 6000);
    return () => clearInterval(interval);
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addReview(id, { rating: ratingScore, comment: ratingComment });
      setReviewSubmitted(true);
      fetchOrder();
    } catch (err) {
      alert('Failed to submit review: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 animate-pulse space-y-6">
        <div className="h-12 bg-cream-200 rounded-2xl w-64" />
        <div className="h-64 bg-cream-200 rounded-3xl" />
        <div className="h-40 bg-cream-200 rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-800">Order not found</h2>
        <Link to="/" className="text-xs font-bold text-forest-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const statusSteps = [
    'Placed',
    'Accepted',
    'Preparing',
    'Ready for Pickup',
    'Picked Up',
    'Out for Delivery',
    'Delivered'
  ];

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Order Status:</span>
            <span className="text-xs font-extrabold text-forest-800 bg-forest-100 px-2.5 py-0.5 rounded-full">
              {order.status}
            </span>
            <SDGBadge goal="12" size="sm" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-slate-500">
            Placed from <span className="font-bold text-slate-700">{order.restaurantName}</span>
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block">Estimated Arrival</span>
          <div className="text-lg font-extrabold text-forest-700 flex items-center justify-end gap-1">
            <Clock className="w-4 h-4 text-forest-600" />
            <span>{order.status === 'Delivered' ? 'Arrived!' : '12 - 18 mins'}</span>
          </div>
        </div>
      </div>

      {/* Visual Status Progression Stepper */}
      <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
          Order Journey
        </h2>

        <div className="relative">
          {/* Stepper bar */}
          <div className="hidden sm:grid grid-cols-7 gap-2 text-center text-xs">
            {statusSteps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition shadow-sm mb-2 ${
                      isPast
                        ? 'bg-forest-600 text-white'
                        : isCurrent
                        ? 'bg-orange-500 text-white pulse-glow ring-4 ring-orange-100'
                        : 'bg-cream-200 text-slate-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold leading-tight ${
                      isCurrent
                        ? 'text-orange-600 font-bold'
                        : isPast
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile Current Status Text */}
          <div className="sm:hidden bg-cream-50 p-3 rounded-xl border border-cream-200 text-center">
            <span className="text-xs text-slate-500">Current Phase:</span>
            <div className="text-sm font-bold text-forest-800">{order.status}</div>
          </div>
        </div>
      </div>

      {/* Simulated Live Route Map & Courier Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Interactive Map Visual */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-cream-200 flex items-center justify-between bg-cream-50/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Bike className="w-4 h-4 text-forest-600" />
              <span>Live EV Route Tracking (Zero-Carbon Fleet)</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              GPS Signal Live
            </span>
          </div>

          {/* SVG Map Graphic */}
          <div className="h-64 sm:h-72 w-full bg-slate-900 relative p-4 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 500 250">
              {/* City Grid Roads */}
              <path d="M 30,50 L 470,50" stroke="#334155" strokeWidth="2" strokeDasharray="6,6" />
              <path d="M 30,125 L 470,125" stroke="#334155" strokeWidth="3" />
              <path d="M 30,200 L 470,200" stroke="#334155" strokeWidth="2" strokeDasharray="6,6" />
              <path d="M 100,20 L 100,230" stroke="#334155" strokeWidth="2" strokeDasharray="6,6" />
              <path d="M 250,20 L 250,230" stroke="#334155" strokeWidth="3" />
              <path d="M 400,20 L 400,230" stroke="#334155" strokeWidth="2" strokeDasharray="6,6" />

              {/* Delivery Route Path */}
              <path
                d="M 80,125 Q 200,60 300,125 T 420,125"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Restaurant Node */}
              <circle cx="80" cy="125" r="14" fill="#047857" />
              <text x="80" y="129" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">R</text>
              <text x="80" y="155" fill="#94a3b8" fontSize="10" textAnchor="middle">Kitchen</text>

              {/* Courier Moving Node */}
              <circle cx="300" cy="125" r="16" fill="#f97316" />
              <circle cx="300" cy="125" r="24" fill="#f97316" opacity="0.3">
                <animate attributeName="r" values="16;28;16" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="300" y="129" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">EV</text>
              <text x="300" y="160" fill="#f97316" fontSize="10" textAnchor="middle" fontWeight="bold">Rohan (EV)</text>

              {/* Customer Home Node */}
              <circle cx="420" cy="125" r="14" fill="#3b82f6" />
              <text x="420" y="129" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">H</text>
              <text x="420" y="155" fill="#94a3b8" fontSize="10" textAnchor="middle">Delivery Address</text>
            </svg>

            {/* Floating overlay note */}
            <div className="absolute bottom-3 left-3 bg-slate-800/90 text-white text-[11px] px-3 py-1.5 rounded-xl backdrop-blur-sm border border-slate-700">
              ⚡ Courier riding Ather 450X EV • Zero tailpipe CO2 emission
            </div>
          </div>

          {/* Courier profile */}
          <div className="p-4 bg-cream-50/70 border-t border-cream-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-600 text-white flex items-center justify-center font-bold">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {order.deliveryPartnerName || 'Rohan Das (EV Fleet)'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {order.deliveryPartnerVehicle || 'Zero-Emission Electric Scooter'}
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Calling delivery courier ${order.deliveryPartnerName || 'Rohan'} at ${order.deliveryPartnerPhone || '+91 98444 55667'}`)}
              className="bg-white border border-cream-300 hover:bg-cream-100 text-slate-700 p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5 text-forest-600" />
              <span>Contact Courier</span>
            </button>
          </div>
        </div>

        {/* SDG Impact & Order Details Column */}
        <div className="md:col-span-4 space-y-6">
          {/* Order Sustainability Impact Card */}
          <div className="bg-forest-900 text-white rounded-3xl p-5 shadow-lg border border-forest-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Award className="w-4 h-4" />
              <span>Your SDG 12 Impact on this Order</span>
            </div>

            <div className="space-y-2.5 text-xs text-emerald-100/90">
              <div className="flex justify-between items-center bg-forest-800/80 p-2.5 rounded-xl border border-forest-700">
                <span>Reward Points Earned:</span>
                <span className="font-extrabold text-emerald-300 text-sm">
                  +{order.ecoPointsEarned || 45} pts
                </span>
              </div>

              {order.wasteSavedKg > 0 && (
                <div className="flex justify-between items-center bg-forest-800/80 p-2.5 rounded-xl border border-forest-700">
                  <span>Food Waste Prevented:</span>
                  <span className="font-extrabold text-amber-300">
                    ~{order.wasteSavedKg} kg
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center bg-forest-800/80 p-2.5 rounded-xl border border-forest-700">
                <span>Plastic Cutlery Avoided:</span>
                <span className="font-bold text-emerald-300">
                  {order.noCutlery ? 'Yes (Zero Waste)' : 'No'}
                </span>
              </div>

              <div className="flex justify-between items-center bg-forest-800/80 p-2.5 rounded-xl border border-forest-700">
                <span>Compostable Container:</span>
                <span className="font-bold text-emerald-300">
                  {order.ecoPackagingSelected ? '100% Plant-Based' : 'Standard'}
                </span>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="bg-white rounded-3xl p-5 border border-cream-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-xs border-b border-cream-200 pb-2">
              Items Ordered ({order.items?.length || 0})
            </h3>
            <div className="space-y-2 text-xs">
              {order.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-slate-700 truncate">
                    {it.quantity}x {it.name}
                  </span>
                  <span className="font-extrabold text-slate-900">₹{it.price * it.quantity}</span>
                </div>
              ))}
              <div className="border-t border-cream-200 pt-2 flex justify-between font-extrabold text-sm text-slate-900">
                <span>Total Paid</span>
                <span className="text-forest-700">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Review Form if Delivered */}
          {order.status === 'Delivered' && (
            <div className="bg-white rounded-3xl p-5 border border-cream-200 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-xs">Rate & Review Your Meal</h3>
              {order.rating || reviewSubmitted ? (
                <div className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl font-medium">
                  ✓ Thank you! Your review has been saved to the restaurant profile.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-600 block mb-1">Rating:</label>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setRatingScore(s)}
                          className="p-1 hover:scale-110 transition"
                        >
                          <Star className={`w-5 h-5 ${s <= ratingScore ? 'fill-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1">Your Feedback:</label>
                    <textarea
                      rows="2"
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      placeholder="How was the food and packaging?"
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-forest-600 hover:bg-forest-700 text-white font-bold py-2 rounded-xl transition"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
