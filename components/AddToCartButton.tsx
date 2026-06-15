"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";

type ProductProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export default function AddToCartButton({ product }: { product: ProductProps }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleIncrease = () => setQuantity((prev) => prev + 1);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-12">
      {/* Quantity Selector */}
      <div className="flex items-center border border-gray-300 w-32 bg-white">
        <button 
          onClick={handleDecrease}
          className="px-4 py-3 text-gray-600 hover:text-[var(--color-brand-yellow)] transition-colors"
        >
          -
        </button>
        <span className="flex-1 text-center font-bold text-gray-900">{quantity}</span>
        <button 
          onClick={handleIncrease}
          className="px-4 py-3 text-gray-600 hover:text-[var(--color-brand-yellow)] transition-colors"
        >
          +
        </button>
      </div>
      
      {/* Add Button */}
      <button 
        onClick={() => addToCart(product, quantity)}
        className="flex-1 bg-[var(--color-brand-dark)] text-white font-bold tracking-widest uppercase py-4 hover:bg-[var(--color-brand-yellow)] hover:text-[var(--color-brand-dark)] transition-colors shadow-lg"
      >
        Add to Cart
      </button>
    </div>
  );
}