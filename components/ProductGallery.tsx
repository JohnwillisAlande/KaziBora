"use client";

import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  altText: string;
};

export default function ProductGallery({ images, altText }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback if the product doesn't have the images array yet
  if (!images || images.length === 0) {
    return <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>;
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative h-full w-full group overflow-hidden bg-gray-100">
      {/* Current Image */}
      <img
        src={images[currentIndex]}
        alt={`${altText} - View ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300 mix-blend-multiply"
      />

      {/* Only show arrows and dots if there is more than 1 image */}
      {images.length > 1 && (
        <>
          {/* Left Arrow (Visible on Hover) */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[var(--color-brand-yellow)] text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md focus:outline-none focus:opacity-100"
            aria-label="Previous Image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Right Arrow (Visible on Hover) */}
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[var(--color-brand-yellow)] text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md focus:outline-none focus:opacity-100"
            aria-label="Next Image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  currentIndex === index ? "bg-[var(--color-brand-dark)]" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}