import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, Clock, Flame, Leaf, RotateCcw } from 'lucide-react';
import { api } from '../services/api';
import RestaurantCard from '../components/customer/RestaurantCard';

export default function Restaurants() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get('cuisine') || 'all');
  const [minRating, setMinRating] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [hasSurplus, setHasSurplus] = useState(searchParams.get('hasSurplus') === 'true');
  const [sortBy, setSortBy] = useState('rating');

  const cuisinesList = [
    'all',
    'Healthy Bowls',
    'Artisan Bakery',
    'North Indian',
    'Italian',
    'Vegan',
    'Salads'
  ];

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (selectedCuisine && selectedCuisine !== 'all') queryParams.append('cuisine', selectedCuisine);
      if (minRating) queryParams.append('rating', minRating);
      if (priceRange && priceRange !== 'all') queryParams.append('priceRange', priceRange);
      if (hasSurplus) queryParams.append('hasSurplus', 'true');

      const res = await api.getRestaurants(queryParams.toString());
      if (res.restaurants) {
        let list = [...res.restaurants];
        if (sortBy === 'rating') {
          list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'rescued') {
          list.sort((a, b) => (b.mealsRescuedCount || 0) - (a.mealsRescuedCount || 0));
        } else if (sortBy === 'delivery_time') {
          list.sort((a, b) => (a.deliveryFee || 0) - (b.deliveryFee || 0));
        }
        setRestaurants(list);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [selectedCuisine, minRating, priceRange, hasSurplus, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRestaurants();
  };

  const handleReset = () => {
    setSearch('');
    setSelectedCuisine('all');
    setMinRating('');
    setPriceRange('all');
    setHasSurplus(false);
    setSortBy('rating');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Sustainable Restaurants
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Discover certified kitchens practicing zero food waste and eco-packaging across the city.
        </p>
      </div>

      {/* Search & Quick Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-cream-200 shadow-sm space-y-4">
        {/* Search row */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by restaurant name, food, or cuisine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-cream-50 rounded-xl border border-cream-300 focus:bg-white focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
          <button
            type="submit"
            className="bg-forest-600 hover:bg-forest-700 text-white font-bold px-5 py-2 rounded-xl text-sm transition"
          >
            Search
          </button>
        </form>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-cream-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Surplus Deals Toggle Button */}
            <button
              type="button"
              onClick={() => setHasSurplus(!hasSurplus)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                hasSurplus
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-cream-100 text-slate-700 border-cream-300 hover:bg-cream-200'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${hasSurplus ? 'fill-white' : 'text-orange-500'}`} />
              <span>Has Food Rescue Deals</span>
            </button>

            {/* Rating Filter */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="text-xs font-medium bg-cream-100 text-slate-700 border border-cream-300 rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="">Any Rating</option>
              <option value="4.8">4.8+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
            </select>

            {/* Price Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="text-xs font-medium bg-cream-100 text-slate-700 border border-cream-300 rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="all">Any Price</option>
              <option value="$">₹ Budget ($)</option>
              <option value="$$">₹₹ Moderate ($$)</option>
              <option value="$$$">₹₹₹ Premium ($$$)</option>
            </select>

            {/* Reset */}
            {(search || selectedCuisine !== 'all' || minRating || priceRange !== 'all' || hasSurplus) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 ml-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="font-bold text-slate-800 bg-cream-100 border border-cream-300 rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="rating">Top Rated</option>
              <option value="rescued">Most Meals Rescued</option>
              <option value="delivery_time">Lowest Delivery Fee</option>
            </select>
          </div>
        </div>

        {/* Cuisines horizontal selector */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none">
          {cuisinesList.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCuisine(c)}
              className={`text-xs px-3 py-1 rounded-xl whitespace-nowrap capitalize transition ${
                selectedCuisine === c
                  ? 'bg-forest-600 text-white font-bold shadow-sm'
                  : 'bg-cream-100 text-slate-600 hover:bg-cream-200'
              }`}
            >
              {c === 'all' ? 'All Cuisines' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-72 bg-cream-200 rounded-2xl" />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-cream-200 p-8 space-y-3">
          <Leaf className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No restaurants match your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your filters or searching for another cuisine or dish name.
          </p>
          <button
            onClick={handleReset}
            className="text-xs font-bold bg-forest-600 text-white px-4 py-2 rounded-xl mt-2"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}
