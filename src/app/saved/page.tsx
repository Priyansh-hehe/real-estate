/**
 * ==============================================================================
 * SAVED PROPERTIES & WISHLIST HUB (src/app/saved/page.tsx)
 * ==============================================================================
 * Customer hub showing:
 * 1. Saved/Bookmarked properties queried from PostgreSQL for authenticated users.
 * 2. Guest bookmark support via FavoriteButton.
 * 3. Recently viewed properties history slider powered by client localStorage.
 * ==============================================================================
 */

import Link from "next/link";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import FavoriteButton from "@/components/FavoriteButton";
import PropertyCard from "@/components/PropertyCard";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";
import { formatPrice } from "@/lib/format";
import { Heart, Building, Maximize2, MapPin, Sparkles, ArrowLeft } from "lucide-react";

export default async function SavedPropertiesPage() {
  const session = await getServerSession(authOptions);

  // If user is logged in, fetch their saved favorites from PostgreSQL
  let savedProperties: any[] = [];
  if (session?.user?.id && (prisma as any).favorite) {
    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId: session.user.id },
        include: {
          property: true,
        },
        orderBy: { createdAt: "desc" },
      });
      savedProperties = favorites.map((f) => f.property);
    } catch (err) {
      console.error("Failed to load favorites:", err);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-blue-500 selection:text-white pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-blue-600 transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Properties</span>
          </Link>

          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
              <Heart className="w-3 h-3 mr-1 fill-rose-500 text-rose-500" /> Wishlist Hub
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Saved & Shortlisted Properties
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Keep track of your favorite real estate listings and recently viewed plots.
          </p>
        </div>

        {/* Section 1: Saved Favorites */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Your Shortlist</span>
              <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full font-medium">
                {savedProperties.length}
              </span>
            </h2>

            {!session && (
              <p className="text-xs text-zinc-500">
                💡 <Link href="/login" className="text-blue-600 underline font-medium">Sign in</Link> to permanently sync your wishlist across devices.
              </p>
            )}
          </div>

          {savedProperties.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base mb-1">Your wishlist is empty</h3>
              <p className="text-xs text-zinc-500 mb-6">
                Click the heart icon on any property to save it here for easy comparison.
              </p>
              <Link
                href="/properties"
                className="inline-block py-2.5 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
              >
                Explore Properties
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  initialIsFavorited={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Recently Viewed History */}
        <section className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <RecentlyViewedSection />
        </section>
      </main>
    </div>
  );
}
