"use client";

import { PropsWithChildren, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface BaseLeafletMapProps extends PropsWithChildren {
    center: LatLngExpression;
    zoom?: number;
    minHeight?: string;
    className?: string;
}

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function InvalidateMapSize() {
    const map = useMap();

    useEffect(() => {
        const id = window.setTimeout(() => {
            map.invalidateSize();
        }, 100);

        return () => window.clearTimeout(id);
    }, [map]);

    return null;
}

export default function BaseLeafletMap({
    center,
    zoom = 12,
    minHeight = '260px',
    className = '',
    children,
}: BaseLeafletMapProps) {
    return (
        <>
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={false}
                className={`h-full w-full shared-leaflet-map ${className}`.trim()}
                style={{ width: '100%', height: '100%', minHeight }}
                zoomControl={true}
                attributionControl={false}
            >
                <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
                <InvalidateMapSize />
                {children}
            </MapContainer>

            <style jsx global>{`
                .shared-leaflet-map .leaflet-control-zoom a {
                    width: 24px;
                    height: 24px;
                    line-height: 22px;
                    font-size: 14px;
                }
                
                /* Ensure Leaflet elements stay below navbar (z-40) */
                .shared-leaflet-map .leaflet-control {
                    z-index: 20 !important;
                }
                
                .shared-leaflet-map .leaflet-popup {
                    z-index: 21 !important;
                }
                
                .shared-leaflet-map .leaflet-control-zoom {
                    z-index: 20 !important;
                }
            `}</style>
        </>
    );
}
