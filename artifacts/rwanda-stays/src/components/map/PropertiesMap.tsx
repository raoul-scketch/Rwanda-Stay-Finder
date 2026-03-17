import { useEffect, useRef } from 'react';
import type { Accommodation } from '@workspace/api-client-react';
import { formatRWF } from '@/lib/utils';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoicmFvdWxraGFsZWIiLCJhIjoiY21tdWxndXJuMW1yczJxcjIwMnZxYXpxaiJ9.da3JAqJX1QgbRfxzgdgGlA';

interface Props {
  accommodations: Accommodation[];
  activeId?: number | null;
  onMarkerClick?: (id: number) => void;
  className?: string;
}

export function PropertiesMap({ accommodations, activeId, onMarkerClick, className = "h-full w-full" }: Props) {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (activeId && mapRef.current) {
      const activeItem = accommodations.find(a => a.id === activeId);
      if (activeItem) {
        mapRef.current.flyTo({
          center: [activeItem.longitude, activeItem.latitude],
          zoom: 14,
          duration: 1500
        });
      }
    }
  }, [activeId, accommodations]);

  return (
    <div className={`relative z-0 rounded-2xl overflow-hidden shadow-inner ${className}`}>
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: 29.8739,
          latitude: -1.9403,
          zoom: 8
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" />
        
        {accommodations.map((acc) => {
          const isActive = acc.id === activeId;
          return (
            <Marker
              key={acc.id}
              longitude={acc.longitude}
              latitude={acc.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                onMarkerClick?.(acc.id);
              }}
            >
              <div 
                className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${isActive ? 'scale-110 z-50' : 'z-10 hover:scale-105 hover:z-40'}`}
              >
                <div className={`px-3 py-1.5 rounded-full text-sm font-bold shadow-lg border-2 ${isActive ? 'bg-white text-primary border-white' : 'bg-card text-primary border-transparent'}`}>
                  {formatRWF(acc.pricePerNight).replace('RWF', '').trim()}
                </div>
                <div className={`w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent ${isActive ? 'border-t-white' : 'border-t-card'}`} />
              </div>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}