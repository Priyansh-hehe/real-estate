"use client";

import { useEffect } from "react";

export interface ViewedProperty {
  id: string;
  title: string;
  price: number;
  propertyType: string;
  size: number;
  address?: string | null;
  image?: string | null;
  viewedAt: number;
}

export default function RecentlyViewedTracker({ property }: { property: ViewedProperty }) {
  useEffect(() => {
    try {
      const existing: ViewedProperty[] = JSON.parse(
        localStorage.getItem("paliwal_recent_views") || "[]"
      );

      // Filter out this property if already present to put it at the front
      const filtered = existing.filter((item) => item.id !== property.id);

      const updated = [
        {
          ...property,
          viewedAt: Date.now(),
        },
        ...filtered,
      ].slice(0, 10); // Keep max 10 recent properties

      localStorage.setItem("paliwal_recent_views", JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  }, [property]);

  return null;
}
