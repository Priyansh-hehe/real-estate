"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, Building, Maximize2 } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

export interface PropertyItem {
  id: string;
  title: string;
  description: string;
  price: number;
  propertyType: string;
  size: number;
  address?: string | null;
  images: string[];
}

interface FeaturedPropertiesCarouselProps {
  properties: PropertyItem[];
}

export default function FeaturedPropertiesCarousel({ properties }: FeaturedPropertiesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-4xl mx-auto shadow-sm">
        <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">No properties listed yet</h3>
        <p className="text-zinc-500 dark:text-zinc-400">Check back soon for premium real estate listings.</p>
      </div>
    );
  }

  // Duplicate items to ensure a seamless infinite scroll loop
  const displayItems = properties.length < 5 
    ? [...properties, ...properties, ...properties, ...properties]
    : [...properties, ...properties];

  const handleManualScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Navigation Controls & Header */}
      <div className="flex items-center justify-between mb-6 px-4 md:px-8 max-w-7xl mx-auto">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
              Exclusive Portfolio
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Featured Listings
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Hand-picked prime properties curated with 25+ years of market trust.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Link
            href="/properties?view=map"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-blue-600 transition-all shadow-sm"
          >
            <span>🗺️ Map View</span>
          </Link>

          <Link
            href="/properties"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-500/20"
          >
            <span>View All ({properties.length})</span>
            <span className="text-xs">→</span>
          </Link>

          <div className="flex items-center gap-1.5 ml-1">
            <button
              onClick={() => handleManualScroll("left")}
              aria-label="Scroll left"
              className="p-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => handleManualScroll("right")}
              aria-label="Scroll right"
              className="p-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Outer wrapper with edge gradient fade masks */}
      <div 
        className="relative w-full overflow-hidden group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Fade Gradient */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 md:w-20 z-20 bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent" />
        {/* Right Fade Gradient */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 md:w-20 z-20 bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent" />

        {/* Scrolling Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth px-6 md:px-12 py-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className={`flex gap-6 shrink-0 ${isPaused ? "animation-pause" : "animate-carousel"}`}>
            {displayItems.map((property, idx) => (
              <Link
                href={`/properties/${property.id}`}
                key={`${property.id}-${idx}`}
                className="group/card flex flex-col w-[300px] md:w-[340px] shrink-0 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Image Section */}
                <div className="h-52 bg-zinc-200 dark:bg-zinc-800 w-full relative overflow-hidden flex items-center justify-center">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <span className="text-zinc-400 text-sm">No Image Provided</span>
                  )}
                  {/* Subtle Gradient & Floating Price Badge */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent z-10" />
                  
                  <div className="absolute top-3 left-3 z-20">
                    <span className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {property.propertyType}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-20">
                    <FavoriteButton propertyId={property.id} />
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
                    <span className="text-white font-extrabold text-xl tracking-tight drop-shadow-md">
                      {formatPrice(property.price)}
                    </span>
                    <span className="bg-black/50 backdrop-blur-md text-zinc-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                      <Maximize2 className="w-3 h-3 text-cyan-400" />
                      {property.size} sqft
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-base md:text-lg mb-1.5 text-zinc-900 dark:text-white group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-3 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      {property.address || "Prime Location, Kota"}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>View Full Details</span>
                    <span className="group-hover/card:translate-x-1.5 transition-transform duration-300">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
