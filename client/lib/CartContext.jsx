'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api-client';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'unretail_cart';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartNotification, setCartNotification] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [unavailableItems, setUnavailableItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persistent cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          }
        }
      } catch (err) {
        console.warn('Failed to load cart from storage:', err);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (err) {
        console.warn('Failed to save cart to storage:', err);
      }
    }
  }, [cartItems, isLoaded]);

  // Show transient toast notification
  const showNotification = useCallback((message, type = 'info') => {
    setCartNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setCartNotification((current) => (current?.message === message ? null : current));
    }, 4000);
  }, []);

  // 1-of-1 Thrift Rule: Adding an item ensures single stock
  const addToCart = useCallback(
    (item, openDrawer = true) => {
      if (!item || !item.id) return false;

      // Check if item is already in cart
      const existingIndex = cartItems.findIndex((i) => i.id === item.id);
      if (existingIndex !== -1) {
        showNotification(
          `"${item.title || 'Grail'}" is already in your bag. (1-of-1 single stock)`,
          'warning'
        );
        if (openDrawer) setIsCartOpen(true);
        return false;
      }

      // Check if item is sold
      if (item.status === 'SOLD') {
        showNotification('This 1-of-1 piece has already been sold.', 'error');
        return false;
      }

      // Ensure normalized item structure
      const normalizedItem = {
        id: item.id,
        title: item.title || 'Vintage Grail',
        description: item.description || '',
        price: Number(item.price) || 0,
        category: item.category || 'Apparel',
        subcategory: item.subcategory || '',
        size: item.size || 'OS',
        era: item.era || 'Vintage',
        condition: item.condition || 'LIKE_NEW',
        techConditionGrade: item.techConditionGrade || null,
        images: Array.isArray(item.images) && item.images.length > 0 ? item.images : ['/images/denim_vintage.png'],
        shopId: item.shopId || item.shop?.id || 'shop-1',
        shop: {
          id: item.shopId || item.shop?.id || 'shop-1',
          shopName: item.shop?.shopName || 'Relic Vintage Co.',
          city: item.shop?.city || 'Mumbai',
          address: item.shop?.address || 'Bandra West',
          isVerified: item.shop?.isVerified !== false,
        },
        status: 'AVAILABLE',
        quantity: 1, // Fixed 1-of-1 single stock
        addedAt: Date.now(),
      };

      setCartItems((prev) => [normalizedItem, ...prev]);
      showNotification(`Added "${normalizedItem.title}" to bag`, 'success');

      if (openDrawer) {
        setIsCartOpen(true);
      }
      return true;
    },
    [cartItems, showNotification]
  );

  const removeFromCart = useCallback((itemId) => {
    setCartItems((prev) => {
      const removed = prev.find((i) => i.id === itemId);
      if (removed) {
        showNotification(`Removed "${removed.title}" from bag`, 'info');
      }
      return prev.filter((i) => i.id !== itemId);
    });
    setUnavailableItems((prev) => prev.filter((i) => i.id !== itemId));
  }, [showNotification]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setUnavailableItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const isInCart = useCallback(
    (itemId) => cartItems.some((i) => i.id === itemId),
    [cartItems]
  );

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  // Validate cart against real-time PostgreSQL database
  const validateCartItems = useCallback(async () => {
    if (cartItems.length === 0) {
      setUnavailableItems([]);
      return { valid: true, validItems: [], unavailableItems: [] };
    }

    setIsValidating(true);
    try {
      const itemIds = cartItems.map((i) => i.id);
      const res = await apiClient.post('/cart/validate', { itemIds });

      if (res.data?.success) {
        const { valid, validItems, unavailableItems: unavail } = res.data;
        setUnavailableItems(unavail || []);

        if (!valid && unavail?.length > 0) {
          showNotification(
            `Notice: ${unavail.length} 1-of-1 item(s) in your bag are no longer available.`,
            'error'
          );
        }

        return res.data;
      }
      return { valid: true, validItems: cartItems, unavailableItems: [] };
    } catch (err) {
      console.warn('Cart real-time stock validation check warning:', err);
      return { valid: true, validItems: cartItems, unavailableItems: [] };
    } finally {
      setIsValidating(false);
    }
  }, [cartItems, showNotification]);

  // Remove all unavailable items in one click
  const removeUnavailableItems = useCallback(() => {
    const unavailIds = new Set(unavailableItems.map((u) => u.id));
    setCartItems((prev) => prev.filter((i) => !unavailIds.has(i.id)));
    setUnavailableItems([]);
    showNotification('Unavailable items removed from bag', 'info');
  }, [unavailableItems, showNotification]);

  const cartCount = cartItems.length;
  const cartSubtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const deliveryFee = cartSubtotal === 0 || cartSubtotal >= 3000 ? 0 : 99;
  const platformFee = 0; // Escrow Protection is free
  const cartTotal = cartSubtotal + deliveryFee + platformFee;

  const value = {
    cartItems,
    cartCount,
    cartSubtotal,
    deliveryFee,
    platformFee,
    cartTotal,
    isCartOpen,
    isValidating,
    unavailableItems,
    cartNotification,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    openCart,
    closeCart,
    toggleCart,
    validateCartItems,
    removeUnavailableItems,
    showNotification,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
