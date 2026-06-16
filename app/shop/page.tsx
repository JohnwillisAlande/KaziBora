import Link from "next/link";
import products from "../../data/products.json";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FavoriteButton from "../../components/FavoriteButton";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  // 1. Read the URL to see if a specific category was requested
  const resolvedParams = await searchParams;
  const rawCategory = resolvedParams.category?.toLowerCase();

  // 2. Map the URL friendly names (panels) to our exact database categories (SOLAR PANELS)
  const categoryMap: Record<string, string> = {
    panels: "SOLAR PANELS",
    batteries: "BATTERIES",
    inverters: "INVERTERS",
    portable: "PORTABLE"
  };

  const activeCategory = rawCategory && categoryMap[rawCategory] ? categoryMap[rawCategory] : "ALL";

  // 3. Filter the products based on the active category
  const filteredProducts = activeCategory === "ALL" 
    ? products 
    : products.filter((product) => product.category === activeCategory);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-brand-dark)] tracking-tighter uppercase mb-4">
            Shop Solutions
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Browse our complete catalog of premium solar panels, high-capacity storage batteries, and efficient inverters designed to power your future.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 border-b border-gray-200 pb-8">
          <Link 
            href="/shop" 
            className={`text-sm font-bold tracking-widest uppercase px-4 py-2 transition-colors ${activeCategory === "ALL" ? "text-[var(--color-brand-yellow)] border-b-2 border-[var(--color-brand-yellow)]" : "text-gray-500 hover:text-[var(--color-brand-dark)]"}`}
          >
            All Products
          </Link>
          <Link 
            href="/shop?category=panels" 
            className={`text-sm font-bold tracking-widest uppercase px-4 py-2 transition-colors ${activeCategory === "SOLAR PANELS" ? "text-[var(--color-brand-yellow)] border-b-2 border-[var(--color-brand-yellow)]" : "text-gray-500 hover:text-[var(--color-brand-dark)]"}`}
          >
            Solar Panels
          </Link>
          <Link 
            href="/shop?category=batteries" 
            className={`text-sm font-bold tracking-widest uppercase px-4 py-2 transition-colors ${activeCategory === "BATTERIES" ? "text-[var(--color-brand-yellow)] border-b-2 border-[var(--color-brand-yellow)]" : "text-gray-500 hover:text-[var(--color-brand-dark)]"}`}
          >
            Batteries
          </Link>
          <Link 
            href="/shop?category=inverters" 
            className={`text-sm font-bold tracking-widest uppercase px-4 py-2 transition-colors ${activeCategory === "INVERTERS" ? "text-[var(--color-brand-yellow)] border-b-2 border-[var(--color-brand-yellow)]" : "text-gray-500 hover:text-[var(--color-brand-dark)]"}`}
          >
            Inverters
          </Link>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
            <Link href="/shop" className="text-[var(--color-brand-yellow)] font-bold uppercase tracking-widest mt-4 inline-block hover:underline">
              Clear Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
                {/* Image Container */}
                <div className="relative h-80 bg-gray-100 overflow-hidden mb-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                  />

                  {/* Add the Heart Button Here! */}
                    <FavoriteButton product={product} />
                  
                  {/* Quick Add Label */}
                  <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-full bg-white text-[var(--color-brand-dark)] font-bold py-3 text-sm tracking-widest uppercase shadow-lg hover:bg-[var(--color-brand-yellow)] transition-colors">
                      View Details
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
        )}
      </div>

      <Footer />
    </main>
  );
}