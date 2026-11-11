import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, ShieldCheck, Sparkles, Flame, Users, Bike } from 'lucide-react';
import SDGBadge from './SDGBadge';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-forest-600 flex items-center justify-center text-white font-bold">
                <Leaf className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Food<span className="text-emerald-400">Loop</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              FoodLoop is India's first smart and sustainable food delivery platform engineered around
              <strong> SDG 12: Responsible Consumption</strong> and <strong>SDG 9: Sustainable Infrastructure</strong>.
              Rescuing safe surplus meals, eliminating single-use plastics, and driving zero-carbon electric deliveries.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <SDGBadge goal="12" size="sm" />
              <SDGBadge goal="9" size="sm" />
            </div>
          </div>

          {/* Platform Innovations */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Innovations</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/food-rescue" className="hover:text-emerald-400 flex items-center gap-1.5 transition">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> Food Rescue Deals
                </Link>
              </li>
              <li>
                <Link to="/smart-finder" className="hover:text-emerald-400 flex items-center gap-1.5 transition">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Budget Food Finder
                </Link>
              </li>
              <li>
                <Link to="/group-order" className="hover:text-emerald-400 flex items-center gap-1.5 transition">
                  <Users className="w-3.5 h-3.5 text-teal-400" /> Group Ordering & Split
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="hover:text-emerald-400 flex items-center gap-1.5 transition">
                  <Leaf className="w-3.5 h-3.5 text-green-400" /> Eco-Reward Scorecard
                </Link>
              </li>
            </ul>
          </div>

          {/* Role Hubs */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/restaurants" className="hover:text-emerald-400 transition">
                  Customer Directory
                </Link>
              </li>
              <li>
                <Link to="/restaurant-dashboard" className="hover:text-emerald-400 transition">
                  Restaurant Owner Hub
                </Link>
              </li>
              <li>
                <Link to="/delivery-dashboard" className="hover:text-emerald-400 transition">
                  Delivery Partner EV Fleet
                </Link>
              </li>
              <li>
                <Link to="/admin-dashboard" className="hover:text-emerald-400 transition">
                  Platform Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Compliance */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Food Safety</h4>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> 100% Quality Inspected
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                All surplus food rescue listings comply with strict FSSAI guidelines, cold-chain checks, and maximum 4-hour rescue collection windows.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FoodLoop Technologies Inc. Built with commitment to United Nations SDG Goals 12 & 9.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-slate-400 cursor-pointer">Food Safety Standards</span>
            <span className="hover:text-slate-400 cursor-pointer">Zero Plastic Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
