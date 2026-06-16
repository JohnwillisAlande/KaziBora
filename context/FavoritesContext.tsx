"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "../utils/supabase/client";
import allProducts from "../data/products.json";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
};

interface FavoritesContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // 1. Listen for Login and Fetch Favorites
  useEffect(() => {
    const fetchSessionAndFavorites = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
        
        const { data: dbFavorites } = await supabase
          .from("favorites")
          .select("product_id")
          .eq("user_id", session.user.id);

        if (dbFavorites) {
          const populatedFavorites = dbFavorites.map((item) => {
            return allProducts.find((p) => p.id === item.product_id);
          }).filter(Boolean) as Product[];

          setFavorites(populatedFavorites);
        }
      } else {
        setUserId(null);
        setFavorites([]); // Clear on logout
      }
    };

    fetchSessionAndFavorites();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchSessionAndFavorites();
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // 2. Toggle Favorite (Optimistic UI + Cloud Sync)
  const toggleFavorite = async (product: Product) => {
    const isAlreadyFavorited = favorites.some((fav) => fav.id === product.id);

    // Optimistic UI Update
    if (isAlreadyFavorited) {
      setFavorites((prev) => prev.filter((fav) => fav.id !== product.id));
    } else {
      setFavorites((prev) => [...prev, product]);
    }

    // Cloud Sync (Only if logged in)
    if (userId) {
      if (isAlreadyFavorited) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", product.id);
      } else {
        await supabase
          .from("favorites")
          .insert([{ user_id: userId, product_id: product.id }]);
      }
    } else {
      alert("Please sign in to save items to your favorites.");
      // Revert optimistic UI if not logged in
      if (!isAlreadyFavorited) {
        setFavorites((prev) => prev.filter((fav) => fav.id !== product.id));
      }
    }
  };

  const isFavorite = (id: string) => favorites.some((fav) => fav.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}