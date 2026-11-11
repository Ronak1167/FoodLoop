import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  Bike,
  Leaf,
  Flame,
  Users,
  ShieldCheck,
  MapPin,
  MessageSquare,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import FoodCard from '../components/customer/FoodCard';
import SDGBadge from '../components/common/SDGBadge';
import { useAuth } from '../context/AuthContext';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'surplus' | 'reviews'

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    async function loadRestaurant() {
      try {
        const res = await api.getRestaurantById(id);
        setData(res);
        if (res.surplusDeals && res.surplusDeals.length > 0) {
          // If has surplus deals, default to showing them or keeping menu
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRestaurant();
  }, [id]);

  const handleStartGroupOrder = async () => {
    try {
      const res = await api.createGroupOrder({ restaurantId: id });
      if (res.groupOrder && res.groupOrder.groupCode) {
        navigate(`/group-order?code=${res.groupOrder.groupCode}`);
      }
    } catch (err) {
      alert('Could not create group order: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-64 bg-cream-200 rounded-3xl" />
        <div className="h-10 w-48 bg-cream-200 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="h-40 bg-cream-200 rounded-2xl" />
          <div className="h-40 bg-cream-200 rounded-2xl" />
          <div className="h-40 bg-cream-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data || !data.restaurant) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-800">Restaurant not found</h2>
        <button
          onClick={() => navigate('/restaurants')}
          className="mt-3 text-sm text-forest-600 font-bold hover:underline"
        >
          ← Back to restaurants
        </button>
      </div>
    );
  }

  const { restaurant, regularMenu = [], surplusDeals = [], reviews = [] } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl">
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={restaurant.bannerImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80'}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges on top */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <SDGBadge goal="12" size="sm" />
            {restaurant.ecoPackagingAvailable && (
              <span className="inline-flex items-center gap-1 bg-emerald-600/90 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md">
                <Leaf className="w-3 h-3" /> Eco-Packaging Certified
              </span>
            )}
          </div>

          {/* Content pinned to bottom */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                {restaurant.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {restaurant.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-1">
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" /> {restaurant.rating || 4.8} ({restaurant.totalRatings || 120} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-emerald-400" /> {restaurant.deliveryTime || '25-35 mins'}
                </span>
                <span className="flex items-center gap-1">
                  <Bike className="w-4 h-4 text-teal-400" /> ₹{restaurant.deliveryFee || 30} EV delivery
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5" /> {restaurant.address?.city || 'Gurugram'}
                </span>
              </div>
            </div>

            {/* Quick Actions (Group Order) */}
            <div className="shrink-0">
              <button
                onClick={handleStartGroupOrder}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-teal-300" />
                <span>Start Group Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-cream-200 pb-2">
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
            activeTab === 'menu'
              ? 'bg-forest-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-cream-100'
          }`}
        >
          All Menu Items ({regularMenu.length})
        </button>

        <button
          onClick={() => setActiveTab('surplus')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'surplus'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-orange-700 bg-orange-50 hover:bg-orange-100'
          }`}
        >
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>Food Rescue Deals ({surplusDeals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'reviews'
              ? 'bg-forest-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-cream-100'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Reviews ({reviews.length})</span>
        </button>
      </div>

      {/* Tab 1: Regular Menu */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularMenu.map((item) => (
              <FoodCard key={item._id} item={item} restaurant={restaurant} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Food Rescue Deals */}
      {activeTab === 'surplus' && (
        <div className="space-y-6">
          <div className="bg-orange-50/80 border border-orange-200 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                <Flame className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-orange-950">Food Rescue Deals Available</h3>
                <p className="text-xs text-orange-800">
                  These freshly made meals are certified safe under SDG 12 standards and sold at heavily discounted rates.
                </p>
              </div>
            </div>
          </div>

          {surplusDeals.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-cream-200 p-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No surplus deals right now</p>
              <p className="text-xs text-slate-400">All surplus food from this restaurant has been rescued today!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {surplusDeals.map((item) => (
                <FoodCard key={item._id} item={item} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Customer Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">What Customers Say</h3>
            <span className="text-xs text-slate-500">Verified dining & delivery reviews</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{rev.customerName}</span>
                  <div className="flex items-center text-amber-400 text-xs">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <div className="text-[10px] text-slate-400 pt-1">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
