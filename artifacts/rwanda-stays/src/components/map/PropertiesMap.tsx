import { useEffect, useRef, useState } from 'react';
import type { Accommodation } from '@workspace/api-client-react';
import { formatRWF } from '@/lib/utils';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';

// Fix Leaflet's default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props {
  accommodations: Accommodation[];
  activeId?: number | null;
  onMarkerClick?: (id: number) => void;
  className?: string;
}

// Component to handle map centering when active item changes
function MapController({ activeItem, items }: { activeItem?: Accommodation, items: Accommodation[] }) {
  const map = useMap();

  useEffect(() => {
    if (activeItem) {
      map.flyTo([activeItem.latitude, activeItem.longitude], 14, { duration: 1.5 });
    } else if (items.length > 0) {
      // Auto-fit bounds if no active item but we have items
      const bounds = L.latLngBounds(items.map(item => [item.latitude, item.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [activeItem, map, items]);

  return null;
}

export function PropertiesMap({ accommodations, activeId, onMarkerClick, className = "h-full w-full" }: Props) {
  // Center of Rwanda roughly
  const center: [number, number] = [-1.9403, 29.8739];
  const activeItem = accommodations.find(a => a.id === activeId);

  const createCustomIcon = (price: number, isActive: boolean) => {
    return L.divIcon({
      className: `custom-price-marker ${isActive ? 'active' : ''}`,
      html: `<div>${formatRWF(price).replace('RWF', '').trim()}</div>`,
      iconSize: [60, 30],
      iconAnchor: [30, 15],
    });
  };

  return (
    <div className={`relative z-0 rounded-2xl overflow-hidden shadow-inner ${className}`}>
      <MapContainer 
        center={center} 
        zoom={9} 
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {accommodations.map((acc) => (
          <Marker
            key={acc.id}
            position={[acc.latitude, acc.longitude]}
            icon={createCustomIcon(acc.pricePerNight, acc.id === activeId)}
            eventHandlers={{
              click: () => onMarkerClick?.(acc.id),
            }}
          />
        ))}

        <MapController activeItem={activeItem} items={accommodations} />
      </MapContainer>
    </div>
  );
}
