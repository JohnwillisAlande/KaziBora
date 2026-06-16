"use client";

import Link from "next/link";
import { useFavorites } from "../../context/FavoritesContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FavoriteButton from "../../components/FavoriteButton";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <h1 className="text-4xl font-extrabold text-[var(--color-brand-dark)] tracking-tighter mb-10 uppercase">
          Saved Items
        </h1>

        {favorites.length === 0 ? (
          <div className="bg-white p-10 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-6">You haven't saved any items yet.</p>
            <Link 
              href="/shop" 
              className="inline-flex bg-[var(--color-brand-dark)] text-white font-bold tracking-widest uppercase px-8 py-4 hover:bg-[var(--color-brand-yellow)] hover:text-[var(--color-brand-dark)] transition-colors shadow-sm"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {favorites.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer block bg-white p-4 shadow-sm border border-gray-100 relative">
                <div className="relative h-64 bg-gray-100 overflow-hidden mb-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                  <FavoriteButton product={product} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-[var(--color-brand-yellow)] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[var(--color-brand-dark)] font-semibold">
                    ${product.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}