
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Product, SubscriptionPlan, CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Product | SubscriptionPlan, type: 'product' | 'subscription') => void;
  removeFromCart: (itemId: number, type: 'product' | 'subscription') => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
  cartType: 'product' | 'subscription' | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem('fabullis_cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fabullis_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Product | SubscriptionPlan, type: 'product' | 'subscription') => {
    setCartItems(prevItems => {
      // Clear cart if adding a different type of item
      const currentCartType = prevItems.length > 0 ? prevItems[0].type : null;
      if (currentCartType && currentCartType !== type) {
        prevItems = [];
      }
      
      if (type === 'subscription') {
        // Subscriptions can't be added multiple times, so just replace
        const newCartItem: CartItem = { ...item, quantity: 1, type: 'subscription' };
        return [newCartItem];
      }
      
      // Handle products
      const existingItem = prevItems.find(i => i.id === item.id && i.type === 'product');
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id && i.type === 'product' ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      const newCartItem: CartItem = { ...(item as Product), quantity: 1, type: 'product' };
      return [...prevItems, newCartItem];
    });
  };

  const removeFromCart = (itemId: number, type: 'product' | 'subscription') => {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === itemId && item.type === type)));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    // This only applies to products
    if (quantity <= 0) {
      removeFromCart(productId, 'product');
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && item.type === 'product' ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartType = cartItems.length > 0 ? cartItems[0].type : null;

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice,
    cartType
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};