/**
 * ==============================================================================
 * REUSABLE PROPERTY CARD COMPONENT (src/components/PropertyCard.tsx)
 * ==============================================================================
 * Interactive property card used across the catalog and saved wishlist pages:
 * - Instant Tap/Click Feedback: Tactile micro-press (scale-98) and glowing active ring.
 * - In-place Processing Indicator: Displays a small loading spinner inside the card
 *   the exact instant it is tapped, giving immediate reassurance during page load.
 * - Formatted pricing in Indian Lakhs/Crores.
 * - Embedded quick Favorite/Bookmark heart button.
 * ==============================================================================
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, Maximize2, MapPin, Loader2 } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import { formatPrice } from "@/lib/format";

export interface PropertyCardData {
  id: string;
  title: string;
  description: string;
  price: number;
  propertyType: string;
  size: number;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  images: string[];
}

interface PropertyCardProps {
  property: PropertyCardData;
  showFavorite?: boolean;
  initialIsFavorited?: boolean;
}

export default function PropertyCard({
  property,
  showFavorite = true,
  initialIsFavorited = false,
}: PropertyCardProps) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  // Reset loading state whenever pathname changes or user navigates back
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const handleClick = () => {
    setIsNavigating(true);
  };

  return (
    <Link
      href={`/properties/${property.id}`}
      onClick={handleClick}
      className={`group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border transition-all duration-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 cursor-pointer active:scale-[0.98] tap-feedback ${
        isNavigating
          ? "ring-2 ring-blue-500 border-blue-500 shadow-blue-500/10 shadow-lg scale-[0.99]"
          : "border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500"
      }`}
    >
      {/* Image Banner Section */}
      <div className="h-52 bg-zinc-200 dark:bg-zinc-800 w-full relative overflow-hidden flex items-center justify-center">
        {property.images && property.images[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-zinc-400 text-sm">No Image</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-20 flex gap-1.5 flex-wrap">
          <span className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Building className="w-3 h-3" />
            {property.propertyType}
          </span>
          {property.latitude && property.longitude && (
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              📍 Map Pin
            </span>
          )}
        </div>

        {/* Top Right: Favorite Button & Loading Pill */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          {isNavigating && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 animate-pulse">
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
              <span>Loading</span>
            </span>
          )}
          {showFavorite && (
            <div onClick={(e) => e.stopPropagation()}>
              <FavoriteButton
                propertyId={property.id}
                initialIsFavorited={initialIsFavorited}
              />
            </div>
          )}
        </div>

        {/* Bottom Price & Specs */}
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
          <h3 className="font-bold text-lg mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {property.title}
          </h3>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-2.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            {property.address || "Location in Kota"}
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4">
            {property.description}
          </p>
        </div>

        {/* Bottom Details Link / Loading State */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
          {isNavigating ? (
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Opening property...</span>
            </span>
          ) : (
            <>
              <span>View Details</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
