import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

import Header from "@/components/Header";
import MapLoader from "@/components/MapLoader";
import FavoriteButton from "@/components/FavoriteButton";
import InquiryForm from "@/components/InquiryForm";
import RecentlyViewedTracker from "@/components/RecentlyViewedTracker";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";
import { ArrowLeft, Building, Maximize2, MapPin } from "lucide-react";

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 selection:bg-blue-500 selection:text-white">
      <Header />

      {/* Automatically record to client browsing history */}
      <RecentlyViewedTracker
        property={{
          id: property.id,
          title: property.title,
          price: property.price,
          propertyType: property.propertyType,
          size: property.size,
          address: property.address,
          image: property.images && property.images[0] ? property.images[0] : null,
          viewedAt: Date.now(),
        }}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Properties</span>
          </Link>

          <FavoriteButton propertyId={property.id} showText={true} />
        </div>

        {/* Header section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mb-2">
                {property.title}
              </h1>
              {property.address && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span>{property.address}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col md:items-end">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {formatPrice(property.price)}
              </span>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                  <Building className="w-3 h-3" />
                  {property.propertyType}
                </span>
                <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-3 py-1 rounded-full text-xs font-semibold">
                  <Maximize2 className="w-3 h-3" />
                  {property.size} sqft
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        {property.images && property.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {property.images.map((img, i) => (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 ${
                  i === 0 ? "h-[360px] md:h-[440px] md:col-span-2" : "h-[280px]"
                }`}
              >
                <img
                  src={img}
                  alt={`${property.title} - Image ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                Property Overview & Details
              </h2>
              <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                {property.description}
              </div>
            </section>

            {/* Map Section */}
            {property.latitude !== null && property.longitude !== null && (
              <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Geographic Location & Map</span>
                </h3>
                <MapLoader latitude={property.latitude} longitude={property.longitude} />
                {property.address && (
                  <p className="mt-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    📍 {property.address}
                  </p>
                )}
              </section>
            )}
          </div>

          {/* Sidebar (Right): Inquiry Form & Direct Contact */}
          <div className="space-y-6">
            <div className="sticky top-24">
              <InquiryForm
                propertyId={property.id}
                propertyTitle={property.title}
                propertyPrice={property.price}
              />
            </div>
          </div>
        </div>

        {/* Recently Viewed History Section */}
        <div className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800">
          <RecentlyViewedSection currentPropertyId={property.id} />
        </div>
      </main>
    </div>
  );
}
