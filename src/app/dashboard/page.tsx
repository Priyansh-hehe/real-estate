import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { deleteProperty } from "@/app/actions/property";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Fetch properties belonging to this admin
  const properties = await prisma.property.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Properties</h1>
        <Link 
          href="/dashboard/add" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add New Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-sm">
          <h3 className="text-xl font-semibold mb-2">No properties yet</h3>
          <p className="text-zinc-500 mb-6">You haven't added any real estate listings yet.</p>
          <Link href="/dashboard/add" className="text-blue-600 hover:underline">
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {property.images[0] ? (
                <img src={property.images[0]} alt={property.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                  No Image Provided
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg truncate pr-4">{property.title}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    ${property.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{property.description}</p>
                <div className="flex justify-between items-center text-sm border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <span className="text-zinc-600 dark:text-zinc-400">{property.propertyType} • {property.size} sqft</span>
                  
                  {/* Delete Button calling our Server Action */}
                  <form action={async () => {
                    "use server";
                    await deleteProperty(property.id);
                  }}>
                    <button type="submit" className="text-red-500 hover:text-red-700 font-medium">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
