import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, Leaf, Package, Utensils, ArrowRight, Flame } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CartDrawer() {
  const {
    cartItems,
    currentRestaurant,
    noCutlery,
    setNoCutlery,
    ecoPackagingSelected,
    setEcoPackagingSelected,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    ecoPackagingFee,
    rescuedMealsCount,
    estimatedPoints,
    totalAmount
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-cream-200 flex items-center justify-between bg-cream-50/80">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Your Green Cart</h2>
              {currentRestaurant && (
                <p className="text-xs text-forest-700 font-semibold truncate max-w-[240px]">
                  from {currentRestaurant.name}
                </p>
              )}
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-cream-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-cream-100 mx-auto flex items-center justify-center text-slate-400">
                  <Utensils className="w-8 h-8" />
                </div>
                <p className="text-slate-600 font-medium text-sm">Your cart is empty.</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Add wholesome regular meals or rescue surplus food deals from top local restaurants!
                </p>
              </div>
            ) : (
              <>
                {/* Surplus Rescue Alert Banner */}
                {rescuedMealsCount > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-3 rounded-2xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                      <Flame className="w-4 h-4 fill-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-orange-900">
                        {rescuedMealsCount} Surplus Meal{rescuedMealsCount > 1 ? 's' : ''} in Cart!
                      </div>
                      <div className="text-[11px] text-orange-800">
                        You're saving ~{(rescuedMealsCount * 0.45).toFixed(1)}kg edible food from going to waste.
                      </div>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item._id || item.menuItemId}
                      className="p-3 rounded-2xl border border-cream-200 bg-cream-50/50 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {item.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-extrabold text-slate-800">
                            ₹{item.price * item.quantity}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            (₹{item.price} each)
                          </span>
                          {item.isSurplus && (
                            <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-1.5 py-0.2 rounded">
                              Rescue Deal
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1 bg-white border border-cream-300 rounded-xl px-1.5 py-1 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item._id || item.menuItemId, item.quantity - 1)}
                          className="p-1 text-slate-500 hover:text-slate-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id || item.menuItemId, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:text-slate-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart Button */}
                <div className="text-right">
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-500 hover:text-red-700 inline-flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3 h-3" /> Clear Cart
                  </button>
                </div>

                {/* Eco-Friendly Delivery Preferences (MAIN INNOVATION 3) */}
                <div className="bg-forest-50/70 border border-forest-200/80 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-forest-900">
                    <Leaf className="w-4 h-4 text-forest-600" />
                    <span>Eco-Friendly Choices (SDG 12)</span>
                  </div>

                  {/* Cutlery Toggle */}
                  <label className="flex items-center justify-between text-xs cursor-pointer p-1 rounded hover:bg-forest-100/50 transition">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-3.5 h-3.5 text-slate-500" />
                      <div>
                        <div className="font-semibold text-slate-800">Don't include plastic cutlery</div>
                        <div className="text-[10px] text-emerald-700 font-medium">Earn +15 sustainability points</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={noCutlery}
                      onChange={(e) => setNoCutlery(e.target.checked)}
                      className="w-4 h-4 rounded text-forest-600 focus:ring-forest-500 accent-forest-600"
                    />
                  </label>

                  {/* Eco-Packaging Toggle */}
                  <label className="flex items-center justify-between text-xs cursor-pointer p-1 rounded hover:bg-forest-100/50 transition">
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-slate-500" />
                      <div>
                        <div className="font-semibold text-slate-800">Compostable & Eco Packaging</div>
                        <div className="text-[10px] text-emerald-700 font-medium">+₹15 fee • Earn +10 sustainability points</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={ecoPackagingSelected}
                      onChange={(e) => setEcoPackagingSelected(e.target.checked)}
                      className="w-4 h-4 rounded text-forest-600 focus:ring-forest-500 accent-forest-600"
                    />
                  </label>

                  {/* Total Reward Points Nudge */}
                  <div className="pt-2 border-t border-forest-200/60 flex items-center justify-between text-xs text-forest-900 font-bold">
                    <span>Reward Points for this order:</span>
                    <span className="bg-forest-600 text-white px-2 py-0.5 rounded-full text-[11px]">
                      +{estimatedPoints} Eco-Pts 🌱
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-cream-50 p-3.5 rounded-2xl border border-cream-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Item Subtotal</span>
                    <span className="font-semibold text-slate-800">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>EV Delivery Fee</span>
                    <span className="font-semibold text-slate-800">₹{deliveryFee}</span>
                  </div>
                  {ecoPackagingSelected && (
                    <div className="flex justify-between text-slate-600">
                      <span>Eco Packaging Fee</span>
                      <span className="font-semibold text-slate-800">₹{ecoPackagingFee}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-cream-200 flex justify-between text-sm font-extrabold text-slate-900">
                    <span>To Pay</span>
                    <span className="text-forest-700">₹{totalAmount}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-cream-200 bg-white">
              <button
                onClick={handleCheckout}
                className="w-full bg-forest-600 hover:bg-forest-700 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-between transition hover:shadow-lg"
              >
                <span>Proceed to Sustainable Checkout</span>
                <span className="flex items-center gap-1">
                  ₹{totalAmount} <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
