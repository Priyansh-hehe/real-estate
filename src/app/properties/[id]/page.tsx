import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import the map to avoid SSR issues with Leaflet
const PropertyMap = dynamic(() => import("@/components/PropertyMap"), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse flex items-center justify-center text-zinc-500">Loading Map...</div>
});

export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      {/* Navigation */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-white">
              Paliwal Properties
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">{property.title}</h1>
          <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold">{formatPrice(property.price)}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full">
              {property.propertyType}
            </span>
            <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full">
              {property.size} sqft
            </span>
          </div>
        </div>

        {/* Images Grid (if any) */}
        {property.images && property.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {property.images.map((img, i) => (
              <div key={i} className={`relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 ${i === 0 ? 'h-[400px] md:col-span-2' : 'h-[300px]'}`}>
                {/* Note: using standard img for now since we have raw URLs. Next/Image requires configured domains */}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Description</h2>
              <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">
                {property.description}
              </div>
            </section>
          </div>

          {/* Sidebar / Map */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Contact Agent</h3>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors">
                Request Details
              </button>
            </div>

            {/* Map Section */}
            {(property.latitude !== null && property.longitude !== null) && (
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 pl-2">Location</h3>
                <PropertyMap latitude={property.latitude} longitude={property.longitude} />
                {property.address && (
                  <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 pl-2">{property.address}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
