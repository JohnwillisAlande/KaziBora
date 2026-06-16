"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { createClient } from "../utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const { cartCount } = useCart();
  const { favorites } = useFavorites();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  // Listen for the user's login state
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    // This instantly updates the Navbar when someone logs in or out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-[var(--color-brand-dark)] tracking-tighter">
              KaziBora
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-[var(--color-brand-yellow)] transition-colors text-sm font-semibold tracking-wide">HOME</Link>
            <Link href="/shop" className="text-gray-600 hover:text-[var(--color-brand-yellow)] transition-colors text-sm font-semibold tracking-wide">SHOP</Link>
            <Link href="/collections" className="text-gray-600 hover:text-[var(--color-brand-yellow)] transition-colors text-sm font-semibold tracking-wide">COLLECTIONS</Link>
            <Link href="/about" className="text-gray-600 hover:text-[var(--color-brand-yellow)] transition-colors text-sm font-semibold tracking-wide">ABOUT</Link>
          </div>

          {/* User Actions, Favorites & Shopping Bag */}
          <div className="flex items-center space-x-6">
            
            {/* Conditional Auth UI */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-[var(--color-brand-dark)] hidden sm:block">
                  Hi, {user.user_metadata.full_name?.split(' ')[0] || 'User'}
                </span>
                <button 
                  onClick={handleSignOut}
                  className="text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-[var(--color-brand-dark)] transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="text-xs font-bold tracking-widest uppercase text-[var(--color-brand-dark)] hover:text-[var(--color-brand-yellow)] transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Favorites Heart Icon */}
            <Link href="/favorites" className="relative text-gray-600 hover:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              
              {/* Favorites Counter Badge */}
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag Icon */}
            <Link href="/cart" className="relative text-gray-600 hover:text-[var(--color-brand-dark)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              
              {/* Cart Counter Badge */}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-brand-yellow)] text-[var(--color-brand-dark)] text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
            
          </div>
        </div>
      </div>
    </nav>
  );
}