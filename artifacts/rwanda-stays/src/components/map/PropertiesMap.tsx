import { useEffect, useRef, useState } from 'react';
import type { Accommodation } from '@workspace/api-client-react';
import { formatRWF } from '@/lib/utils';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoicmFvdWxraGFsZWIiLCJhIjoiY21tdWxndXJuMW1yczJxcjIwMnZxYXpxaiJ9.da3JAqJX1QgbRfxzgdgGlA';

const RWANDA_CENTER = { longitude: 29.8739, latitude: -1.9403 };

interface Props {
  accommodations: Accommodation[];
  activeId?: number | null;
  focusId?: number | null;
  onMarkerClick?: (id: number) => void;
  className?: string;
}

function FallbackMap({ accommodations, activeId, onMarkerClick }: Props) {
  return (
    <div className="w-full h-full bg-muted/50 flex flex-col items-center justify-center gap-3">
      <MapPin className="w-8 h-8 text-muted-foreground/60" />
      <div className="text-center">
        <p className="text-sm font-semibold text-muted-foreground">Interactive Map</p>
        <p className="text-xs text-muted-foreground/60 mt-1">{accommodations.length} properties in Rwanda</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 max-w-[220px] mt-1">
        {accommodations.slice(0, 4).map((acc) => (
          <button key={acc.id} onClick={() => onMarkerClick?.(acc.id)}
            className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors
              ${activeId === acc.id ? 'bg-primary text-white border-primary' : 'bg-card border-border text-foreground hover:border-primary/50'}`}>
            {formatRWF(acc.pricePerNight).replace('RWF', 'RF')}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PropertiesMap({ accommodations, activeId, focusId, onMarkerClick, className = "h-full w-full" }: Props) {
  const mapRef = useRef<any>(null);
  const [mapError, setMapError] = useState(false);
  const prevFocusId = useRef<number | null | undefined>(null);

  // flyTo only when focusId changes (i.e. user clicked a marker) — NOT on hover
  useEffect(() => {
    if (!mapRef.current || !focusId || focusId === prevFocusId.current) return;
    prevFocusId.current = focusId;
    const item = accommodations.find(a => a.id === focusId);
    if (item) {
      try {
        mapRef.current.flyTo({
          center: [item.longitude, item.latitude],
          zoom: 13,
          duration: 1200,
          essential: true,
        });
      } catch (_) {}
    }
  }, [focusId, accommodations]);

  if (mapError) return <FallbackMap accommodations={accommodations} activeId={activeId} onMarkerClick={onMarkerClick} />;

  return (
    <div className={`relative z-0 overflow-hidden ${className}`}>
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{ longitude: RWANDA_CENTER.longitude, latitude: RWANDA_CENTER.latitude, zoom: 7.5 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        attributionControl={false}
        onError={() => setMapError(true)}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {accommodations.map((acc) => {
          const isActive = acc.id === activeId;
          return (
            <Marker key={acc.id} longitude={acc.longitude} latitude={acc.latitude} anchor="bottom"
              onClick={(e) => { e.originalEvent.stopPropagation(); onMarkerClick?.(acc.id); }}>
              <div className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${isActive ? 'scale-110' : 'hover:scale-105'}`}
                style={{ zIndex: isActive ? 50 : 10 }}>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-lg border transition-all
                  ${isActive
                    ? 'bg-primary text-white border-primary shadow-primary/40'
                    : 'bg-background/95 text-foreground border-border/80 hover:bg-primary hover:text-white hover:border-primary'
                  }`}>
                  {formatRWF(acc.pricePerNight).replace('RWF ', 'RF ')}
                </div>
                <div className={`w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent
                  ${isActive ? 'border-t-primary' : 'border-t-background/95'}`} />
              </div>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}
