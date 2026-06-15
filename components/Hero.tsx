import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=2072')" 
        }}
      >
        {/* The overlay darkens the image so the white text pops */}
        <div className="absolute inset-0 bg-slate-900/60"></div> 
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-tight">
          POWER YOUR <br className="md:hidden" /> FUTURE.
        </h1>
        
        <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl font-light">
          Experience the next generation of energy independence. Engineered for maximum efficiency, designed to build resilience for your home and business.
        </p>
        
        <div className="mt-10">
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center bg-[var(--color-brand-yellow)] text-[var(--color-brand-dark)] px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-yellow-400 transition-colors shadow-lg"
          >
            Explore Solutions
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}