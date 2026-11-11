import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('foodloop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentRestaurant, setCurrentRestaurant] = useState(() => {
    try {
      const saved = localStorage.getItem('foodloop_cart_restaurant');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [noCutlery, setNoCutlery] = useState(true);
  const [ecoPackagingSelected, setEcoPackagingSelected] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('foodloop_cart', JSON.stringify(cartItems));
    localStorage.setItem('foodloop_cart_restaurant', JSON.stringify(currentRestaurant));
  }, [cartItems, currentRestaurant]);

  const addToCart = (item, restaurant) => {
    // If adding from a different restaurant, check confirmation
    if (currentRestaurant && currentRestaurant._id && restaurant && currentRestaurant._id !== restaurant._id) {
      const confirmReset = window.confirm(
        `Your cart contains items from "${currentRestaurant.name}". Do you want to discard your previous cart and start fresh with "${restaurant.name}"?`
      );
      if (!confirmReset) return false;
      setCartItems([{ ...item, quantity: 1 }]);
      setCurrentRestaurant(restaurant);
      setIsDrawerOpen(true);
      return true;
    }

    if (!currentRestaurant && restaurant) {
      setCurrentRestaurant(restaurant);
    }

    setCartItems(prev => {
      const existing = prev.find(i => (i._id === item._id || i.menuItemId === item._id));
      if (existing) {
        return prev.map(i =>
          (i._id === item._id || i.menuItemId === item._id)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1, menuItemId: item._id }];
    });

    setIsDrawerOpen(true);
    return true;
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const next = prev.filter(i => (i._id !== itemId && i.menuItemId !== itemId));
      if (next.length === 0) setCurrentRestaurant(null);
      return next;
    });
  };

  const updateQuantity = (itemId, qty) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(i =>
        (i._id === itemId || i.menuItemId === itemId) ? { ...i, quantity: qty } : i
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCurrentRestaurant(null);
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartItems.reduce((sum, i) => sum + (Number(i.price) * i.quantity), 0);

  const deliveryFee = currentRestaurant ? Number(currentRestaurant.deliveryFee || 30) : 30;
  const ecoPackagingFee = (ecoPackagingSelected && currentRestaurant?.ecoPackagingAvailable)
    ? Number(currentRestaurant.ecoPackagingFee || 15)
    : 0;

  // Rescued meals count in current cart
  const rescuedMealsCount = cartItems
    .filter(i => i.isSurplus)
    .reduce((sum, i) => sum + i.quantity, 0);

  // Eco reward points calculation
  let estimatedPoints = 10;
  if (noCutlery) estimatedPoints += 15;
  if (ecoPackagingSelected) estimatedPoints += 10;
  if (rescuedMealsCount > 0) estimatedPoints += (rescuedMealsCount * 25);

  const totalAmount = subtotal + deliveryFee + ecoPackagingFee;

  return (
    <CartContext.Provider value={{
      cartItems,
      currentRestaurant,
      noCutlery,
      setNoCutlery,
      ecoPackagingSelected,
      setEcoPackagingSelected,
      isDrawerOpen,
      setIsDrawerOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      subtotal,
      deliveryFee,
      ecoPackagingFee,
      rescuedMealsCount,
      estimatedPoints,
      totalAmount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
