/**
 * ==============================================================================
 * NAVIGATION PROGRESS BAR (src/components/NavigationProgressBar.tsx)
 * ==============================================================================
 * Ultra-slim top loading indicator and micro-spinner:
 * - Detects internal route link clicks and instant client navigation transitions.
 * - Displays a razor-thin 2.5px glowing progress bar at the top edge of the screen.
 * - Shows a tiny corner loader pill during active page transitions.
 * - Automatically completes on route change, browser back/forward (popstate),
 *   and page restoration (pageshow/bfcache).
 * - Includes a strict 2.5s safety timeout to guarantee the bar never freezes.
 * ==============================================================================
 */

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Complete and hide progress bar cleanly
  const completeLoading = useCallback(() => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    setProgress(100);

    resetTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 200);
  }, []);

  // Start progress animation
  const startLoading = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);

    setIsLoading(true);
    setProgress(15);

    // Incrementally crawl forward while waiting for route transition
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) return prev;
        const remaining = 90 - prev;
        return prev + Math.max(1, Math.floor(remaining * 0.15));
      });
    }, 120);

    // Hard safety timeout: Never remain active longer than 2.5s under any condition
    safetyTimerRef.current = setTimeout(() => {
      completeLoading();
    }, 2500);
  }, [completeLoading]);

  // Complete progress bar whenever route successfully resolves
  useEffect(() => {
    completeLoading();
  }, [pathname, searchParams, completeLoading]);

  // Intercept all internal Link clicks for 0ms instantaneous feedback
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external, anchor hash, or new tab links
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        target.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if URL is internal
      try {
        const url = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);

        if (url.origin === currentUrl.origin) {
          // If navigating to a different pathname or search query, trigger loader
          if (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search) {
            startLoading();
          }
        }
      } catch {
        // Fallback for relative paths
        if (href.startsWith("/") && href !== window.location.pathname) {
          startLoading();
        }
      }
    };

    // When navigating with browser back/forward button or restored from cache,
    // immediately clear any loader state so it NEVER stays stuck
    const handlePopState = () => {
      completeLoading();
    };

    const handlePageShow = () => {
      completeLoading();
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, [startLoading, completeLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <>
      {/* Razor-thin Top Progress Line */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[999999] pointer-events-none transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: isLoading ? 1 : 0,
          background: "linear-gradient(90deg, #2563eb, #38bdf8, #60a5fa)",
          boxShadow: "0 0 10px rgba(56, 189, 248, 0.8), 0 0 5px rgba(37, 99, 235, 0.6)",
        }}
      />

      {/* Subtle Micro-Loading Pill in Top-Right Corner */}
      <div
        className={`fixed top-3 right-3 sm:right-6 z-[999999] pointer-events-none transition-opacity duration-200 ${
          isLoading ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/90 dark:bg-zinc-800/90 text-white text-[11px] font-medium backdrop-blur-md shadow-lg border border-white/10 animate-pulse">
          <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />
          <span className="hidden sm:inline">Loading...</span>
        </div>
      </div>
    </>
  );
}
