"use client";

import { createProperty } from "@/app/actions/property";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

// Dynamically import the map so it only loads on the client side (prevents Next.js errors)
const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse flex items-center justify-center text-zinc-500">Loading Map...</div>
});

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      await createProperty(formData);
      // Next.js Server Action handles the revalidation, so we just redirect
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to create property.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Property</h1>
        <p className="text-zinc-500 mt-2">Fill out the details below to create a new real estate listing.</p>
      </div>

      <form action={handleSubmit} className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Title</label>
            <input 
              name="title" 
              type="text" 
              required 
              placeholder="e.g. Beautiful 5 Acre Farm Land"
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Price (₹)</label>
            <input 
              name="price" 
              type="number" 
              required 
              placeholder="5000000"
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Size (Sq Ft)</label>
            <input 
              name="size" 
              type="number" 
              required 
              placeholder="2500"
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Property Type</label>
            <select 
              name="propertyType" 
              required
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="LAND" className="dark:bg-zinc-800">Land Plot</option>
              <option value="BUILDING" className="dark:bg-zinc-800">Building / House</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Main Image URL</label>
            <input 
              name="image" 
              type="url" 
              placeholder="https://imgur.com/..."
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Description</label>
          <textarea 
            name="description" 
            required 
            rows={4}
            placeholder="Describe the property..."
            className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
          ></textarea>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Address (Optional)</label>
          <input 
            name="address" 
            type="text" 
            placeholder="123 Main St, City"
            className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
          />
        </div>

        {/* The Leaflet Map Component */}
        <div className="col-span-2 pt-4">
          <MapPicker />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 mt-8"
        >
          {loading ? "Publishing Property..." : "Publish Property"}
        </button>

      </form>
    </div>
  );
}
