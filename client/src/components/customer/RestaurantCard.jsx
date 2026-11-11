import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Bike, Leaf, Flame } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  const activeSurplusCount = Number(restaurant.activeSurplusDealsCount || 0);

  return (
    <Link
      to={`/restaurants/${restaurant._id}`}
      className="group bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-card hover:shadow-lift hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Banner */}
      <div className="relative h-48 w-full bg-cream-100 overflow-hidden">
        <img
          src={restaurant.bannerImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
        />

        {/* Gradient shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-slate-800">{restaurant.rating || 4.8}</span>
          <span className="text-[10px] text-slate-400">({restaurant.totalRatings || 120})</span>
        </div>

        {/* Eco Packaging Badge */}
        {restaurant.ecoPackagingAvailable && (
          <div className="absolute top-3 left-3 bg-forest-900/90 text-emerald-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1 shadow">
            <Leaf className="w-3 h-3 text-emerald-400" />
            <span>100% Eco-Packaging</span>
          </div>
        )}

        {/* Active Food Rescue Deals Indicator */}
        {activeSurplusCount > 0 && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-md flex items-center gap-1.5 animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>{activeSurplusCount} Food Rescue Deal{activeSurplusCount > 1 ? 's' : ''} Live</span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-baseline justify-between">
            <h3 className="font-extrabold text-slate-900 text-base group-hover:text-forest-600 transition line-clamp-1">
              {restaurant.name}
            </h3>
            <span className="text-xs font-bold text-slate-400">{restaurant.priceRange || '$$'}</span>
          </div>

          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {restaurant.cuisines ? restaurant.cuisines.join(' • ') : 'Eco Certified • Sustainable Kitchen'}
          </p>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>
        </div>

        {/* Footer info: Delivery time, fee, meals rescued count */}
        <div className="pt-3 border-t border-cream-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-forest-600" />
            <span>{restaurant.deliveryTime || '25-35 mins'}</span>
          </div>

          <div className="flex items-center gap-1 font-medium">
            <Bike className="w-3.5 h-3.5 text-slate-400" />
            <span>₹{restaurant.deliveryFee || 30} delivery</span>
          </div>

          <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            🌱 {restaurant.mealsRescuedCount || 100}+ rescued
          </div>
        </div>
      </div>
    </Link>
  );
}
