import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  Users,
  Compass,
  Leaf,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Shield,
  ChefHat,
  Bike,
  Flame,
  Award
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout, quickLoginAs, isAuthenticated } = useAuth();
  const { cartCount, setIsDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSwitch = async (roleKey) => {
    setRoleSwitcherOpen(false);
    await quickLoginAs(roleKey);
    if (roleKey === 'restaurant_owner') navigate('/restaurant-dashboard');
    else if (roleKey === 'delivery_partner') navigate('/delivery-dashboard');
    else if (roleKey === 'admin') navigate('/admin-dashboard');
    else navigate('/');
  };

  const navLinks = [
    { name: 'Restaurants', path: '/restaurants', icon: Compass },
    { name: 'Food Rescue', path: '/food-rescue', icon: Flame, highlight: true },
    { name: 'Smart Finder', path: '/smart-finder', icon: Sparkles },
    { name: 'Group Order', path: '/group-order', icon: Users },
    { name: 'SDG Impact', path: '/sustainability', icon: Leaf },
    { name: 'DSA Lab', path: '/dsa-lab', icon: Award, isPbl: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200 transition-all shadow-sm">
      {/* Top micro-bar: Sustainability highlight & quick demo switcher */}
      <div className="bg-forest-900 text-emerald-100 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center gap-1 bg-forest-800 px-2 py-0.5 rounded-full text-emerald-300 font-medium">
            <Leaf className="w-3 h-3" /> SDG 12 & 9 Platform
          </span>
          <span className="hidden sm:inline text-emerald-200/80">
            Rescuing safe surplus food & cutting carbon with zero-emission deliveries
          </span>
        </div>

        {/* Quick Demo Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="flex items-center gap-1.5 bg-forest-800 hover:bg-forest-700 text-emerald-100 px-2.5 py-0.5 rounded text-xs transition"
            title="Switch demo persona"
          >
            <span className="text-emerald-300">Demo Persona:</span>
            <span className="font-semibold underline capitalize">
              {user ? user.role.replace('_', ' ') : 'Guest / Select'}
            </span>
            <ChevronDown className="w-3 h-3 text-emerald-300" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white text-slate-800 rounded-xl shadow-2xl border border-cream-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                1-Click Switch Role
              </div>
              {Object.entries(DEMO_ACCOUNTS).map(([key, acc]) => (
                <button
                  key={key}
                  onClick={() => handleRoleSwitch(key)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-cream-100 transition ${
                    user?.role === key ? 'bg-forest-50 text-forest-700 font-semibold' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {key === 'customer' && <User className="w-3.5 h-3.5 text-emerald-600" />}
                    {key === 'restaurant_owner' && <ChefHat className="w-3.5 h-3.5 text-amber-600" />}
                    {key === 'delivery_partner' && <Bike className="w-3.5 h-3.5 text-blue-600" />}
                    {key === 'admin' && <Shield className="w-3.5 h-3.5 text-purple-600" />}
                    <span>{acc.label}</span>
                  </div>
                  {user?.role === key && <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">Active</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-forest-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-forest-500/20 group-hover:scale-105 transition">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-forest-600 transition">
              Food<span className="text-forest-600">Loop</span>
            </span>
            <span className="hidden sm:block text-[10px] font-semibold text-emerald-700 uppercase tracking-wider -mt-1">
              Sustainable Delivery
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  isActive
                    ? 'text-forest-700 bg-forest-50/80 font-semibold'
                    : 'text-slate-600 hover:text-forest-600 hover:bg-cream-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-forest-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
                {item.highlight && (
                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                    Live
                  </span>
                )}
                {item.isPbl && (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                    PBL
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-3">
          {/* Cart Icon Drawer Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative p-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-slate-700 transition"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="w-5 h-5 text-slate-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-forest-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account or Login CTA */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-3 pr-2 bg-cream-100 hover:bg-cream-200 rounded-xl border border-cream-300 transition"
              >
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                    {user?.name || 'My Account'}
                  </div>
                  <div className="text-[10px] text-forest-700 font-semibold uppercase flex items-center gap-1">
                    <Award className="w-2.5 h-2.5" />
                    {user?.rewardPoints || 0} pts
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-forest-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-cream-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-cream-200">
                    <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {user?.role.replace('_', ' ')}
                    </span>
                  </div>

                  {user?.role === 'customer' && (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-700 hover:bg-cream-100 transition"
                      >
                        Orders & Addresses
                      </Link>
                      <Link
                        to="/sustainability"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-700 hover:bg-cream-100 transition"
                      >
                        Impact & Reward Points
                      </Link>
                    </>
                  )}

                  {user?.role === 'restaurant_owner' && (
                    <Link
                      to="/restaurant-dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-forest-700 hover:bg-forest-50 transition"
                    >
                      Restaurant Dashboard
                    </Link>
                  )}

                  {user?.role === 'delivery_partner' && (
                    <Link
                      to="/delivery-dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition"
                    >
                      Delivery Partner Hub
                    </Link>
                  )}

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin-dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 transition"
                    >
                      Platform Admin Console
                    </Link>
                  )}

                  <div className="border-t border-cream-200 mt-1"></div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-700 hover:text-forest-600 px-3 py-2 rounded-lg hover:bg-cream-100 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold bg-forest-600 hover:bg-forest-700 text-white px-3.5 py-2 rounded-xl shadow-sm transition"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-cream-100 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-cream-200 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-cream-100"
            >
              <item.icon className="w-4 h-4 text-forest-600" />
              <span>{item.name}</span>
              {item.highlight && (
                <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase ml-auto">
                  Live
                </span>
              )}
            </Link>
          ))}
          {user?.role === 'restaurant_owner' && (
            <Link
              to="/restaurant-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50"
            >
              <ChefHat className="w-4 h-4" /> Restaurant Dashboard
            </Link>
          )}
          {user?.role === 'delivery_partner' && (
            <Link
              to="/delivery-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50"
            >
              <Bike className="w-4 h-4" /> Delivery Dashboard
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link
              to="/admin-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-purple-700 bg-purple-50"
            >
              <Shield className="w-4 h-4" /> Admin Console
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
