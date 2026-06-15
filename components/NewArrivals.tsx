import Link from "next/link";
import products from "../data/products.json";

export default function NewArrivals() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-brand-dark)] tracking-tighter uppercase">
          New Arrivals
        </h2>
        <p className="hidden md:block text-gray-500 max-w-md text-right text-sm">
          Discover our latest solar technology, featuring premium monocrystalline materials and high-capacity storage.
        </p>
      </div>

      {/* 4-Column Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
            {/* Image Container */}
            <div className="relative h-80 bg-gray-100 overflow-hidden mb-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Quick Add Button (Visible on Hover) */}
              <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <button className="w-full bg-white text-[var(--color-brand-dark)] font-bold py-3 text-sm tracking-widest uppercase shadow-lg hover:bg-[var(--color-brand-yellow)] transition-colors">
                  Quick View
                </button>
              </div>
            </div>

            {/* Product Details */}
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
    </section>
  );
}