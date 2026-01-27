import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartItem {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  product_thumbnail: string;
  selectedColor?: string;
  selectedSize?: string;
  selectedGender?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "ecommerce_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        setCart([]);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find(
        (c) =>
          c.product_id === item.product_id &&
          c.selectedColor === item.selectedColor &&
          c.selectedSize === item.selectedSize &&
          c.selectedGender === item.selectedGender,
      );
      if (existing) {
        return prevCart.map((c) =>
          c.product_id === item.product_id &&
          c.selectedColor === item.selectedColor &&
          c.selectedSize === item.selectedSize &&
          c.selectedGender === item.selectedGender
            ? { ...c, quantity: c.quantity + item.quantity }
            : c,
        );
      }
      return [...prevCart, item];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.product_id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((c) =>
          c.product_id === productId ? { ...c, quantity } : c,
        ),
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
