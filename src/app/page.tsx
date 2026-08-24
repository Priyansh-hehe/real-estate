import Link from "next/link";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";

export default async function Home({ searchParams }: { searchParams: { q?: string } }) {
  // Await searchParams (Required in Next.js 15+)
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
    take: 12,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6">
          Find the perfect place to <br className="hidden md:block"/> call <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">home</span>.
        </h1>
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10">
          Discover premium land plots, luxury buildings, and commercial real estate with our exclusive platform.
        </p>

        {/* Real Search Bar */}
        <form action="/" method="GET" className="flex w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 p-2 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <input 
            type="text" 
            name="q"
            defaultValue={query}
            placeholder="Search by city, neighborhood, or address..." 
            className="flex-1 bg-transparent px-6 text-sm focus:outline-none dark:text-white"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-sm font-semibold transition-colors duration-300">
            Search
          </button>
        </form>
      </main>

      {/* Dynamic Properties Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold mb-8">Featured Listings</h2>
        
        {properties.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-semibold mb-2">No properties listed yet</h3>
            <p className="text-zinc-500">Check back soon for premium real estate listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link href={`/properties/${property.id}`} key={property.id} className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
                <div className="h-48 bg-zinc-200 dark:bg-zinc-800 w-full relative overflow-hidden flex items-center justify-center">
                  {property.images && property.images.length > 0 ? (
                    <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="text-zinc-400 text-sm">No Image</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                  <div className="absolute bottom-4 left-4 z-20 text-white font-bold text-lg">{formatPrice(property.price)}</div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{property.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-1">{property.address || 'Address not specified'}</p>
                  <div className="flex gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">{property.propertyType}</span>
                    <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">{property.size} sqft</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
