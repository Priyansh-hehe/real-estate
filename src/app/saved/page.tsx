import Link from "next/link";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import FavoriteButton from "@/components/FavoriteButton";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";
import { Heart, Building, Maximize2, MapPin, Sparkles, ArrowLeft } from "lucide-react";

export default async function SavedPropertiesPage() {
  const session = await getServerSession(authOptions);

  // If user is logged in, fetch their saved favorites from PostgreSQL
  let savedProperties: any[] = [];
  if (session?.user?.id) {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        property: true,
      },
      orderBy: { createdAt: "desc" },
    });
    savedProperties = favorites.map((f) => f.property);
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

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
                <div
                  key={property.id}
                  className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl relative"
                >
                  <div className="h-48 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                    {property.images && property.images[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />

                    <div className="absolute top-3 left-3 z-20">
                      <span className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {property.propertyType}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-20">
                      <FavoriteButton propertyId={property.id} initialIsFavorited={true} />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
                      <span className="text-white font-extrabold text-xl tracking-tight drop-shadow-md">
                        {formatPrice(property.price)}
                      </span>
                      <span className="bg-black/50 backdrop-blur-md text-zinc-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                        <Maximize2 className="w-3 h-3 text-cyan-400" />
                        {property.size} sqft
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {property.title}
                      </h3>
                      <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-4 line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        {property.address || "Location in Kota"}
                      </p>
                    </div>

                    <Link
                      href={`/properties/${property.id}`}
                      className="w-full py-2 text-center rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold transition-colors"
                    >
                      View Property Details →
                    </Link>
                  </div>
                </div>
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
