import Link from "next/link";

export default function Story() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left Column: Text Content */}
        <div className="max-w-lg">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--color-brand-dark)] tracking-tighter mb-6 uppercase">
            Engineered for <br/> Resilience.
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Every KaziBora solar solution is meticulously designed with a focus on maximum output and unyielding durability. We source only the finest monocrystalline materials to ensure your power supply remains constant, without compromising on aesthetic integration.
          </p>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Our commitment to quality means you get renewable energy infrastructure that not only powers your present but secures your future from the first installation to the last drop of sunlight.
          </p>

          <Link href="/about" className="inline-flex items-center text-sm font-bold tracking-widest uppercase text-gray-900 border-b-2 border-gray-900 pb-1 hover:text-[var(--color-brand-yellow)] hover:border-[var(--color-brand-yellow)] transition-colors">
            Read Our Story
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Right Column: Image */}
        <div className="relative h-[500px] bg-gray-100 overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=1000" 
            alt="KaziBora Solar Installation" 
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </section>
  );
}