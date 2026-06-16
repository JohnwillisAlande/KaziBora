"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import allProducts from "../data/products.json"; // We need this to match IDs to images/prices

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
  removeFromCart: (id: string) => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // 1. Listen for User Login and Fetch Saved Cart
  useEffect(() => {
    const fetchSessionAndCart = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
        
        // Fetch their saved items from Supabase
        const { data: dbCart } = await supabase
          .from("cart_items")
          .select("product_id, quantity")
          .eq("user_id", session.user.id);

        if (dbCart) {
          // Match the database IDs back to our product catalog
          const populatedCart = dbCart.map((item) => {
            const productInfo = allProducts.find((p) => p.id === item.product_id);
            return {
              ...productInfo!,
              quantity: item.quantity,
            };
          }).filter(item => item.id); // Filter out any missing products

          setCart(populatedCart);
        }
      } else {
        setUserId(null);
        setCart([]); // Clear cart if they log out
      }
    };

    fetchSessionAndCart();

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchSessionAndCart();
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // 2. Add to Cart (Updates Screen Instantly, Saves to Cloud in Background)
  const addToCart = async (product: Product, quantity: number) => {
    // Optimistic UI: Update the screen immediately
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });

    // Cloud Sync: Save to Supabase if logged in
    if (userId) {
      // Check if it already exists in the database
      const { data: existingDbItem } = await supabase
        .from("cart_items")
        .select("quantity")
        .eq("user_id", userId)
        .eq("product_id", product.id)
        .single();

      if (existingDbItem) {
        // Update existing quantity
        await supabase
          .from("cart_items")
          .update({ quantity: existingDbItem.quantity + quantity })
          .eq("user_id", userId)
          .eq("product_id", product.id);
      } else {
        // Insert new item
        await supabase
          .from("cart_items")
          .insert([{ user_id: userId, product_id: product.id, quantity }]);
      }
    }
    
    alert(`${quantity}x ${product.name} added to cart!`);
  };

  // 3. Remove from Cart
  const removeFromCart = async (id: string) => {
    // Optimistic UI
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));

    // Cloud Sync
    if (userId) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", id);
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}