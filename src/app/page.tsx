import Link from "next/link";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import FeaturedPropertiesCarousel from "@/components/FeaturedPropertiesCarousel";
import { Award, ShieldCheck, Clock, MapPin, Sparkles } from "lucide-react";

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  // Await searchParams in Next.js 15+
  const params = await searchParams;
  const query = params?.q || "";

  // Fetch properties from the database, applying a search filter if a query exists
  const properties = await prisma.property.findMany({
    where: query ? {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
      ]
    } : {},
    orderBy: { createdAt: 'desc' },
    take: 15,
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-blue-500 selection:text-white">
      <Header />

      {/* Sleek One-Liner Trust Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-1">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-cyan-50/90 dark:from-zinc-900 dark:via-blue-950/20 dark:to-zinc-900 border border-blue-100/80 dark:border-zinc-800 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">With 25+ Years of Experience</span>
            <span className="text-zinc-400 dark:text-zinc-600 hidden md:inline">—</span>
            <span className="text-zinc-600 dark:text-zinc-400 hidden md:inline">
              Kota&apos;s premier real estate consultancy for verified land plots, luxury homes & commercial spaces.
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40 shrink-0">
            <span>✓ 100% Verified Titles</span>
          </div>
        </div>
      </div>

      {/* Search Result Banner (If user searched) */}
      {query && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-3">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs sm:text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-200">
              Showing search results for: <span className="font-bold underline">&ldquo;{query}&rdquo;</span> ({properties.length} found)
            </p>
            <Link href="/" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Clear Search ✕
            </Link>
          </div>
        </div>
      )}

      {/* Infinite Horizontal Scrolling Featured Listings (Immediately Below) */}
      <section id="featured-listings" className="w-full pt-2 pb-10">
        <FeaturedPropertiesCarousel properties={properties} />
      </section>
    </div>
  );
}
