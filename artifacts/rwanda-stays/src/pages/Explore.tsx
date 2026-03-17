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
    minPrice: '',
    maxPrice: '',
    minRating: ''
  });

  const { data, isLoading } = useListAccommodations({
    type: filters.type || undefined,
    province: filters.province || undefined,
    limit: 50
  });

  const filteredData = data?.accommodations.filter(acc => {
    if (filters.minPrice && acc.pricePerNight < Number(filters.minPrice)) return false;
    if (filters.maxPrice && acc.pricePerNight > Number(filters.maxPrice)) return false;
    if (filters.minRating && acc.averageRating < Number(filters.minRating)) return false;
    return true;
  });

  const types = Object.values(AccommodationType);
  const provinces = ["Kigali City", "Northern Province", "Southern Province", "Eastern Province", "Western Province"];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      
      {/* Filter Bar */}
      <div className="border-b border-border bg-card z-10 flex-shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 pr-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold whitespace-nowrap">Filters</span>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              className="h-10 px-4 rounded-full border border-input bg-muted/50 hover:bg-muted text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-colors cursor-pointer"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value as AccommodationType})}
            >
              <option value="">Any Type</option>
              {types.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>

            <select 
              className="h-10 px-4 rounded-full border border-input bg-muted/50 hover:bg-muted text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-colors cursor-pointer"
              value={filters.province}
              onChange={(e) => setFilters({...filters, province: e.target.value})}
            >
              <option value="">Any Province</option>
              {provinces.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            
            <div className="flex items-center h-10 px-3 rounded-full border border-input bg-muted/50">
              <span className="text-sm text-muted-foreground mr-2">RWF</span>
              <input 
                type="number" 
                placeholder="Min" 
                className="w-16 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                value={filters.minPrice}
                onChange={e => setFilters({...filters, minPrice: e.target.value})}
              />
              <span className="text-muted-foreground mx-1">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                className="w-20 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                value={filters.maxPrice}
                onChange={e => setFilters({...filters, maxPrice: e.target.value})}
              />
            </div>

            <select 
              className="h-10 px-4 rounded-full border border-input bg-muted/50 hover:bg-muted text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-colors cursor-pointer"
              value={filters.minRating}
              onChange={(e) => setFilters({...filters, minRating: e.target.value})}
            >
              <option value="">Any Rating</option>
              <option value="4">4.0+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>
          
          <div className="ml-auto md:hidden">
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => setShowMapOnMobile(!showMapOnMobile)}>
              {showMapOnMobile ? <><List className="w-4 h-4 mr-2" /> List</> : <><MapIcon className="w-4 h-4 mr-2" /> Map</>}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full">
        {/* List View */}
        <div className={`w-full lg:w-[60%] flex-col h-full overflow-y-auto ${showMapOnMobile ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 sm:p-6 pb-20">
            <h1 className="text-2xl font-display font-bold mb-6">
              {filteredData?.length || 0} stays found
            </h1>
            
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded-2xl"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredData?.map(acc => (
                  <AccommodationCard 
                    key={acc.id} 
                    accommodation={acc} 
                    isActive={activeId === acc.id}
                    onMouseEnter={() => setActiveId(acc.id)}
                    onMouseLeave={() => setActiveId(null)}
                    layout="horizontal"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map View */}
        <div className={`w-full lg:w-[40%] bg-muted h-full p-4 lg:p-6 lg:pl-0 ${!showMapOnMobile ? 'hidden lg:block' : 'block'}`}>
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-border">
            {filteredData && filteredData.length > 0 && (
              <PropertiesMap 
                accommodations={filteredData} 
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