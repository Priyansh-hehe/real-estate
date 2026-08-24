"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }: any) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function MapUpdater({ position }: { position: L.LatLng | null }) {
  const map = useMap();
  if (position) {
    map.flyTo(position, 14, { animate: true, duration: 1.5 });
  }
  return null;
}

export default function MapPicker() {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Free Nominatim Geocoding API
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const firstResult = data[0];
        const newPos = new L.LatLng(parseFloat(firstResult.lat), parseFloat(firstResult.lon));
        setPosition(newPos);
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (err) {
      console.error("Search failed", err);
      alert("Search failed. Please drop a pin manually.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Location</label>
      
      {/* Search Bar */}
      <div className="flex gap-2">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch(e as any);
            }
          }}
          placeholder="Search for an area or city (e.g. Connaught Place)" 
          className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="button" 
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="h-[350px] w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 relative z-0">
        <MapContainer 
          center={[28.6139, 77.2090]} // Default center (New Delhi)
          zoom={5} 
          scrollWheelZoom={true} 
          style={{ height: "100%", width: "100%" }}
        >
          {/* CartoDB Dark Matter Theme */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
          <MapUpdater position={position} />
        </MapContainer>
      </div>
      
      {/* Hidden inputs to pass the lat/lng to our Server Action form */}
      <input type="hidden" name="latitude" value={position?.lat || ""} />
      <input type="hidden" name="longitude" value={position?.lng || ""} />
      
      {position && (
        <p className="text-xs text-green-600 dark:text-green-400">
          Location selected: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
        </p>
      )}
      {!position && (
        <p className="text-xs text-zinc-500">
          Search for an area, or click anywhere on the map to set the precise property location.
        </p>
      )}
    </div>
  );
}
