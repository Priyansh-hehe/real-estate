import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      {/* Navigation Bar */}
      <nav className="w-full flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="text-2xl font-bold tracking-tighter">
          PrimeEstate<span className="text-blue-600">.</span>
        </div>
        <div className="flex gap-4">
          <Link href="/properties" className="text-sm font-medium hover:text-blue-600 transition-colors">Properties</Link>
          <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded-full">Sign In</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6">
          Find the perfect place to <br className="hidden md:block"/> call <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">home</span>.
        </h1>
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10">
          Discover premium land plots, luxury buildings, and commercial real estate with our exclusive platform.
        </p>

        {/* Search Bar Mockup */}
        <div className="flex w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 p-2 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <input 
            type="text" 
            placeholder="Search by city, neighborhood, or address..." 
            className="flex-1 bg-transparent px-6 text-sm focus:outline-none dark:text-white"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-sm font-semibold transition-colors duration-300">
            Search
          </button>
        </div>
      </main>

      {/* Featured Properties Mockup */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold mb-8">Featured Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-colors duration-300 shadow-sm hover:shadow-md">
              <div className="h-48 bg-zinc-200 dark:bg-zinc-800 w-full relative overflow-hidden flex items-center justify-center">
                <span className="text-zinc-400 text-sm">Property Image</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                <div className="absolute bottom-4 left-4 z-20 text-white font-bold text-lg">$1,250,000</div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">Luxury Villa {i}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">123 Example Street, City</p>
                <div className="flex gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  <span>4 Beds</span>
                  <span>3 Baths</span>
                  <span>2,500 sqft</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
