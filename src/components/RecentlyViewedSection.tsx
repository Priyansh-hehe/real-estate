"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Building, Maximize2, MapPin, Trash2 } from "lucide-react";
import type { ViewedProperty } from "./RecentlyViewedTracker";

export default function RecentlyViewedSection({ currentPropertyId }: { currentPropertyId?: string }) {
  const [recentProperties, setRecentProperties] = useState<ViewedProperty[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored: ViewedProperty[] = JSON.parse(
        localStorage.getItem("paliwal_recent_views") || "[]"
      );
      // Exclude current property if specified
      const filtered = currentPropertyId
        ? stored.filter((item) => item.id !== currentPropertyId)
        : stored;
      setRecentProperties(filtered);
    } catch {
      setRecentProperties([]);
    }
  }, [currentPropertyId]);

  const clearHistory = () => {
    localStorage.removeItem("paliwal_recent_views");
    setRecentProperties([]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!mounted || recentProperties.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            Recently Viewed by You
          </h3>
          <span className="text-xs text-zinc-500 font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
            {recentProperties.length}
          </span>
        </div>

        <button
          onClick={clearHistory}
          className="text-xs text-zinc-400 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
        {recentProperties.map((item) => (
          <Link
            href={`/properties/${item.id}`}
            key={item.id}
            className="group/item flex flex-col w-[260px] shrink-0 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="h-36 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">
                  No Image
                </div>
              )}
              <div className="absolute top-2 left-2">
                <span className="bg-blue-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Building className="w-2.5 h-2.5" />
                  {item.propertyType}
                </span>
              </div>
            </div>

            <div className="p-3">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-1 mb-1 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-extrabold text-blue-600 dark:text-blue-400">
                  {formatPrice(item.price)}
                </span>
                <span className="text-zinc-500 text-[11px]">
                  {item.size} sqft
                </span>
              </div>
              {item.address && (
                <p className="text-[11px] text-zinc-500 line-clamp-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                  <span>{item.address}</span>
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
