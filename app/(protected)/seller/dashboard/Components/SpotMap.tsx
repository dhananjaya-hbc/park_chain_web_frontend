"use client";

import { useEffect, useMemo } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import BaseLeafletMap from "@/components/custom/BaseLeafletMap";

const DEFAULT_CENTER: [number, number] = [6.9271, 79.8612]; // Colombo, Sri Lanka

const createLocationIcon = (
  color: string,
  shadow: string,
  popupY: number
) =>
  new L.DivIcon({
    className: "",
    html: `<div style="
      width:26px;height:26px;
      display:flex;align-items:center;justify-content:center;
      filter:drop-shadow(${shadow});
    "><svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 22C12 22 20 14.5 20 9.5C20 5.35786 16.6421 2 12.5 2C8.35786 2 5 5.35786 5 9.5C5 14.5 12 22 12 22Z" fill="${color}" stroke="white" stroke-width="1.8"/>
      <circle cx="12.5" cy="9.5" r="3" fill="white"/>
    </svg></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 24],
    popupAnchor: [0, popupY],
  });

const activeIcon = createLocationIcon("#41ab5d", "0 2px 6px rgba(65,171,93,0.5)", -20);
const inactiveIcon = createLocationIcon("#9ca3af", "0 2px 6px rgba(0,0,0,0.2)", -20);

interface Spot {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  pricePerHour: number;
}

function FitBounds({ spots }: { spots: Spot[] }) {
  const map = useMap();
  useEffect(() => {
    if (spots.length === 0) return;
    if (spots.length === 1) {
      map.setView([spots[0].latitude, spots[0].longitude], 14);
      return;
    }
    const bounds = L.latLngBounds(spots.map((s) => [s.latitude, s.longitude]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, spots]);
  return null;
}

export default function SpotMap({ spots }: { spots: Spot[] }) {
  const center = useMemo<[number, number]>(
    () => (spots.length > 0 ? [spots[0].latitude, spots[0].longitude] : DEFAULT_CENTER),
    [spots]
  );

  return (
    <BaseLeafletMap
        className="spot-map"
        center={center}
        zoom={12}
      >
        <FitBounds spots={spots} />
        {spots.map(({ id, latitude, longitude, isActive, name, address, pricePerHour }) => {
          const statusClass = isActive
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-500";

          return (
          <Marker key={id} position={[latitude, longitude]} icon={isActive ? activeIcon : inactiveIcon}>
            <Popup>
              <div className="text-xs min-w-[140px]">
                <p className="font-bold text-gray-900 mb-0.5">{name}</p>
                <p className="text-gray-500 mb-1">{address}</p>
                <div className="flex items-center justify-between">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusClass}`}>
                    {isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-gray-700 font-medium">
                    ${pricePerHour}/hr
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        )})}
    </BaseLeafletMap>
  );
}
