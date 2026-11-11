import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  Flame,
  CheckCircle,
  HelpCircle,
  Leaf,
  Star,
  ArrowRight,
  TrendingUp,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import FoodCard from '../components/customer/FoodCard';
import SDGBadge from '../components/common/SDGBadge';

export default function SmartFinder() {
  const [budget, setBudget] = useState(300);
  const [preference, setPreference] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [cuisine, setCuisine] = useState('all');
  const [sortBy, setSortBy] = useState('smart_score'); // 'smart_score' | 'price_asc' | 'rating' | 'rescue_first'

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        budget,
        preference,
        cuisine,
        sortBy
      });

      const res = await api.getRecommendations(queryParams.toString());
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [budget, preference, cuisine, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-teal-900 via-forest-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Main Innovation 2
            </span>
            <SDGBadge goal="9" size="sm" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Budget-Based Smart Food Finder
          </h1>

          <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
            Specify your exact budget and taste preference. Our intelligent recommendation algorithm matches
            high-nutrition meals, verified safe surplus deals, and top restaurant ratings to deliver the best value per rupee!
          </p>
        </div>
      </div>

      {/* Interactive Control Panel */}
      <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-cream-200 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-forest-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Your Preference Parameters</h2>
          </div>
          <span className="text-xs text-slate-400">Updates matches dynamically</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Budget Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Target Budget:</span>
              <span className="font-extrabold text-base text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded-lg border border-forest-200">
                ₹{budget}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="600"
              step="25"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-forest-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>₹100 (Pocket-friendly)</span>
              <span>₹350 (Balanced)</span>
              <span>₹600 (Gourmet)</span>
            </div>
          </div>

          {/* 2. Dietary Preference */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Dietary Preference:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPreference('all')}
                className={`text-xs py-2 px-2 rounded-xl font-bold transition border ${
                  preference === 'all'
                    ? 'bg-forest-600 text-white border-forest-600 shadow-sm'
                    : 'bg-cream-50 text-slate-700 border-cream-300 hover:bg-cream-100'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setPreference('veg')}
                className={`text-xs py-2 px-2 rounded-xl font-bold transition border ${
                  preference === 'veg'
                    ? 'bg-green-600 text-white border-green-600 shadow-sm'
                    : 'bg-cream-50 text-slate-700 border-cream-300 hover:bg-cream-100'
                }`}
              >
                🌱 Veg Only
              </button>
              <button
                type="button"
                onClick={() => setPreference('non-veg')}
                className={`text-xs py-2 px-2 rounded-xl font-bold transition border ${
                  preference === 'non-veg'
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-cream-50 text-slate-700 border-cream-300 hover:bg-cream-100'
                }`}
              >
                🍗 Non-Veg
              </button>
            </div>
          </div>

          {/* 3. Sorting & Cuisine */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Ranking Algorithm:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-xs font-semibold bg-cream-50 text-slate-800 border border-cream-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-forest-600"
            >
              <option value="smart_score">Smart Fit Score (Budget + Rating + SDG 12)</option>
              <option value="rescue_first">Food Rescue Surplus Deals First</option>
              <option value="price_asc">Price: Lowest to Highest</option>
              <option value="rating">Restaurant Rating (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Algorithm Transparency Pill */}
      <div className="bg-forest-50/70 border border-forest-200/80 p-3.5 rounded-2xl flex items-start gap-3 text-xs text-forest-900">
        <Info className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Algorithmic Scoring Breakdown: </span>
          Each dish is scored on budget utilization (avoiding over-spending), restaurant cleanliness & rating (+20 pts), and SDG 12 surplus waste prevention (+35 pts priority).
        </div>
      </div>

      {/* Results Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 bg-cream-200 rounded-2xl" />
          ))}
        </div>
      ) : !data || (data.topPicks.length === 0 && data.rescuePicks.length === 0) ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-cream-200 p-8 space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No meals found within ₹{budget}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try increasing your budget slider to ₹250 or ₹350 to see recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Section 1: Top Algorithmic Picks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>Top Algorithmic Matches within ₹{budget}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Best composite score for nutrition, taste, and value
                </p>
              </div>
              <span className="text-xs font-bold text-forest-700 bg-forest-50 px-2.5 py-1 rounded-full">
                {data.topPicks.length} Matches Found
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.topPicks.map((item) => (
                <div key={item._id} className="relative">
                  {item.matchReasons && item.matchReasons[0] && (
                    <div className="mb-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md truncate">
                      ✓ {item.matchReasons[0]}
                    </div>
                  )}
                  <FoodCard item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Best Surplus Rescue Bargains within Budget */}
          {data.rescuePicks && data.rescuePicks.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-cream-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-orange-950 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                    <span>Food Rescue Surplus Deals (Highest Savings)</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Rescued meals from top kitchens at massive discounts under your budget
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.rescuePicks.map((item) => (
                  <FoodCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Super Savers (Under 65% of budget) */}
          {data.superSavers && data.superSavers.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-cream-200">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Pocket Savers (Extra Savings)
                </h2>
                <p className="text-xs text-slate-500">
                  Great meals that leave plenty of cash in your wallet (Under ₹{Math.round(budget * 0.65)})
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.superSavers.map((item) => (
                  <FoodCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
