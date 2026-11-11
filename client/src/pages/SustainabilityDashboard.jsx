import React, { useState } from 'react';
import {
  Leaf,
  Award,
  Flame,
  ShieldCheck,
  TrendingUp,
  Gift,
  TreeDeciduous,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SDGBadge from '../components/common/SDGBadge';

export default function SustainabilityDashboard() {
  const { user } = useAuth();
  const [redeemedCode, setRedeemedCode] = useState(null);

  const points = user?.rewardPoints || 340;
  const mealsRescued = user?.totalMealsRescued || 9;
  const wasteSavedKg = user?.totalWasteSavedKg || 4.1;
  const co2SavedKg = (wasteSavedKg * 2.5).toFixed(1);

  const getTier = (pts) => {
    if (pts >= 300) return { title: 'Climate Champion 🏆', color: 'text-amber-500', nextTier: 'Max Tier Achieved!' };
    if (pts >= 100) return { title: 'Green Guardian 🌿', color: 'text-emerald-600', nextTier: `${300 - pts} pts to Climate Champion` };
    return { title: 'Eco Seedling 🌱', color: 'text-teal-600', nextTier: `${100 - pts} pts to Green Guardian` };
  };

  const tier = getTier(points);

  const vouchers = [
    { id: 1, title: '₹50 Flat Discount on Any Order', cost: 100, code: 'ECO50' },
    { id: 2, title: '₹100 OFF on Food Rescue Deals', cost: 180, code: 'RESCUE100' },
    { id: 3, title: 'Free Eco-Packaging on Next 3 Orders', cost: 80, code: 'ZEROBOX' }
  ];

  const handleRedeem = (v) => {
    if (points < v.cost) {
      alert('Not enough reward points to redeem this voucher yet!');
      return;
    }
    setRedeemedCode({ ...v });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <SDGBadge goal="12" size="sm" />
            <SDGBadge goal="9" size="sm" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Your Sustainability Impact Scorecard
          </h1>

          <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
            Every conscious choice you make on FoodLoop—from rescuing surplus food to declining single-use cutlery—directly reduces methane emissions and conserves natural resources.
          </p>
        </div>
      </div>

      {/* Individual Impact Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-orange-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{mealsRescued}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Surplus Meals Rescued</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{wasteSavedKg} kg</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Food Waste Diverted</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <TreeDeciduous className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{co2SavedKg} kg</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">CO2 Emissions Avoided</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{points}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Sustainability Points</div>
          </div>
        </div>
      </div>

      {/* Tier Status Card */}
      <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Membership Rank</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              {tier.title}
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {tier.nextTier}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-cream-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-forest-600 to-emerald-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (points / 400) * 100)}%` }}
          />
        </div>
      </div>

      {/* Redeem Points Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Redeem Sustainability Points</h2>
            <p className="text-xs text-slate-500">Exchange your earned eco-points for real food order vouchers</p>
          </div>
          <span className="text-xs font-bold text-slate-600">Balance: {points} pts</span>
        </div>

        {redeemedCode && (
          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-xs font-bold text-emerald-950">Voucher Generated:</span>
                <span className="text-sm font-extrabold text-emerald-800 ml-2 font-mono bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {redeemedCode.code}
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-500">Apply at checkout</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vouchers.map((v) => (
            <div key={v.id} className="bg-white rounded-3xl border border-cream-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Gift className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{v.title}</h3>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 inline-block">
                  Requires {v.cost} pts
                </span>
              </div>

              <button
                onClick={() => handleRedeem(v)}
                disabled={points < v.cost}
                className="w-full bg-forest-600 hover:bg-forest-700 disabled:opacity-40 text-white font-bold py-2 rounded-xl text-xs transition"
              >
                {points >= v.cost ? 'Redeem Voucher' : 'Not Enough Points'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
