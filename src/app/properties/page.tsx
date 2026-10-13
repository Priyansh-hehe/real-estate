/**
 * ==============================================================================
 * ALL PROPERTIES CATALOG & MAP VIEW (src/app/properties/page.tsx)
 * ==============================================================================
 * Comprehensive property browsing page:
 * - Supports dual view modes: Grid View and Multi-Pin Interactive Map View (OpenStreetMap/Leaflet).
 * - Filter by property category (All, Residential Land & Plots, Buildings & Villas).
 * - Sort by Price (Low to High, High to Low) and Newest.
 * - Displays prices formatted in Indian Lakhs and Crores.
 * ==============================================================================
 */

import Link from "next/link";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import AllPropertiesMapLoader from "@/components/AllPropertiesMapLoader";
import PropertyCard from "@/components/PropertyCard";
import { 
  LayoutGrid, 
  Map as MapIcon, 
  Search, 
  Filter, 
  Building, 
  Maximize2, 
  MapPin, 
  Sparkles,
  ArrowUpDown
} from "lucide-react";
import { formatPrice } from "@/lib/format";

export default async function AllPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; view?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const query = params?.q || "";
  const propertyType = params?.type || "ALL";
  const viewMode = params?.view || "grid";
  const sort = params?.sort || "newest";

  // Build where filter
  const whereClause: any = {};

  if (query) {
    whereClause.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { address: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (propertyType !== "ALL") {
    whereClause.propertyType = propertyType;
  }

  // Order By
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-low") orderBy = { price: "asc" };
  if (sort === "price-high") orderBy = { price: "desc" };

  const properties = await prisma.property.findMany({
    where: whereClause,
    orderBy: orderBy,
  });

  const propertiesWithMapPins = properties.filter(
    (p) => p.latitude !== null && p.longitude !== null
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-blue-500 selection:text-white pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Page Title & Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                <Sparkles className="w-3 h-3 mr-1" /> All Listings ({properties.length})
              </span>
              {propertiesWithMapPins.length > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                  📍 {propertiesWithMapPins.length} with Map Pins
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Explore Properties in Kota
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Discover verified residential land plots, commercial buildings & luxury villas.
            </p>
          </div>

          {/* Grid vs Map View Toggle Button */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/properties?${new URLSearchParams({
                ...(query ? { q: query } : {}),
                ...(propertyType !== "ALL" ? { type: propertyType } : {}),
                ...(sort !== "newest" ? { sort } : {}),
                view: "grid",
              }).toString()}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Grid View</span>
            </Link>

            <Link
              href={`/properties?${new URLSearchParams({
                ...(query ? { q: query } : {}),
                ...(propertyType !== "ALL" ? { type: propertyType } : {}),
                ...(sort !== "newest" ? { sort } : {}),
                view: "map",
              }).toString()}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                viewMode === "map"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Map View ({propertiesWithMapPins.length})</span>
            </Link>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 my-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All Properties", value: "ALL" },
              { label: "Land & Plots", value: "LAND" },
              { label: "Buildings & Villas", value: "BUILDING" },
            ].map((tab) => (
              <Link
                key={tab.value}
                href={`/properties?${new URLSearchParams({
                  ...(query ? { q: query } : {}),
                  type: tab.value,
                  ...(sort !== "newest" ? { sort } : {}),
                  view: viewMode,
                }).toString()}`}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  propertyType === tab.value
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm"
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Sort Dropdown / Links */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500">
            <span className="hidden sm:inline font-medium">Sort by:</span>
            {[
              { label: "Newest", value: "newest" },
              { label: "Price: Low to High", value: "price-low" },
              { label: "Price: High to Low", value: "price-high" },
            ].map((sortOption) => (
              <Link
                key={sortOption.value}
                href={`/properties?${new URLSearchParams({
                  ...(query ? { q: query } : {}),
                  ...(propertyType !== "ALL" ? { type: propertyType } : {}),
                  sort: sortOption.value,
                  view: viewMode,
                }).toString()}`}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  sort === sortOption.value
                    ? "font-bold text-blue-600 dark:text-blue-400 underline decoration-2 underline-offset-4"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {sortOption.label}
              </Link>
            ))}
          </div>
        </div>

        {/* View Mode 1: Interactive Map View */}
        {viewMode === "map" ? (
          <div className="space-y-6">
            <AllPropertiesMapLoader properties={properties} />
            <p className="text-xs text-zinc-500 text-center">
              💡 Click on any pin on the map above to view the property preview, price, and details.
            </p>
          </div>
        ) : (
          /* View Mode 2: Grid View */
          <>
            {properties.length === 0 ? (
              <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-2">No matching properties found</h3>
                <p className="text-zinc-500 max-w-md mx-auto mb-6">
                  {query
                    ? `No listings matched "${query}". Try adjusting your keywords or clearing the filter.`
                    : "There are currently no listings under this category."}
                </p>
                <Link
                  href="/properties"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors inline-block"
                >
                  View All Properties
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
