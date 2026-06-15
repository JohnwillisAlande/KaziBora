import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Using the custom dark slate brand color */}
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

          {/* Shopping Bag Icon */}
          <div className="flex items-center">
            <button className="text-gray-600 hover:text-[var(--color-brand-dark)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}