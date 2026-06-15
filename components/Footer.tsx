"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-[var(--color-brand-dark)] tracking-tighter mb-4 block">
              KaziBora
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed pr-4">
              Premium solar solutions for the modern enterprise and resilient home. Engineered for maximum efficiency.
            </p>
          </div>

          {/* Column 2: Shop Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 tracking-widest uppercase mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/shop?category=panels" className="text-gray-500 hover:text-[var(--color-brand-yellow)] transition-colors text-sm">Solar Panels</Link></li>
              <li><Link href="/shop?category=batteries" className="text-gray-500 hover:text-[var(--color-brand-yellow)] transition-colors text-sm">Storage Batteries</Link></li>
              <li><Link href="/shop?category=inverters" className="text-gray-500 hover:text-[var(--color-brand-yellow)] transition-colors text-sm">Power Inverters</Link></li>
              <li><Link href="/shop" className="text-gray-500 hover:text-[var(--color-brand-yellow)] transition-colors text-sm">All Products</Link></li>
            </ul>
          </div>

          {/* Column 3: Support Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 tracking-widest uppercase mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-gray-500 hover:text-[var(--color-brand-yellow)] transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/shipping" className="text-gray-500 hover:text-[var(--color-brand-yellow)] transition-colors text-sm">Shipping & Returns</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-[var(--color-brand-yellow)] transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/warranty" className="text-gray-500 hover:text-[var(--color-brand-yellow)] transition-colors text-sm">Warranty Info</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-sm font-bold text-gray-900 tracking-widest uppercase mb-6">Newsletter</h4>
            <p className="text-gray-500 text-sm mb-4">
              Subscribe to receive updates, access to exclusive deals, and solar energy tips.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-brand-yellow)] focus:ring-1 focus:ring-[var(--color-brand-yellow)] transition-all"
                required
              />
              <button 
                type="submit" 
                className="bg-[var(--color-brand-dark)] text-white px-6 py-3 hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} KaziBora Enterprises. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-gray-900 text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-900 text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}