import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Copy,
  Plus,
  Trash2,
  Check,
  ArrowRight,
  Share2,
  DollarSign,
  Utensils,
  Receipt,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SDGBadge from '../components/common/SDGBadge';

export default function GroupOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const codeParam = searchParams.get('code');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Active state
  const [group, setGroup] = useState(null);
  const [splitData, setSplitData] = useState(null);
  const [currentMember, setCurrentMember] = useState(null);
  const [restaurantMenu, setRestaurantMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Forms
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinNameInput, setJoinNameInput] = useState(user?.name || '');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestId, setSelectedRestId] = useState('');

  // Load available restaurants if user wants to create
  useEffect(() => {
    api.getRestaurants().then(res => {
      if (res.restaurants) {
        setRestaurants(res.restaurants);
        if (res.restaurants.length > 0) setSelectedRestId(res.restaurants[0]._id);
      }
    });
  }, []);

  // If code in query, load the group order
  useEffect(() => {
    if (codeParam) {
      loadGroup(codeParam);
    }
  }, [codeParam]);

  const loadGroup = async (code) => {
    setLoading(true);
    try {
      const res = await api.getGroupByCode(code);
      setGroup(res.groupOrder);
      setSplitData(res.splitBreakdown);

      // Load restaurant menu for item selector
      if (res.groupOrder.restaurantId) {
        const restRes = await api.getRestaurantById(res.groupOrder.restaurantId);
        const allItems = [...(restRes.regularMenu || []), ...(restRes.surplusDeals || [])];
        setRestaurantMenu(allItems);
      }

      // Check if current user is already in members
      if (user && res.groupOrder.members) {
        const found = res.groupOrder.members.find(
          m => String(m.userId) === String(user._id) || m.name.toLowerCase() === user.name.toLowerCase()
        );
        if (found) setCurrentMember(found);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load group: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!selectedRestId) return;
    try {
      const res = await api.createGroupOrder({ restaurantId: selectedRestId });
      if (res.groupOrder) {
        setSearchParams({ code: res.groupOrder.groupCode });
      }
    } catch (err) {
      alert('Error creating group: ' + err.message);
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    const code = (joinCodeInput || codeParam || '').toUpperCase().trim();
    if (!code || !joinNameInput.trim()) {
      alert('Please enter group code and your name');
      return;
    }

    try {
      const res = await api.joinGroupOrder(code, { name: joinNameInput.trim() });
      setGroup(res.groupOrder);
      setCurrentMember(res.member);
      setSearchParams({ code });
      loadGroup(code);
    } catch (err) {
      alert('Failed to join: ' + err.message);
    }
  };

  const handleAddItem = async (menuItemId) => {
    if (!currentMember) {
      alert('Please join the group with your name first!');
      return;
    }
    try {
      const res = await api.addItemToGroup(group.groupCode, {
        memberId: currentMember.memberId,
        menuItemId,
        quantity: 1
      });
      setGroup(res.groupOrder);
      setSplitData(res.splitBreakdown);
    } catch (err) {
      alert('Failed to add item: ' + err.message);
    }
  };

  const handleRemoveItem = async (menuItemId) => {
    if (!currentMember) return;
    try {
      const res = await api.removeItemFromGroup(group.groupCode, {
        memberId: currentMember.memberId,
        menuItemId
      });
      setGroup(res.groupOrder);
      setSplitData(res.splitBreakdown);
    } catch (err) {
      alert('Failed to remove item: ' + err.message);
    }
  };

  const handleToggleSplit = async (method) => {
    try {
      const res = await api.toggleSplitMethod(group.groupCode, method);
      setGroup(res.groupOrder);
      setSplitData(res.splitBreakdown);
    } catch (err) {
      alert('Failed to change split method: ' + err.message);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(group.groupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckoutGroup = async () => {
    if (!group) return;
    try {
      const res = await api.checkoutGroupOrder(group.groupCode, {
        deliveryAddress: user?.address || { street: 'Group Hub DLF', city: 'Gurugram' },
        paymentMethod: 'UPI'
      });
      alert('Group order placed successfully! Order Number: ' + res.order.orderNumber);
      navigate(`/orders/${res.order._id}`);
    } catch (err) {
      alert('Failed to place group order: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-forest-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
              <Users className="w-3.5 h-3.5" /> Main Innovation 4
            </span>
            <SDGBadge goal="12" size="sm" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Group Ordering & Bill Splitting
          </h1>

          <p className="text-teal-100/80 text-xs sm:text-sm leading-relaxed">
            Order together from a single restaurant, eliminate redundant delivery trips and emissions (SDG 12),
            and easily split the bill either by exact items or equally!
          </p>
        </div>
      </div>

      {/* If No Group Loaded, Show Create / Join Cards */}
      {!group ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Create Group */}
          <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <Plus className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Start a New Group Order</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose a restaurant, generate a unique 4-character invite code, and send it to your friends or colleagues.
              </p>

              <form onSubmit={handleCreateGroup} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Select Restaurant:
                  </label>
                  <select
                    value={selectedRestId}
                    onChange={(e) => setSelectedRestId(e.target.value)}
                    className="w-full text-xs font-semibold bg-cream-50 text-slate-800 border border-cream-300 rounded-xl px-3 py-2.5 focus:outline-none"
                  >
                    {restaurants.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name} ({r.cuisines?.slice(0, 2).join(', ')})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition shadow-sm"
                >
                  Create & Get Code
                </button>
              </form>
            </div>
          </div>

          {/* Card 2: Join Group */}
          <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Join an Existing Group</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Got a joining code from your host? Enter it here to add your dishes to the group cart.
              </p>

              <form onSubmit={handleJoinGroup} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Group Code (e.g. LOOP-4921):
                  </label>
                  <input
                    type="text"
                    placeholder="LOOP-XXXX"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    className="w-full text-xs font-bold bg-cream-50 uppercase text-slate-900 border border-cream-300 rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={joinNameInput}
                    onChange={(e) => setJoinNameInput(e.target.value)}
                    className="w-full text-xs font-medium bg-cream-50 text-slate-900 border border-cream-300 rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-forest-600 hover:bg-forest-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition shadow-sm"
                >
                  Join Group Room
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* Active Group Session View */
        <div className="space-y-8">
          {/* Group Room Status Strip */}
          <div className="bg-white rounded-3xl border border-cream-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Order Room:</span>
                <span className="text-base font-extrabold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                  {group.groupCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1 rounded text-slate-500 hover:text-slate-800 transition"
                  title="Copy Code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Ordering from {group.restaurantName}
              </h2>
              <p className="text-xs text-slate-500">
                Host: <span className="font-semibold text-slate-800">{group.hostName}</span> • Single EV Delivery (~₹{group.deliveryFee || 30})
              </p>
            </div>

            {/* Current Member Indicator or Join Form */}
            <div>
              {currentMember ? (
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">You are ordering as:</span>
                  <span className="text-xs font-extrabold text-forest-700 bg-forest-50 border border-forest-200 px-3 py-1 rounded-xl inline-block mt-0.5">
                    {currentMember.name}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter your name to join"
                    value={joinNameInput}
                    onChange={(e) => setJoinNameInput(e.target.value)}
                    className="text-xs font-medium bg-cream-50 border border-cream-300 rounded-xl px-3 py-1.5 focus:outline-none"
                  />
                  <button
                    onClick={handleJoinGroup}
                    className="text-xs font-bold bg-forest-600 text-white px-3 py-1.5 rounded-xl hover:bg-forest-700"
                  >
                    Join
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Menu Item Picker for Group Member */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-forest-600" />
                  <span>Add Dishes to Your Portion</span>
                </h3>
                <span className="text-xs text-slate-500">Click Add to append to your order</span>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {restaurantMenu.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white p-3 sm:p-4 rounded-2xl border border-cream-200 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream-100 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {item.name}
                          </h4>
                          {item.isSurplus && (
                            <span className="text-[9px] bg-orange-100 text-orange-800 font-extrabold px-1.5 rounded">
                              {item.discountPercentage}% OFF
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-extrabold text-slate-800 mt-0.5 block">
                          ₹{item.price}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddItem(item._id)}
                      className="bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm transition flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Members Orders & Bill Splitting (MAIN INNOVATION) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Participants & Items breakdown */}
              <div className="bg-white rounded-3xl border border-cream-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-teal-600" />
                    <span>Participants & Cart ({group.members?.length || 0})</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-400">Total: ₹{group.totalAmount || 0}</span>
                </div>

                <div className="space-y-4">
                  {group.members?.map((member) => (
                    <div key={member.memberId} className="bg-cream-50/70 p-3.5 rounded-2xl border border-cream-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-900">{member.name}</span>
                        <span className="text-forest-700">₹{member.subtotal || 0}</span>
                      </div>

                      {member.items?.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">Hasn't picked any items yet</p>
                      ) : (
                        <div className="space-y-1">
                          {member.items.map((it) => (
                            <div key={it.menuItemId} className="flex justify-between items-center text-[11px] text-slate-600">
                              <span>
                                {it.quantity}x {it.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span>₹{it.price * it.quantity}</span>
                                {currentMember?.memberId === member.memberId && (
                                  <button
                                    onClick={() => handleRemoveItem(it.menuItemId)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Splitting Mode Selector */}
              <div className="bg-teal-50/70 border border-teal-200 p-4 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-teal-700" />
                    <span>Bill Splitting Method:</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-teal-200">
                    <button
                      onClick={() => handleToggleSplit('by_items')}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                        group.splitMethod === 'by_items'
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-cream-100'
                      }`}
                    >
                      By Items
                    </button>
                    <button
                      onClick={() => handleToggleSplit('equal')}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                        group.splitMethod === 'equal'
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-cream-100'
                      }`}
                    >
                      Equal Split
                    </button>
                  </div>
                </div>

                {/* Split Breakdown Table */}
                {splitData && (
                  <div className="bg-white rounded-2xl p-3 border border-teal-100 space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider grid grid-cols-12 pb-1 border-b border-slate-100">
                      <span className="col-span-6">Member</span>
                      <span className="col-span-3 text-right">Items</span>
                      <span className="col-span-3 text-right">To Pay</span>
                    </div>

                    {splitData.members.map((m) => (
                      <div key={m.memberId} className="grid grid-cols-12 text-xs py-1 border-b border-cream-100 last:border-none items-center">
                        <span className="col-span-6 font-semibold text-slate-800 truncate">
                          {m.name}
                        </span>
                        <span className="col-span-3 text-right text-slate-500">
                          ₹{m.itemsTotal}
                        </span>
                        <span className="col-span-3 text-right font-extrabold text-teal-700">
                          ₹{m.finalShare}
                        </span>
                      </div>
                    ))}

                    <div className="pt-2 text-[11px] text-slate-500 flex justify-between">
                      <span>Includes ₹{splitData.deliveryFee} EV delivery + ₹{splitData.ecoPackagingFee} packaging</span>
                      <span className="font-extrabold text-slate-900">Total: ₹{splitData.totalBill}</span>
                    </div>
                  </div>
                )}

                {/* Host Checkout Action */}
                <button
                  onClick={handleCheckoutGroup}
                  disabled={group.totalAmount === 0}
                  className="w-full bg-forest-600 hover:bg-forest-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition flex items-center justify-between"
                >
                  <span>Place Single Combined Order</span>
                  <span className="flex items-center gap-1">
                    ₹{group.totalAmount || 0} <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
