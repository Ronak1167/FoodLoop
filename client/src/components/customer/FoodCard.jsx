import React, { useState } from 'react';
import { Plus, Minus, Flame, Clock, ShieldCheck, Leaf, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function FoodCard({ item, restaurant }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  const cartItem = cartItems.find(i => (i._id === item._id || i.menuItemId === item._id));
  const quantity = cartItem ? cartItem.quantity : 0;

  const isSurplus = Boolean(item.isSurplus);
  const isOutOfStock = isSurplus && Number(item.surplusQuantity) <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(item, restaurant);
  };

  return (
    <div className={`relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
      isSurplus
        ? 'border-orange-200/80 shadow-md shadow-orange-500/5 hover:border-orange-300 hover:shadow-lg'
        : 'border-cream-200 shadow-sm hover:shadow-md hover:border-emerald-300'
    }`}>
      {/* Food Rescue Top Banner */}
      {isSurplus && (
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white text-[11px] font-bold px-3 py-1 flex items-center justify-between">
          <span className="flex items-center gap-1 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-white" /> Food Rescue Deal
          </span>
          <span className="bg-white/20 px-2 py-0.2 rounded-full font-extrabold">
            {item.discountPercentage}% OFF
          </span>
        </div>
      )}

      {/* Image & Badges */}
      <div className="relative h-44 w-full bg-cream-100 overflow-hidden group">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1 rounded-md shadow">
          <div className={`w-3.5 h-3.5 border flex items-center justify-center ${
            item.isVeg ? 'border-green-600' : 'border-red-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              item.isVeg ? 'bg-green-600' : 'bg-red-600'
            }`} />
          </div>
        </div>

        {/* Deadline Countdown for Surplus */}
        {isSurplus && item.surplusDeadline && (
          <div className="absolute bottom-2 left-2 bg-slate-900/90 text-white text-[11px] px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1.5 shadow">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Rescue window: ~{item.hoursRemaining || 3} hrs</span>
          </div>
        )}

        {/* Portions left */}
        {isSurplus && (
          <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            {isOutOfStock ? 'Sold Out' : `${item.surplusQuantity} left`}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug line-clamp-1">
              {item.name}
            </h3>
            {isSurplus && (
              <button
                onClick={() => setShowSafetyModal(!showSafetyModal)}
                className="text-slate-400 hover:text-emerald-600 p-0.5"
                title="View food preparation & safety information"
              >
                <Info className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Safety & Prep Dropdown Info */}
        {showSafetyModal && isSurplus && (
          <div className="bg-amber-50/90 border border-amber-200 p-2.5 rounded-xl text-xs space-y-1 animate-in fade-in">
            <div className="flex items-center gap-1 font-semibold text-amber-900 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> Safety & Prep Assurance:
            </div>
            <p className="text-[11px] text-amber-800 leading-tight">
              {item.preparationInfo || 'Prepared fresh today and kept in temperature-controlled hygiene.'}
            </p>
            <p className="text-[10px] text-emerald-800 font-medium">
              ✓ {item.safetyGuarantee || 'FSSAI Certified Safe Surplus Meal'}
            </p>
          </div>
        )}

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-cream-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900">
                ₹{item.price}
              </span>
              {isSurplus && item.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{item.originalPrice}
                </span>
              )}
            </div>
            {isSurplus && (
              <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5">
                <Leaf className="w-2.5 h-2.5" /> Saves ~{item.estimatedWasteKg || 0.45}kg food
              </span>
            )}
          </div>

          {/* Add / Quantity Buttons */}
          <div>
            {isOutOfStock ? (
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl">
                Unavailable
              </span>
            ) : quantity > 0 ? (
              <div className="flex items-center bg-forest-50 border border-forest-300 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => updateQuantity(item._id, quantity - 1)}
                  className="p-1.5 hover:bg-forest-200 text-forest-800 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs font-bold text-forest-900">
                  {quantity}
                </span>
                <button
                  onClick={() => {
                    if (isSurplus && quantity >= item.surplusQuantity) return;
                    updateQuantity(item._id, quantity + 1);
                  }}
                  disabled={isSurplus && quantity >= item.surplusQuantity}
                  className="p-1.5 hover:bg-forest-200 text-forest-800 transition disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm transition flex items-center gap-1 ${
                  isSurplus
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
                    : 'bg-forest-600 hover:bg-forest-700 text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
