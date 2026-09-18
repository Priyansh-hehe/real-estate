"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { Building, Maximize2, MapPin } from "lucide-react";

// Fix Leaflet's default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom highlighted marker icon
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface MapProperty {
  id: string;
  title: string;
  price: number;
  propertyType: string;
  size: number;
  address?: string | null;
  latitude: number | null;
  longitude: number | null;
  images: string[];
}

interface AllPropertiesMapProps {
  properties: MapProperty[];
}

// Helper component to auto-fit bounds when properties change
function ChangeMapView({ properties }: { properties: MapProperty[] }) {
  const map = useMap();

  useEffect(() => {
    const validCoords = properties.filter(
      (p) => p.latitude !== null && p.longitude !== null
    );

    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(
        validCoords.map((p) => [p.latitude as number, p.longitude as number])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [properties, map]);

  return null;
}

export default function AllPropertiesMap({ properties }: AllPropertiesMapProps) {
  const propertiesWithCoords = properties.filter(
    (p) => p.latitude !== null && p.longitude !== null
  );

  // Default fallback center: Kota, Rajasthan (25.18, 75.83)
  const defaultCenter = new L.LatLng(25.18, 75.83);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          className="map-tiles"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeMapView properties={propertiesWithCoords} />

        {propertiesWithCoords.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude as number, property.longitude as number]}
            icon={customIcon}
          >
            <Popup className="custom-leaflet-popup">
              <div className="w-56 p-1 text-zinc-900 font-sans">
                {property.images && property.images[0] && (
                  <div className="h-28 w-full rounded-lg overflow-hidden mb-2 relative bg-zinc-100">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {property.propertyType}
                    </div>
                  </div>
                )}
                
                <h4 className="font-bold text-sm text-zinc-900 line-clamp-1 mb-1">
                  {property.title}
                </h4>

                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-extrabold text-blue-600 text-sm">
                    {formatPrice(property.price)}
                  </span>
                  <span className="text-zinc-500 font-medium">
                    {property.size} sqft
                  </span>
                </div>

                {property.address && (
                  <p className="text-[11px] text-zinc-500 line-clamp-1 mb-2">
                    📍 {property.address}
                  </p>
                )}

                <Link
                  href={`/properties/${property.id}`}
                  className="block w-full text-center py-1.5 px-3 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                >
                  View Property →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
