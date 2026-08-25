"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PropertyMapProps {
  latitude: number;
  longitude: number;
}

export default function PropertyMap({ latitude, longitude }: PropertyMapProps) {
  const position = new L.LatLng(latitude, longitude);

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm relative z-0">
      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={true} // Enabled scroll zooming for trackpads and mice
        style={{ height: "100%", width: "100%" }}
      >
        {/* Standard OSM with CSS Dark Mode Invert */}
        <TileLayer
          className="map-tiles"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}></Marker>
      </MapContainer>
    </div>
  );
}
