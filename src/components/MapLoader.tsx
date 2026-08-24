"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse flex items-center justify-center text-zinc-500">Loading Map...</div>
});

export default function MapLoader({ latitude, longitude }: { latitude: number, longitude: number }) {
  return <PropertyMap latitude={latitude} longitude={longitude} />;
}
