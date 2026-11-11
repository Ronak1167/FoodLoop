import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/customer/CartDrawer';

import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import FoodRescue from './pages/FoodRescue';
import SmartFinder from './pages/SmartFinder';
import GroupOrder from './pages/GroupOrder';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import SustainabilityDashboard from './pages/SustainabilityDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import RestaurantDashboard from './pages/RestaurantDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DsaLabVisualizer from './pages/DsaLabVisualizer';

// Route protector for restaurant owners
function ProtectedOwnerRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || (user.role !== 'restaurant_owner' && user.role !== 'admin')) {
    return <Navigate to="/login?redirect=/restaurant-dashboard" replace />;
  }
  return children;
}

// Route protector for delivery partners
function ProtectedDeliveryRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || (user.role !== 'delivery_partner' && user.role !== 'admin')) {
    return <Navigate to="/login?redirect=/delivery-dashboard" replace />;
  }
  return children;
}

// Route protector for admin
function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login?redirect=/admin-dashboard" replace />;
  }
  return children;
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-slate-800">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/food-rescue" element={<FoodRescue />} />
          <Route path="/smart-finder" element={<SmartFinder />} />
          <Route path="/group-order" element={<GroupOrder />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:id" element={<OrderTracking />} />
          <Route path="/sustainability" element={<SustainabilityDashboard />} />
          <Route path="/dsa-lab" element={<DsaLabVisualizer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* Role Dashboards */}
          <Route
            path="/restaurant-dashboard"
            element={
              <ProtectedOwnerRoute>
                <RestaurantDashboard />
              </ProtectedOwnerRoute>
            }
          />
          <Route
            path="/delivery-dashboard"
            element={
              <ProtectedDeliveryRoute>
                <DeliveryDashboard />
              </ProtectedDeliveryRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
