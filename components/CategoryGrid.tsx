import Link from "next/link";

export default function CategoryGrid() {
  const categories = [
    {
      title: "SOLAR PANELS",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800",
      link: "/shop?category=panels"
    },
    {
      title: "BATTERIES",
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938cb?auto=format&fit=crop&q=80&w=800",
      link: "/shop?category=batteries"
    },
    {
      title: "INVERTERS",
      image: "https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?auto=format&fit=crop&q=80&w=800",
      link: "/shop?category=inverters"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--color-brand-dark)] tracking-tighter">
          SHOP BY CATEGORY
        </h2>
        <Link href="/shop" className="text-sm font-bold tracking-widest uppercase text-gray-900 border-b-2 border-gray-900 pb-1 hover:text-[var(--color-brand-yellow)] hover:border-[var(--color-brand-yellow)] transition-colors">
          VIEW ALL
        </Link>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <Link href={cat.link} key={index} className="group relative h-[400px] md:h-[500px] overflow-hidden bg-gray-100 flex items-end">
            {/* Background Image with Zoom on Hover */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${cat.image}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>

            {/* Category Text */}
            <div className="relative z-10 p-8 w-full">
              <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">{cat.title}</h3>
              <p className="text-white text-sm font-semibold tracking-widest uppercase flex items-center gap-2 group-hover:text-[var(--color-brand-yellow)] transition-colors">
                EXPLORE 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}