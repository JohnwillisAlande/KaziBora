"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  // Calculate the total cost of all items in the cart
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <h1 className="text-4xl font-extrabold text-[var(--color-brand-dark)] tracking-tighter mb-10 uppercase">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          // Empty Cart State
          <div className="bg-white p-10 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-6">Your solar cart is currently empty.</p>
            <Link 
              href="/shop" 
              className="inline-flex bg-[var(--color-brand-yellow)] text-[var(--color-brand-dark)] font-bold tracking-widest uppercase px-8 py-4 hover:bg-yellow-400 transition-colors shadow-sm"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          // Filled Cart State
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column: Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm border border-gray-100">
                  <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover bg-gray-100" />
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">Qty: {item.quantity}</p>
                  </div>

                  <div className="text-right flex flex-col items-center sm:items-end gap-3">
                    <p className="text-lg font-bold text-gray-900">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs font-bold tracking-widest uppercase text-red-500 hover:text-red-700 transition-colors border-b border-red-500 pb-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div className="bg-white p-8 shadow-sm border border-gray-100 h-fit">
              <h2 className="text-lg font-bold text-gray-900 tracking-widest uppercase border-b border-gray-200 pb-4 mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-8 flex justify-between items-end">
                <span className="font-bold text-gray-900 uppercase tracking-widest">Total</span>
                <span className="text-3xl font-extrabold text-gray-900">${subtotal.toLocaleString()}</span>
              </div>

              <button className="w-full bg-[var(--color-brand-dark)] text-white font-bold tracking-widest uppercase py-4 hover:bg-[var(--color-brand-yellow)] hover:text-[var(--color-brand-dark)] transition-colors shadow-lg">
                Proceed to Checkout
              </button>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}