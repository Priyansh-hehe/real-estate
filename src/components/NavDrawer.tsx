"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { 
  Menu, 
  X, 
  Home, 
  PlusCircle, 
  Building2, 
  Layers, 
  MapPin, 
  PhoneCall, 
  MessageCircle, 
  Sparkles, 
  Clock, 
  Compass,
  User,
  Heart
} from "lucide-react";

interface NavDrawerProps {
  session?: {
    user?: {
      name?: string | null;
      email?: string | null;
      role?: string;
    };
  } | null;
}

export default function NavDrawer({ session }: NavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key press and lock body scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const toggleDrawer = () => setIsOpen(!isOpen);

  const drawerContent = (
    <>
      {/* Full Screen Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[9999] transition-opacity duration-300 animate-in fade-in"
        />
      )}

      {/* Full Height Slide-out Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 h-screen w-[320px] sm:w-[380px] max-w-[85vw] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl z-[10000] flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
          <div>
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5"
            >
              <span>Paliwal Properties</span>
            </Link>
            <div className="flex items-center gap-1 mt-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              <Sparkles className="w-3 h-3" />
              <span>25+ Years of Proven Trust</span>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle Navigation & Quick Links */}
        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 px-2">
              Navigation
            </p>
            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Home className="w-4 h-4 text-zinc-400" />
                <span>Home</span>
              </Link>

              <Link
                href="/properties"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Building2 className="w-4 h-4 text-zinc-400" />
                <span>All Properties</span>
              </Link>

              <Link
                href="/properties?view=map"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Interactive Map View</span>
              </Link>

              <Link
                href="/saved"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Saved Properties</span>
                </div>
                <span className="text-[10px] bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold px-2 py-0.5 rounded-full">
                  Wishlist
                </span>
              </Link>

              {(session?.user?.role === "ADMIN" || session?.user?.role === "AGENT") ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Management Dashboard</span>
                  </Link>

                  <Link
                    href="/dashboard/add"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>+ Add New Property</span>
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <User className="w-4 h-4 text-zinc-400" />
                  <span>{session ? "My Account" : "Member / Agent Sign In"}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Property Categories */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 px-2">
              Browse Categories
            </p>
            <div className="space-y-1">
              <Link
                href="/?q=LAND"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>Residential Land & Plots</span>
                </div>
                <span className="text-[11px] text-zinc-400">View</span>
              </Link>

              <Link
                href="/?q=BUILDING"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span>Luxury Homes & Buildings</span>
                </div>
                <span className="text-[11px] text-zinc-400">View</span>
              </Link>
            </div>
          </div>

          {/* Top Prime Locations in Kota */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 px-2">
              Popular Kota Locations
            </p>
            <div className="flex flex-wrap gap-1.5 px-2">
              {["Talwandi", "Vigyan Nagar", "Kunhari", "Rajiv Gandhi Nagar", "Borkheda", "Gumanpura"].map((loc) => (
                <Link
                  key={loc}
                  href={`/?q=${encodeURIComponent(loc)}`}
                  onClick={() => setIsOpen(false)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 border border-zinc-200 dark:border-zinc-800 transition-colors flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  <span>{loc}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Direct Expert Advisory / Contact */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-zinc-900 border border-blue-100 dark:border-blue-900/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span>Direct Property Advisory</span>
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
              Consult with our senior real estate consultants for verified registry & plot site visits.
            </p>
            <div className="flex gap-2">
              <a
                href="https://wa.me/919414177565?text=Hello%20Paliwal%20Properties%2C%20I%20am%20interested%20in%20consulting%20about%20properties%20in%20Kota."
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:+919414177565"
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 9414177565</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer / Info */}
        <div className="p-5 border-t border-zinc-100 dark:border-zinc-900 text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 font-medium">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
          </div>
          <p className="text-[11px]">Kota, Rajasthan • Paliwal Properties</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 3-Bar Hamburger Button */}
      <button
        onClick={toggleDrawer}
        aria-label="Open Navigation Menu"
        className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
      >
        <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Render Drawer into document.body to avoid parent CSS stacking clipping */}
      {mounted && createPortal(drawerContent, document.body)}
    </>
  );
}
