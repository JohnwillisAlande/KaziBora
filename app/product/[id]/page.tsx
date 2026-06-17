import AddToCartButton from "../../../components/AddToCartButton";
import { notFound } from "next/navigation";
import Link from "next/link";
import products from "../../../data/products.json";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ProductGallery from "../../../components/ProductGallery";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Get the product ID from the URL
  const resolvedParams = await params;
  
  // 2. Find the matching product in our database
  const product = products.find((p) => p.id === resolvedParams.id);

  // 3. If the product doesn't exist, show a 404 page
  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 text-sm font-semibold tracking-widest uppercase text-gray-400">
          <Link href="/" className="hover:text-[var(--color-brand-yellow)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-[var(--color-brand-yellow)] transition-colors">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* 50/50 Product Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Product Image */}
          <div className="bg-gray-100 h-96 md:h-[600px] relative">
            <ProductGallery 
                images={product.images || [product.imageUrl]} 
                altText={product.name} 
            />
            </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col pt-4">
            <p className="text-[var(--color-brand-yellow)] font-bold tracking-widest uppercase mb-2">
              {product.category}
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-brand-dark)] tracking-tighter mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-gray-900 mb-8">
              ${product.price.toLocaleString()}
            </p>

            <p className="text-gray-600 mb-10 leading-relaxed">
              Engineered for maximum efficiency and resilience. This premium KaziBora unit ensures optimal performance for your renewable energy infrastructure, providing reliable power when you need it most.
            </p>

            {/* Add to Cart Actions */}
            <AddToCartButton product={{
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl
                }} />

            {/* Technical Specs List */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-sm font-bold tracking-widest uppercase text-gray-900 mb-4">Technical Specifications</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-semibold">Installation</span>
                  <span>Professional Setup Required</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-semibold">Warranty</span>
                  <span>10-Year Comprehensive</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-semibold">Certifications</span>
                  <span>ISO 9001, Tier 1 Solar</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}