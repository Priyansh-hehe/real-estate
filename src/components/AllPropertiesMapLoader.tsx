"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { MapProperty } from "./AllPropertiesMap";

const DynamicAllPropertiesMap = dynamic(() => import("./AllPropertiesMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-zinc-500 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="text-sm font-medium">Loading Interactive Kota Real Estate Map...</span>
    </div>
  ),
});

export default function AllPropertiesMapLoader({ properties }: { properties: MapProperty[] }) {
  return <DynamicAllPropertiesMap properties={properties} />;
}
