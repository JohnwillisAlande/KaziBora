"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// 1. Define the shapes of our data
type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

type CartItem = Product & { quantity: number };

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  cartCount: number;
}

// 2. Create the Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Create the Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      // Check if the item is already in the cart
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        // If it exists, increase the quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // If it's new, add it to the cart
      return [...prevCart, { ...product, quantity }];
    });
    
    // A simple visual confirmation for now
    alert(`${quantity}x ${product.name} added to cart!`);
  };

  // Calculate the total number of items in the cart
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

// 4. Create a custom hook to use the cart easily
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}