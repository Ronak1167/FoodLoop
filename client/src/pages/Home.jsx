import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  Sparkles,
  Leaf,
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  Star,
  Clock,
  Compass,
  Bike
} from 'lucide-react';
import { api } from '../services/api';
import SDGBadge from '../components/common/SDGBadge';
import FoodCard from '../components/customer/FoodCard';
import RestaurantCard from '../components/customer/RestaurantCard';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [surplusDeals, setSurplusDeals] = useState([]);
  const [rescueStats, setRescueStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [restRes, dealsRes, statsRes, catRes] = await Promise.all([
          api.getRestaurants(),
          api.getSurplusDeals(),
          api.getRescueStats(),
          api.getCategories()
        ]);
        if (restRes.restaurants) setRestaurants(restRes.restaurants.slice(0, 4));
        if (dealsRes.deals) setSurplusDeals(dealsRes.deals.slice(0, 4));
        if (statsRes.stats) setRescueStats(statsRes.stats);
        if (catRes.categories) setCategories(catRes.categories);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/restaurants');
    }
  };

  return (
    <div className="space-y-14 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-white pt-10 pb-16 sm:pb-24 border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <SDGBadge goal="12" size="md" />
                <SDGBadge goal="9" size="md" />
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Delicious Food Delivery. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-700 via-emerald-600 to-teal-600">
                  Zero Waste. True Impact.
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
                Order fresh meals from your favorite restaurants, rescue safe surplus dishes at up to
                <span className="font-bold text-orange-600"> 60% OFF</span>, and choose zero-plastic delivery on zero-emission electric vehicles.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative max-w-lg">
                <div className="flex items-center bg-white rounded-2xl shadow-lift border border-cream-300 p-2 focus-within:border-emerald-500 transition">
                  <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search dishes, salads, sourdough, curries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-forest-600 hover:bg-forest-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-sm shrink-0"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Quick Feature Badges */}
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Surplus Deals up to 60% OFF</span>
                </div>
                <div className="flex items-center gap-1.5 bg-cream-200 text-slate-800 px-3 py-1.5 rounded-xl border border-cream-300">
                  <Bike className="w-4 h-4 text-forest-600" />
                  <span>100% Zero-Carbon EV Couriers</span>
                </div>
                <div className="flex items-center gap-1.5 bg-teal-50 text-teal-800 px-3 py-1.5 rounded-xl border border-teal-200">
                  <Users className="w-4 h-4 text-teal-600" />
                  <span>Split-Bill Group Ordering</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Graphic Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Food Photo */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-cream-200 relative">
                  <img
                    src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
                    alt="Fresh organic grain bowl"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                      Chef's Daily Rescue Special
                    </div>
                    <div className="text-lg font-bold">Sunset Quinoa & Roasted Veg Bowl</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-emerald-400 font-extrabold text-sm">₹150</span>
                      <span className="text-xs text-slate-300 line-through">₹320</span>
                      <span className="text-[10px] bg-orange-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                        53% OFF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Impact Pill */}
                <div className="absolute -top-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lift border border-cream-200 flex items-center gap-3 float-slow">
                  <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-700">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">SDG 12 Impact Verified</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">1,740+ kg food waste diverted</div>
                  </div>
                </div>

                {/* Floating EV Delivery Badge */}
                <div className="absolute -bottom-4 -left-2 sm:-left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lift border border-cream-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Green EV Couriers</div>
                    <div className="text-[11px] text-slate-500">Zero tailpipe emissions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live SDG Impact Counter Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-forest-800">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live Collective Impact Ticker
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold mt-1">
              Building a Responsible Food System Together
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3 rounded-2xl bg-forest-800/60 border border-forest-700">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
                {rescueStats ? rescueStats.totalMealsRescued : '1,745'}+
              </div>
              <div className="text-xs text-emerald-100/80 font-medium mt-1">
                Meals Rescued
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-forest-800/60 border border-forest-700">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
                {rescueStats ? rescueStats.totalWasteKg : '785.2'} kg
              </div>
              <div className="text-xs text-emerald-100/80 font-medium mt-1">
                Food Waste Prevented
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-forest-800/60 border border-forest-700">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">
                {rescueStats ? rescueStats.totalCo2SavedKg : '1,963'} kg
              </div>
              <div className="text-xs text-emerald-100/80 font-medium mt-1">
                CO2 Emissions Avoided
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-forest-800/60 border border-forest-700">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                100%
              </div>
              <div className="text-xs text-emerald-100/80 font-medium mt-1">
                Zero Plastic Packaging
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Horizontal Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Explore by Category</h2>
          <Link to="/restaurants" className="text-xs font-semibold text-forest-700 hover:underline">
            View all categories →
          </Link>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <Link
              key={cat.slug || cat._id}
              to={cat.slug === 'surplus' ? '/food-rescue' : `/restaurants?cuisine=${encodeURIComponent(cat.name)}`}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-2xl border border-cream-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition shrink-0 group"
            >
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-forest-600 whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* MAIN INNOVATION 1: FOOD RESCUE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-amber-500/10 via-orange-50 to-cream-50 border border-orange-200/80 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <Flame className="w-3.5 h-3.5 fill-white" /> Innovation 1: Food Rescue
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Surplus Food Deals
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mt-1">
                Safe, freshly cooked meals from top kitchens at up to 60% discount. Grab before the rescue countdown ends!
              </p>
            </div>
            <Link
              to="/food-rescue"
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0"
            >
              <span>Explore All Rescue Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Surplus Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {surplusDeals.map((deal) => (
              <FoodCard key={deal._id} item={deal} />
            ))}
          </div>
        </div>
      </section>

      {/* MAIN INNOVATION 2: SMART RECOMMENDATIONS TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-forest-900 to-teal-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Innovation 2: Smart Recommendations
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Got a strict budget? <br />Let our Smart Food Finder decide.
            </h2>
            <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed">
              Tell us how much you want to spend (e.g. ₹200 or ₹350) and your dietary preferences.
              Our algorithmic matcher scans surplus discounts, restaurant ratings, and nutritional value to find your ideal meal!
            </p>
            <div className="pt-2">
              <Link
                to="/smart-finder"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-sm transition shadow-lg"
              >
                <span>Launch Smart Food Finder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Eco-Certified Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Featured Sustainable Restaurants</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Certified zero single-use plastic with compostable packaging options
            </p>
          </div>
          <Link to="/restaurants" className="text-xs sm:text-sm font-bold text-forest-700 hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* MAIN INNOVATION 4: GROUP ORDERING CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-card grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              <Users className="w-3.5 h-3.5 text-teal-600" /> Innovation 4: Group Ordering & Split Bill
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Ordering with Friends or Coworkers?
            </h3>
            <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
              Create a group order, share a quick 4-letter joining code, and let everyone pick their meals on their own phones.
              FoodLoop combines everything into a single eco-delivery and automatically splits the bill!
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3">
            <Link
              to="/group-order"
              className="w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-sm"
            >
              Create Group Order
            </Link>
            <Link
              to="/group-order"
              className="w-full text-center bg-cream-100 hover:bg-cream-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm border border-cream-300 transition"
            >
              Join with Code
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
