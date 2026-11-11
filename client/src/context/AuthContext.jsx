import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const DEMO_ACCOUNTS = {
  customer: {
    email: 'customer@foodloop.com',
    password: 'password123',
    label: 'Customer (Aarav)',
    role: 'customer'
  },
  restaurant_owner: {
    email: 'greenbowl@foodloop.com',
    password: 'password123',
    label: 'Restaurant Owner (Chef Maya)',
    role: 'restaurant_owner'
  },
  delivery_partner: {
    email: 'delivery@foodloop.com',
    password: 'password123',
    label: 'Delivery Partner (Rohan EV)',
    role: 'delivery_partner'
  },
  admin: {
    email: 'admin@foodloop.com',
    password: 'password123',
    label: 'Admin (Director Anthea)',
    role: 'admin'
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('foodloop_token');
    if (token) {
      api.getMe()
        .then(res => {
          if (res.user) setUser(res.user);
        })
        .catch(() => {
          localStorage.removeItem('foodloop_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.token) {
      localStorage.setItem('foodloop_token', res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.token) {
      localStorage.setItem('foodloop_token', res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('foodloop_token');
    setUser(null);
  };

  const quickLoginAs = async (roleKey) => {
    const creds = DEMO_ACCOUNTS[roleKey];
    if (!creds) return;
    return await login(creds.email, creds.password);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.user) setUser(res.user);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      quickLoginAs,
      refreshUser,
      isAuthenticated: Boolean(user)
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
