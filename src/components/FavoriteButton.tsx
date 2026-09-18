"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/app/actions/favorite";

interface FavoriteButtonProps {
  propertyId: string;
  initialIsFavorited?: boolean;
  className?: string;
  showText?: boolean;
}

export default function FavoriteButton({
  propertyId,
  initialIsFavorited = false,
  className = "",
  showText = false,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with localStorage for guest users
  useEffect(() => {
    try {
      const localFavorites = JSON.parse(
        localStorage.getItem("paliwal_favorites") || "[]"
      ) as string[];
      if (localFavorites.includes(propertyId)) {
        setIsFavorited(true);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [propertyId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    // Optimistic UI update
    const previousState = isFavorited;
    const nextState = !isFavorited;
    setIsFavorited(nextState);
    setIsLoading(true);

    // Update localStorage for guests
    try {
      const localFavorites = JSON.parse(
        localStorage.getItem("paliwal_favorites") || "[]"
      ) as string[];
      let updated: string[];
      if (nextState) {
        updated = Array.from(new Set([...localFavorites, propertyId]));
      } else {
        updated = localFavorites.filter((id) => id !== propertyId);
      }
      localStorage.setItem("paliwal_favorites", JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }

    try {
      const res = await toggleFavoriteAction(propertyId);
      if (res && res.success) {
        setIsFavorited(res.isFavorited);
      }
    } catch (err) {
      console.error("Failed to sync favorite with server:", err);
      // Keep optimistic state in localStorage
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      className={`group/fav flex items-center gap-1.5 p-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
        isFavorited
          ? "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
          : "bg-black/30 backdrop-blur-md text-white hover:bg-black/50 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700"
      } ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-300 group-hover/fav:scale-125 ${
          isFavorited ? "fill-rose-500 text-rose-500" : "fill-none"
        }`}
      />
      {showText && (
        <span className="text-xs font-semibold pr-1">
          {isFavorited ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}
