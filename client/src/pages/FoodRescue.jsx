import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  ShieldCheck,
  Leaf,
  Filter,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import FoodCard from '../components/customer/FoodCard';
import SDGBadge from '../components/common/SDGBadge';

export default function FoodRescue() {
  const [deals, setDeals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(400);
  const [isVeg, setIsVeg] = useState('all');

  useEffect(() => {
    async function loadRescueData() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory !== 'all') queryParams.append('category', selectedCategory);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (isVeg !== 'all') queryParams.append('isVeg', isVeg);

        const [dealsRes, statsRes] = await Promise.all([
          api.getSurplusDeals(queryParams.toString()),
          api.getRescueStats()
        ]);

        if (dealsRes.deals) setDeals(dealsRes.deals);
        if (statsRes.stats) setStats(statsRes.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRescueData();
  }, [selectedCategory, maxPrice, isVeg]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 sm:p-10 shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              <Flame className="w-3.5 h-3.5 fill-white" /> Main Innovation 1
            </span>
            <SDGBadge goal="12" size="sm" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Food Rescue Marketplace
          </h1>

          <p className="text-orange-100 text-sm sm:text-base leading-relaxed">
            Every day, top premium kitchens prepare surplus edible meals that are 100% fresh and safe,
            yet would otherwise go to waste at closing time. Through FoodLoop, restaurants list these
            surplus batches at up to <span className="font-extrabold text-white underline">65% OFF</span>.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-orange-100">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> FSSAI Certified Safe
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl">
              <Clock className="w-4 h-4 text-amber-200" /> Strict 4-Hour Rescue Window
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl">
              <Leaf className="w-4 h-4 text-green-300" /> Saves Food & Saves Money
            </div>
          </div>
        </div>
      </div>

      {/* Live Impact Counters for Rescue */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center">
          <div className="text-2xl font-extrabold text-orange-600">
            {stats ? stats.totalMealsRescued : '1,745'}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Total Meals Rescued</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center">
          <div className="text-2xl font-extrabold text-forest-700">
            {stats ? stats.totalWasteKg : '785.2'} kg
          </div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Food Waste Prevented</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center">
          <div className="text-2xl font-extrabold text-teal-700">
            {stats ? stats.totalCo2SavedKg : '1,963'} kg
          </div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">CO2 Emissions Prevented</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center">
          <div className="text-2xl font-extrabold text-blue-600">
            {stats ? stats.waterSavedLiters?.toLocaleString() : '314,000'} L
          </div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Water Footprint Conserved</div>
        </div>
      </div>

      {/* Food Safety & How It Works Accordion */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-950">
          <ShieldCheck className="w-5 h-5 text-amber-700" />
          <span>FoodLoop Safe Surplus Standards & Food Quality Charter</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-amber-900/90 leading-relaxed">
          <div className="p-3 bg-white/60 rounded-xl border border-amber-200/50">
            <strong>1. Same-Day Fresh Prep:</strong> Listed surplus meals are cooked during the same shift (lunch/dinner) and inspected before listing.
          </div>
          <div className="p-3 bg-white/60 rounded-xl border border-amber-200/50">
            <strong>2. Cold/Hot Chain Control:</strong> Cold items are sealed below 4°C, hot items are preserved above 65°C until pickup.
          </div>
          <div className="p-3 bg-white/60 rounded-xl border border-amber-200/50">
            <strong>3. Automatic Auto-Expiry:</strong> When the rescue countdown reaches zero or available quantity is exhausted, the listing is instantly removed.
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Diet toggle */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Diet:</span>
          <button
            onClick={() => setIsVeg('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              isVeg === 'all' ? 'bg-forest-600 text-white shadow-sm' : 'bg-cream-100 text-slate-700 hover:bg-cream-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setIsVeg('true')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              isVeg === 'true' ? 'bg-green-600 text-white shadow-sm' : 'bg-cream-100 text-slate-700 hover:bg-cream-200'
            }`}
          >
            Veg Only
          </button>
        </div>

        {/* Max price slider */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 font-semibold">Max Price:</span>
          <input
            type="range"
            min="80"
            max="500"
            step="20"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-32 accent-orange-500"
          />
          <span className="font-extrabold text-orange-600">₹{maxPrice}</span>
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-cream-100 border border-cream-300 font-bold text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Surplus Deals">Surplus Deals</option>
            <option value="Healthy Bowls">Healthy Bowls</option>
            <option value="Artisan Bakery">Artisan Bakery</option>
            <option value="North Indian">North Indian</option>
          </select>
        </div>
      </div>

      {/* Deals Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 bg-cream-200 rounded-2xl" />
          ))}
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-cream-200 p-8 space-y-3">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">All Surplus Meals Rescued!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Awesome! Every surplus meal in this price range has been rescued by mindful consumers today. Check back during afternoon or dinner shifts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <FoodCard key={deal._id} item={deal} />
          ))}
        </div>
      )}
    </div>
  );
}
