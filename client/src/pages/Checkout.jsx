import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Leaf,
  Utensils,
  Package,
  Award,
  CreditCard,
  QrCode,
  Wallet,
  Truck,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Checkout() {
  const {
    cartItems,
    currentRestaurant,
    noCutlery,
    setNoCutlery,
    ecoPackagingSelected,
    setEcoPackagingSelected,
    subtotal,
    deliveryFee,
    ecoPackagingFee,
    rescuedMealsCount,
    estimatedPoints,
    clearCart
  } = useCart();

  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [street, setStreet] = useState(user?.address?.street || '42 Lotus Boulevard, Tower 5');
  const [city, setCity] = useState(user?.address?.city || 'Gurugram');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '122002');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [tip, setTip] = useState(20);
  const [useRewardPoints, setUseRewardPoints] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900">Your cart is empty</h2>
        <p className="text-xs text-slate-500">Add regular meals or surplus food rescue deals to proceed.</p>
        <button
          onClick={() => navigate('/restaurants')}
          className="bg-forest-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm"
        >
          Explore Restaurants
        </button>
      </div>
    );
  }

  // Calculate points redemption
  const availablePoints = user?.rewardPoints || 0;
  // Maximum points usable (up to half the subtotal)
  const maxPointsUsable = Math.min(availablePoints, Math.floor(subtotal));
  const pointsDiscount = useRewardPoints ? Math.floor(maxPointsUsable / 2) : 0; // 10 pts = ₹5

  const totalPayable = Math.max(0, subtotal + deliveryFee + (ecoPackagingSelected ? ecoPackagingFee : 0) + tip - pointsDiscount);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!street || !city) {
      alert('Please fill out delivery address');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        restaurantId: currentRestaurant?._id,
        items: cartItems,
        deliveryAddress: { street, city, zipCode },
        paymentMethod,
        noCutlery,
        ecoPackagingSelected,
        tip,
        ecoPointsToRedeem: useRewardPoints ? maxPointsUsable : 0
      };

      const res = await api.createOrder(orderPayload);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      clearCart();
      await refreshUser();

      navigate(`/orders/${res.order._id}`);
    } catch (err) {
      alert('Failed to place order: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Sustainable Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your eco-delivery preferences, apply reward points, and confirm your order.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Columns: Forms & Eco Toggles */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Delivery Address */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-forest-600" />
              <span>Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ZIP / Postal Code</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Eco-Friendly Delivery Preferences (MAIN INNOVATION 3) */}
          <div className="bg-forest-50/80 p-5 sm:p-6 rounded-3xl border border-forest-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-extrabold text-forest-950 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-forest-600" />
                <span>SDG 12 Eco-Delivery Choices</span>
              </h2>
              <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-forest-200">
                +{estimatedPoints} Eco-Points Earnable
              </span>
            </div>

            <div className="space-y-3">
              {/* Cutlery */}
              <label className="flex items-start justify-between p-3 bg-white rounded-2xl border border-forest-200/80 cursor-pointer hover:border-forest-400 transition">
                <div className="flex items-start gap-2.5">
                  <Utensils className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Opt-out of single-use plastic cutlery
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block">
                      Help keep plastics out of landfills. We will inform the kitchen not to include disposable forks/spoons.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={noCutlery}
                  onChange={(e) => setNoCutlery(e.target.checked)}
                  className="w-4 h-4 text-forest-600 rounded accent-forest-600 mt-1"
                />
              </label>

              {/* Eco packaging */}
              <label className="flex items-start justify-between p-3 bg-white rounded-2xl border border-forest-200/80 cursor-pointer hover:border-forest-400 transition">
                <div className="flex items-start gap-2.5">
                  <Package className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      100% Biodegradable & Compostable Container Bag (+₹{ecoPackagingFee})
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block">
                      Plant-based bagasse / kraft fiber container certified zero micro-plastics.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={ecoPackagingSelected}
                  onChange={(e) => setEcoPackagingSelected(e.target.checked)}
                  className="w-4 h-4 text-forest-600 rounded accent-forest-600 mt-1"
                />
              </label>
            </div>
          </div>

          {/* Section 3: Payment Method Simulator */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-forest-600" />
              <span>Payment Mode (Sandbox Simulation)</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                { id: 'Card', label: 'Card', icon: CreditCard },
                { id: 'Wallet', label: 'Eco Wallet', icon: Wallet },
                { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Truck },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === m.id
                      ? 'bg-forest-50 border-forest-600 text-forest-900 font-bold shadow-sm'
                      : 'bg-cream-50 border-cream-200 text-slate-600 hover:bg-cream-100'
                  }`}
                >
                  <m.icon className="w-4 h-4" />
                  <span className="text-xs">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="bg-cream-50 p-3 rounded-2xl text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sandbox payment mode active. No actual credit card charge will occur.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Points Redemption */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-cream-200 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-cream-200 pb-3">
              Order Summary
            </h3>

            {/* Restaurant Info */}
            {currentRestaurant && (
              <div className="text-xs">
                <span className="text-slate-400">Ordering from:</span>
                <div className="font-extrabold text-slate-900 text-sm">{currentRestaurant.name}</div>
              </div>
            )}

            {/* Items list */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item._id || item.menuItemId} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-500 font-bold">{item.quantity}x</span>
                    <span className="font-medium text-slate-800 truncate">{item.name}</span>
                    {item.isSurplus && (
                      <span className="text-[9px] bg-orange-100 text-orange-800 font-extrabold px-1.5 rounded">
                        Rescue
                      </span>
                    )}
                  </div>
                  <span className="font-extrabold text-slate-800 shrink-0">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Sustainability Reward Points Redemption Card */}
            {availablePoints > 0 && (
              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Redeem Eco-Reward Points</span>
                  </div>
                  <span className="font-extrabold text-amber-800">{availablePoints} pts</span>
                </div>

                <label className="flex items-center justify-between text-xs text-amber-900 cursor-pointer pt-1">
                  <span>Use {maxPointsUsable} pts for ₹{Math.floor(maxPointsUsable / 2)} OFF</span>
                  <input
                    type="checkbox"
                    checked={useRewardPoints}
                    onChange={(e) => setUseRewardPoints(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded accent-amber-600"
                  />
                </label>
              </div>
            )}

            {/* Courier Green Tip */}
            <div className="text-xs space-y-1.5">
              <span className="font-bold text-slate-700">EV Courier Green Tip:</span>
              <div className="flex gap-2">
                {[0, 10, 20, 30].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setTip(amt)}
                    className={`flex-1 py-1 rounded-xl text-xs font-semibold border ${
                      tip === amt
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-cream-50 text-slate-700 border-cream-300'
                    }`}
                  >
                    {amt === 0 ? 'None' : `₹${amt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="border-t border-cream-200 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Zero-Emission EV Delivery</span>
                <span>₹{deliveryFee}</span>
              </div>
              {ecoPackagingSelected && (
                <div className="flex justify-between text-slate-600">
                  <span>Biodegradable Packaging</span>
                  <span>₹{ecoPackagingFee}</span>
                </div>
              )}
              {tip > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Courier Green Tip</span>
                  <span>₹{tip}</span>
                </div>
              )}
              {pointsDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Eco-Points Discount</span>
                  <span>-₹{pointsDiscount}</span>
                </div>
              )}
              <div className="border-t border-cream-200 pt-2 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-forest-700">₹{totalPayable}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-forest-600 hover:bg-forest-700 disabled:opacity-60 text-white font-extrabold py-3.5 px-4 rounded-2xl text-sm shadow-md transition flex items-center justify-between"
            >
              <span>{submitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
              <span className="flex items-center gap-1">
                ₹{totalPayable} <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
