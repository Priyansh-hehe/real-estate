/**
 * ==============================================================================
 * FEATURED PROPERTIES CAROUSEL (src/components/FeaturedPropertiesCarousel.tsx)
 * ==============================================================================
 * Homepage infinite conveyor-belt carousel:
 * - Truly infinite, seamless loop powered by a high-performance RAF engine.
 * - Mobile Touch & Swipe Support: Touch down immediately pauses the animation,
 *   full native touch sliding/dragging allowed, and resumes smoothly after swipe.
 * - Desktop Click & Drag: Allows grabbing and sliding cards with mouse or trackpad.
 * - Responsive Mobile Header: Mobile-friendly flex layout preventing horizontal overflow.
 * - Left/Right navigation buttons with smooth boundary wrapping.
 * - Prices formatted in Indian Lakhs/Crores.
 * ==============================================================================
 */

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, Building, Maximize2 } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import { formatPrice } from "@/lib/format";

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

// Ensure the base sequence has enough cards to exceed any desktop viewport width
function getBalancedItems(properties: PropertyItem[]): PropertyItem[] {
  if (properties.length === 0) return [];
  const minCards = 8;
  const repeatCount = Math.max(1, Math.ceil(minCards / properties.length));
  const result: PropertyItem[] = [];
  for (let i = 0; i < repeatCount; i++) {
    result.push(...properties);
  }
  return result;
}

export default function FeaturedPropertiesCarousel({ properties }: FeaturedPropertiesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const set1Ref = useRef<HTMLDivElement>(null);
  const set2Ref = useRef<HTMLDivElement>(null);

  const scrollPosRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isInteractingRef = useRef(false);
  const interactionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mouse drag & touch state
  const isMouseDownRef = useRef(false);
  const isTouchingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const [isHovered, setIsHovered] = useState(false);

  // Keep isHoveredRef in sync with state
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  const baseItems = getBalancedItems(properties);

  // Calculate the pixel distance of one full repetition set
  const getLoopWidth = useCallback(() => {
    if (!set1Ref.current || !set2Ref.current) return 0;
    return set2Ref.current.offsetLeft - set1Ref.current.offsetLeft;
  }, []);

  // Gracefully resume auto-scroll after user interaction or deceleration stops
  const resumeAutoScroll = useCallback((delay = 2500) => {
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
    }
    interactionTimerRef.current = setTimeout(() => {
      // Only resume if user is not actively pressing/hovering
      if (!isHoveredRef.current && !isMouseDownRef.current && !isTouchingRef.current) {
        isInteractingRef.current = false;
        const container = scrollContainerRef.current;
        if (container) {
          scrollPosRef.current = container.scrollLeft;
        }
      }
    }, delay);
  }, []);

  // Initialize scroll position to the middle set (Set 2)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const timer = setTimeout(() => {
      const loopWidth = getLoopWidth();
      if (loopWidth > 0) {
        container.scrollLeft = loopWidth;
        scrollPosRef.current = loopWidth;
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [getLoopWidth, baseItems.length]);

  // High-performance continuous animation loop
  useEffect(() => {
    const SPEED = 35; // Pixels per second
    let animationFrameId: number;
    let lastTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const container = scrollContainerRef.current;
      if (
        container &&
        !isHoveredRef.current &&
        !isInteractingRef.current &&
        !isMouseDownRef.current &&
        !isTouchingRef.current
      ) {
        const loopWidth = getLoopWidth();

        if (loopWidth > 0) {
          scrollPosRef.current += SPEED * delta;

          // Seamless boundary check: wrap smoothly around buffer sets
          if (scrollPosRef.current >= loopWidth * 1.5) {
            scrollPosRef.current -= loopWidth;
          } else if (scrollPosRef.current < loopWidth * 0.5) {
            scrollPosRef.current += loopWidth;
          }

          container.scrollLeft = scrollPosRef.current;
        }
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [getLoopWidth]);

  // Handle scroll events (tracks native swipe, trackpad, and wheel scroll)
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const loopWidth = getLoopWidth();
    if (loopWidth <= 0) return;

    // Track position during manual interaction or deceleration
    if (isInteractingRef.current || isHoveredRef.current || isMouseDownRef.current || isTouchingRef.current) {
      scrollPosRef.current = container.scrollLeft;
      // While momentum scrolling continues, delay resumption
      resumeAutoScroll(2500);
    }

    // Wrap around boundaries seamlessly without hitting 0 or buffer ends
    if (container.scrollLeft >= loopWidth * 1.5) {
      container.scrollLeft -= loopWidth;
      scrollPosRef.current = container.scrollLeft;
    } else if (container.scrollLeft < loopWidth * 0.5) {
      container.scrollLeft += loopWidth;
      scrollPosRef.current = container.scrollLeft;
    }
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
    }
    isTouchingRef.current = true;
    isInteractingRef.current = true;
    hasDraggedRef.current = false;

    const touch = e.touches[0];
    dragStartXRef.current = touch.clientX;
    const container = scrollContainerRef.current;
    if (container) {
      dragStartScrollLeftRef.current = container.scrollLeft;
      scrollPosRef.current = container.scrollLeft;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isTouchingRef.current) return;
    isInteractingRef.current = true;

    const touch = e.touches[0];
    const diff = Math.abs(touch.clientX - dragStartXRef.current);
    if (diff > 8) {
      hasDraggedRef.current = true;
    }

    const container = scrollContainerRef.current;
    if (container) {
      scrollPosRef.current = container.scrollLeft;
    }
  };

  const handleTouchEnd = () => {
    isTouchingRef.current = false;
    // Allow user to examine card without immediate resumption
    resumeAutoScroll(2500);
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only primary mouse button
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
    }
    isMouseDownRef.current = true;
    isInteractingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.pageX;

    const container = scrollContainerRef.current;
    if (container) {
      dragStartScrollLeftRef.current = container.scrollLeft;
      scrollPosRef.current = container.scrollLeft;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current) return;
    const delta = e.pageX - dragStartXRef.current;
    if (Math.abs(delta) > 6) {
      hasDraggedRef.current = true;
    }
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollLeft = dragStartScrollLeftRef.current - delta;
      scrollPosRef.current = container.scrollLeft;
    }
  };

  const handleMouseUp = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      resumeAutoScroll(2000);
    }
  };

  const handleMouseLeave = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      resumeAutoScroll(1500);
    }
    setIsHovered(false);
  };

  // Manual arrow navigation (Left & Right)
  const handleManualScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const loopWidth = getLoopWidth();
    const cardStep = 320; // Card width + gap

    isInteractingRef.current = true;
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
    }

    const target = direction === "right"
      ? container.scrollLeft + cardStep
      : container.scrollLeft - cardStep;

    container.scrollTo({
      left: target,
      behavior: "smooth",
    });

    scrollPosRef.current = target;

    // Resume auto-scroll after smooth scroll finishes
    resumeAutoScroll(1800);
  };

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-4xl mx-auto shadow-sm mx-4">
        <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">No properties listed yet</h3>
        <p className="text-zinc-500 dark:text-zinc-400">Check back soon for premium real estate listings.</p>
      </div>
    );
  }

  // Render card helper
  const renderCard = (property: PropertyItem, keyPrefix: string, index: number) => (
    <Link
      href={`/properties/${property.id}`}
      key={`${keyPrefix}-${property.id}-${index}`}
      draggable={false}
      onClick={(e) => {
        // Prevent accidental clicks if the user was dragging/swiping
        if (hasDraggedRef.current) {
          e.preventDefault();
        }
      }}
      className="group/card flex flex-col w-[275px] sm:w-[310px] md:w-[340px] shrink-0 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 cursor-pointer select-none"
    >
      {/* Image Section */}
      <div className="h-48 sm:h-52 bg-zinc-200 dark:bg-zinc-800 w-full relative overflow-hidden flex items-center justify-center select-none">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            draggable={false}
            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700 ease-out select-none pointer-events-none"
          />
        ) : (
          <span className="text-zinc-400 text-sm">No Image Provided</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent z-10 pointer-events-none" />

        <div className="absolute top-3 left-3 z-20">
          <span className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Building className="w-3 h-3" />
            {property.propertyType}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-20" onClick={(e) => e.stopPropagation()}>
          <FavoriteButton propertyId={property.id} />
        </div>

        <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
          <span className="text-white font-extrabold text-lg sm:text-xl tracking-tight drop-shadow-md">
            {formatPrice(property.price)}
          </span>
          <span className="bg-black/50 backdrop-blur-md text-zinc-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
            <Maximize2 className="w-3 h-3 text-cyan-400" />
            {property.size} sqft
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-base md:text-lg mb-1 text-zinc-900 dark:text-white group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors line-clamp-1">
            {property.title}
          </h3>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-2.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            {property.address || "Prime Location, Kota"}
          </p>
        </div>

        <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
          <span>View Full Details</span>
          <span className="group-hover/card:translate-x-1.5 transition-transform duration-300">→</span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="relative w-full max-w-full overflow-hidden py-4">
      {/* Responsive Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
              Exclusive Portfolio
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Featured Listings
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Hand-picked prime properties curated with 25+ years of market trust.
          </p>
        </div>

        {/* Action Controls: Compact and responsive for all screen sizes */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Link
              href="/properties?view=map"
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-blue-600 transition-all shadow-sm"
            >
              <span>🗺️ Map</span>
            </Link>

            <Link
              href="/properties"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-500/20 whitespace-nowrap"
            >
              <span>View All ({properties.length})</span>
              <span className="text-xs">→</span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleManualScroll("left")}
              aria-label="Previous properties"
              className="p-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => handleManualScroll("right")}
              aria-label="Next properties"
              className="p-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Outer wrapper with edge gradient fade masks */}
      <div
        className="relative w-full max-w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left Fade Gradient */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-12 md:w-24 z-20 bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent" />
        {/* Right Fade Gradient */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-12 md:w-24 z-20 bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent" />

        {/* Continuous Infinite Scrolling Track with Touch & Drag Support */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="flex overflow-x-auto no-scrollbar px-4 sm:px-8 md:px-12 py-4 select-none touch-pan-x cursor-grab active:cursor-grabbing w-full max-w-full"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* 3 identical sets for truly seamless, infinite conveyor wrapping */}
          <div className="flex gap-4 sm:gap-6 shrink-0">
            {/* Set 1: Preceding Buffer */}
            <div ref={set1Ref} className="flex gap-4 sm:gap-6 shrink-0">
              {baseItems.map((prop, idx) => renderCard(prop, "s1", idx))}
            </div>

            {/* Set 2: Active Set */}
            <div ref={set2Ref} className="flex gap-4 sm:gap-6 shrink-0">
              {baseItems.map((prop, idx) => renderCard(prop, "s2", idx))}
            </div>

            {/* Set 3: Following Buffer */}
            <div className="flex gap-4 sm:gap-6 shrink-0">
              {baseItems.map((prop, idx) => renderCard(prop, "s3", idx))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
