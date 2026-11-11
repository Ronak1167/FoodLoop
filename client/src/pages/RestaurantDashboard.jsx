import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  Flame,
  Plus,
  Trash2,
  Edit2,
  Clock,
  DollarSign,
  TrendingUp,
  Leaf,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Package
} from 'lucide-react';
import { api } from '../services/api';
import SDGBadge from '../components/common/SDGBadge';

export default function RestaurantDashboard() {
  const [restaurantData, setRestaurantData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu' | 'surplus' | 'analytics'

  // Modal for new / edit item
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSurplusDeal, setIsSurplusDeal] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('Main Course');
  const [itemImage, setItemImage] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemIsVeg, setItemIsVeg] = useState(true);
  // Surplus specific fields
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('50');
  const [surplusQty, setSurplusQty] = useState('5');
  const [deadlineHours, setDeadlineHours] = useState('4');
  const [prepInfo, setPrepInfo] = useState('');

  const loadDashboardData = async () => {
    try {
      const [restRes, analyticsRes, ordersRes] = await Promise.all([
        api.getMyRestaurant(),
        api.getMyAnalytics(),
        api.getRestaurantOrders()
      ]);
      setRestaurantData(restRes);
      if (analyticsRes.analytics) setAnalytics(analyticsRes.analytics);
      if (ordersRes.orders) setOrders(ordersRes.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const openAddItemModal = (isSurplus = false) => {
    setEditingItem(null);
    setIsSurplusDeal(isSurplus);
    setItemName('');
    setItemPrice(isSurplus ? '150' : '280');
    setItemCategory(isSurplus ? 'Surplus Deals' : 'Main Course');
    setItemImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80');
    setItemDescription('');
    setItemIsVeg(true);
    setOriginalPrice(isSurplus ? '300' : '');
    setDiscountPercent('50');
    setSurplusQty('5');
    setDeadlineHours('4');
    setPrepInfo(isSurplus ? 'Cooked fresh during lunch service at 12:30 PM. Blast-chilled and sealed.' : '');
    setShowItemModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsSurplusDeal(Boolean(item.isSurplus));
    setItemName(item.name);
    setItemPrice(String(item.price));
    setItemCategory(item.category || 'Main Course');
    setItemImage(item.image || '');
    setItemDescription(item.description || '');
    setItemIsVeg(Boolean(item.isVeg));
    setOriginalPrice(String(item.originalPrice || ''));
    setDiscountPercent(String(item.discountPercentage || '50'));
    setSurplusQty(String(item.surplusQuantity || '5'));
    setDeadlineHours('4');
    setPrepInfo(item.preparationInfo || '');
    setShowItemModal(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      const deadline = isSurplusDeal
        ? new Date(Date.now() + Number(deadlineHours) * 60 * 60 * 1000).toISOString()
        : null;

      const payload = {
        name: itemName,
        price: Number(itemPrice),
        category: itemCategory,
        image: itemImage,
        description: itemDescription,
        isVeg: itemIsVeg,
        isSurplus: isSurplusDeal,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        discountPercentage: isSurplusDeal ? Number(discountPercent) : 0,
        surplusQuantity: isSurplusDeal ? Number(surplusQty) : 0,
        surplusDeadline: deadline,
        preparationInfo: prepInfo,
        safetyGuarantee: isSurplusDeal ? 'FSSAI Certified Safe Surplus' : undefined
      };

      if (editingItem) {
        await api.updateMenuItem(editingItem._id, payload);
      } else {
        await api.createMenuItem(payload);
      }

      setShowItemModal(false);
      loadDashboardData();
    } catch (err) {
      alert('Error saving menu item: ' + err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await api.deleteMenuItem(itemId);
      loadDashboardData();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus, `Kitchen updated order to ${newStatus}`);
      loadDashboardData();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-28 bg-cream-200 rounded-3xl" />
        <div className="grid grid-cols-4 gap-6">
          <div className="h-24 bg-cream-200 rounded-2xl" />
          <div className="h-24 bg-cream-200 rounded-2xl" />
          <div className="h-24 bg-cream-200 rounded-2xl" />
          <div className="h-24 bg-cream-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { restaurant, items = [] } = restaurantData || {};
  const regularItems = items.filter(i => !i.isSurplus);
  const surplusItems = items.filter(i => i.isSurplus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ChefHat className="w-3.5 h-3.5" /> Restaurant Owner Portal
            </span>
            <SDGBadge goal="12" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {restaurant?.name || 'My Restaurant'}
          </h1>
          <p className="text-xs text-amber-200/80">
            {restaurant?.description}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => openAddItemModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>List Food Rescue Deal 🔥</span>
          </button>
          <button
            onClick={() => openAddItemModal(false)}
            className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-4 py-2.5 rounded-xl backdrop-blur-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Regular Item</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{analytics?.totalRevenue || 0}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            ₹{analytics?.surplusSalesRevenue || 0} from Surplus Deals
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Orders</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {analytics?.completedOrders || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {orders.length} total orders received
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meals Rescued (SDG 12)</div>
          <div className="text-2xl font-extrabold text-orange-600">
            {analytics?.mealsRescued || 0}
          </div>
          <div className="text-[11px] text-orange-800 font-medium">
            Safe surplus food saved
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Waste Prevented</div>
          <div className="text-2xl font-extrabold text-forest-700">
            {analytics?.wastePreventedKg || 0} kg
          </div>
          <div className="text-[11px] text-teal-700 font-medium">
            ~{analytics?.co2PreventedKg || 0} kg CO2 averted
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
            activeTab === 'orders' ? 'bg-forest-600 text-white shadow-sm' : 'text-slate-600 hover:bg-cream-100'
          }`}
        >
          Live Orders ({orders.filter(o => o.status !== 'Delivered').length})
        </button>

        <button
          onClick={() => setActiveTab('surplus')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'surplus' ? 'bg-orange-500 text-white shadow-sm' : 'text-orange-700 bg-orange-50 hover:bg-orange-100'
          }`}
        >
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>Surplus Rescue Listings ({surplusItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
            activeTab === 'menu' ? 'bg-forest-600 text-white shadow-sm' : 'text-slate-600 hover:bg-cream-100'
          }`}
        >
          Regular Menu Items ({regularItems.length})
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-cream-200 p-8 text-xs text-slate-400">
              No orders received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o._id} className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">Order #{o.orderNumber}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.status}
                      </span>
                      {o.noCutlery && (
                        <span className="text-[10px] bg-forest-50 text-forest-700 font-bold px-1.5 py-0.5 rounded border border-forest-200">
                          🌱 No Cutlery
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600">
                      Customer: <span className="font-bold text-slate-800">{o.customerName}</span> ({o.customerPhone})
                    </div>

                    <div className="text-xs text-slate-500">
                      {o.items?.map(i => `${i.quantity}x ${i.name} (₹${i.price})`).join(' • ')}
                    </div>
                  </div>

                  {/* Status update buttons */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {o.status === 'Placed' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(o._id, 'Accepted')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition"
                      >
                        Accept Order
                      </button>
                    )}

                    {o.status === 'Accepted' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(o._id, 'Preparing')}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition"
                      >
                        Mark Preparing
                      </button>
                    )}

                    {o.status === 'Preparing' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(o._id, 'Ready for Pickup')}
                        className="bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition"
                      >
                        Ready for Pickup
                      </button>
                    )}

                    <span className="text-xs font-extrabold text-slate-900 ml-2">
                      ₹{o.totalAmount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Surplus Rescue Listings */}
      {activeTab === 'surplus' && (
        <div className="space-y-6">
          <div className="bg-orange-50/80 border border-orange-200 p-4 rounded-3xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-orange-950">Food Rescue Listings (SDG 12 Target)</h3>
              <p className="text-xs text-orange-800">
                Surplus food is automatically marked unavailable when stock reaches 0 or collection deadline expires.
              </p>
            </div>
            <button
              onClick={() => openAddItemModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-xl shrink-0"
            >
              + New Surplus Listing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surplusItems.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-3xl border border-orange-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full uppercase">
                      {item.discountPercentage}% OFF Deal
                    </span>
                    <span className="text-xs font-extrabold text-orange-700">
                      {item.surplusQuantity} portions left
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-cream-200 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-slate-900">₹{item.price}</span>
                    <span className="text-xs text-slate-400 line-through">₹{item.originalPrice}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 bg-cream-100 rounded-lg"
                      title="Edit item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 rounded-lg"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Regular Menu Items */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Standard Kitchen Menu</h3>
            <button
              onClick={() => openAddItemModal(false)}
              className="bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              + Add Menu Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularItems.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-3xl border border-cream-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold bg-cream-100 text-slate-700 px-2 py-0.5 rounded-full uppercase">
                    {item.category}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-cream-200 flex items-center justify-between">
                  <span className="text-base font-extrabold text-slate-900">₹{item.price}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 bg-cream-100 rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Menu Item */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">
              {editingItem ? 'Edit Dish' : isSurplusDeal ? 'List Food Rescue Surplus Deal' : 'Add New Menu Item'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Item Name</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isSurplusDeal ? 'Discounted Rescue Price (₹)' : 'Price (₹)'}
                  </label>
                  <input
                    type="number"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
                  />
                </div>

                {isSurplusDeal && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {isSurplusDeal && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Available Quantity (Portions)</label>
                    <input
                      type="number"
                      value={surplusQty}
                      onChange={(e) => setSurplusQty(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Rescue Window (Hours left)</label>
                    <input
                      type="number"
                      value={deadlineHours}
                      onChange={(e) => setDeadlineHours(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={itemImage}
                  onChange={(e) => setItemImage(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows="2"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
                />
              </div>

              {isSurplusDeal && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preparation & Food Safety Info</label>
                  <textarea
                    rows="2"
                    value={prepInfo}
                    onChange={(e) => setPrepInfo(e.target.value)}
                    placeholder="E.g. Cooked at 12:00 PM, blast-chilled, safe for consumption within 4 hours."
                    className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 bg-cream-100 hover:bg-cream-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold text-white bg-forest-600 hover:bg-forest-700 transition"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
