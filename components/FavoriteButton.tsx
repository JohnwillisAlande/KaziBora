"use client";

import { useFavorites } from "../context/FavoritesContext";

type ProductProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
};

export default function FavoriteButton({ product }: { product: ProductProps }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const saved = isFavorite(product.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevents navigating to the product page if clicked inside a Link card
        toggleFavorite(product);
      }}
      className="absolute top-4 right-4 z-20 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
      aria-label="Toggle Favorite"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.5}
        className={`w-5 h-5 ${saved ? "text-red-500" : "text-gray-400 hover:text-red-500"} transition-colors`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}