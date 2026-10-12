/**
 * ==============================================================================
 * HEADER NAVIGATION COMPONENT (src/components/Header.tsx)
 * ==============================================================================
 * Top sticky navigation bar:
 * - Brand logo linking to Home.
 * - Hamburger toggle button for NavDrawer.
 * - Compact property search bar.
 * - Quick shortcuts to All Properties, Saved Wishlist, ThemeToggle, and UserMenu.
 * ==============================================================================
 */

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Search, Heart, Building2 } from "lucide-react";

import NavDrawer from "./NavDrawer";
import UserMenu from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="w-full flex items-center justify-between px-3 sm:px-8 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md sticky top-0 z-50 gap-2 sm:gap-4">
      {/* Left Area: 3-Bar Hamburger Menu + Brand Logo */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <NavDrawer session={session} />
        <Link href="/" className="text-lg sm:text-2xl font-extrabold tracking-tighter text-zinc-900 dark:text-white shrink-0">
          Paliwal Properties
        </Link>
      </div>

      {/* Sleek Compact Search Bar in Navigation */}
      <form action="/" method="GET" className="relative hidden md:flex items-center max-w-xs lg:max-w-md w-full mx-2">
        <input 
          type="text" 
          name="q"
          placeholder="Search properties, neighborhoods, city..." 
          className="w-full bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-full py-2 pl-10 pr-4 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-white placeholder:text-zinc-400 transition-all shadow-inner"
        />
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
      </form>
      
      {/* Right-side navigation & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* All Properties Catalog Link */}
        <Link 
          href="/properties" 
          className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:flex items-center gap-1.5"
        >
          <Building2 className="w-4 h-4 text-zinc-400" />
          <span>Properties</span>
        </Link>

        {/* Wishlist Link */}
        <Link
          href="/saved"
          aria-label="View Saved Properties"
          className="p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center justify-center"
          title="Saved Properties"
        >
          <Heart className="w-4 h-4" />
        </Link>

        <ThemeToggle />
        
        {session ? (
          <div className="flex items-center gap-2 sm:gap-2.5">
            {(session.user?.role === "ADMIN" || session.user?.role === "AGENT") && (
              <Link 
                href="/dashboard" 
                className="text-xs sm:text-sm font-semibold hover:text-blue-600 transition-colors bg-zinc-100 dark:bg-zinc-900 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-zinc-200 dark:border-zinc-800"
              >
                Dashboard
              </Link>
            )}
            <UserMenu session={session} />
          </div>
        ) : (
          <Link 
            href="/login" 
            className="text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
