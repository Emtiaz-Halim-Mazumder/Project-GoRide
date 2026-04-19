'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapBounds({ routeGeometry, origin, destination }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (origin && destination) {
      const timeoutId = setTimeout(() => {
        try {
          map.invalidateSize();
          const bounds = L.latLngBounds([
            [origin.lat, origin.lng],
            [destination.lat, destination.lng]
          ]);
          if (routeGeometry && routeGeometry.coordinates) {
            const routeBounds = L.latLngBounds(routeGeometry.coordinates.map(coord => [coord[1], coord[0]]));
            map.fitBounds(routeBounds, { padding: [30, 30] });
          } else {
            map.fitBounds(bounds, { padding: [30, 30] });
          }
        } catch (e) {
          console.warn("Map bounds error:", e);
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [map, routeGeometry, origin, destination]);
  return null;
}

function MapInvalidator() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const timeoutId = setTimeout(() => {
      try {
        map.invalidateSize();
      } catch (e) {
        console.warn("Map invalidate error:", e);
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [map]);
  return null;
}

export default function RouteMap({ fareData }) {
  const defaultCenter = [23.8103, 90.4125]; // Dhaka
  
  let positions = [];
  if (fareData && fareData.geometry && fareData.geometry.coordinates) {
    positions = fareData.geometry.coordinates.map(coord => [coord[1], coord[0]]);
  }

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer center={defaultCenter} zoom={12} style={{ height: '100%', width: '100%', minHeight: '400px', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {!fareData ? (
          <MapInvalidator />
        ) : (
          <>
            <MapBounds routeGeometry={fareData.geometry} origin={fareData.origin} destination={fareData.destination} />
            
            <Marker position={[fareData.origin.lat, fareData.origin.lng]}>
              <Popup>Start: {fareData.origin.name}</Popup>
            </Marker>
            
            <Marker position={[fareData.destination.lat, fareData.destination.lng]}>
              <Popup>End: {fareData.destination.name}</Popup>
            </Marker>

            {positions.length > 0 && (
              <Polyline positions={positions} color="#16a34a" weight={5} opacity={0.8} />
            )}
          </>
        )}
      </MapContainer>
      
      {!fareData && (
        <div className="absolute inset-0 z-[400] flex items-center justify-center bg-white/40 pointer-events-none">
          <div className="bg-white px-4 py-2 rounded-lg shadow-md font-medium text-gray-700 pointer-events-auto">
            Enter Origin and Destination to see the route
          </div>
        </div>
      )}
    </div>
  );
}
