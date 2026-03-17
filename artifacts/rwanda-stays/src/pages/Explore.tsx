import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PropertiesMap } from "@/components/map/PropertiesMap";
import { AccommodationCard } from "@/components/accommodations/AccommodationCard";
import { useListAccommodations, AccommodationType } from "@workspace/api-client-react";
import { Search, SlidersHorizontal, Map as MapIcon, List } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function Explore() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [showMapOnMobile, setShowMapOnMobile] = useState(false);
  const [filters, setFilters] = useState({
    type: '' as AccommodationType | '',
    province: '',
  });

  const { data, isLoading } = useListAccommodations({
    type: filters.type || undefined,
    province: filters.province || undefined,
    limit: 20
  });

  const types = Object.values(AccommodationType);
  const provinces = ["Kigali City", "Northern Province", "Southern Province", "Eastern Province", "Western Province"];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      
      {/* Filter Bar */}
      <div className="border-b border-border bg-card z-10 flex-shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 border-r border-border pr-4">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold whitespace-nowrap">Filters</span>
          </div>
          
          <select 
            className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value as AccommodationType})}
          >
            <option value="">Any Type</option>
            {types.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>

          <select 
            className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            value={filters.province}
            onChange={(e) => setFilters({...filters, province: e.target.value})}
          >
            <option value="">Any Province</option>
            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          
          <div className="ml-auto md:hidden">
            <Button size="sm" variant="outline" onClick={() => setShowMapOnMobile(!showMapOnMobile)}>
              {showMapOnMobile ? <><List className="w-4 h-4 mr-2" /> List</> : <><MapIcon className="w-4 h-4 mr-2" /> Map</>}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full">
        {/* List View */}
        <div className={`w-full lg:w-[60%] flex-col h-full overflow-y-auto ${showMapOnMobile ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 sm:p-6">
            <h1 className="text-2xl font-display font-bold mb-6">
              {data?.total || 0} stays found
            </h1>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-72 bg-muted animate-pulse rounded-2xl"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data?.accommodations.map(acc => (
                  <AccommodationCard 
                    key={acc.id} 
                    accommodation={acc} 
                    isActive={activeId === acc.id}
                    onMouseEnter={() => setActiveId(acc.id)}
                    onMouseLeave={() => setActiveId(null)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map View */}
        <div className={`w-full lg:w-[40%] bg-muted h-full p-4 lg:p-6 lg:pl-0 ${!showMapOnMobile ? 'hidden lg:block' : 'block'}`}>
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-border">
            {data && data.accommodations.length > 0 && (
              <PropertiesMap 
                accommodations={data.accommodations} 
                activeId={activeId}
                onMarkerClick={(id) => setActiveId(id)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
