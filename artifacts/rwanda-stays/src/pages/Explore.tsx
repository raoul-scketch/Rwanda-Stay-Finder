import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PropertiesMap } from "@/components/map/PropertiesMap";
import { AccommodationCard } from "@/components/accommodations/AccommodationCard";
import { useListAccommodations, AccommodationType } from "@workspace/api-client-react";
import { SlidersHorizontal, ChevronDown, Star, X } from "lucide-react";
import { formatRWF } from "@/lib/utils";

const PROVINCES = [
  "Kigali City",
  "Northern Province",
  "Southern Province",
  "Eastern Province",
  "Western Province",
];

const TYPES = Object.values(AccommodationType);

const AMENITIES = ["Free WiFi", "Pool", "Breakfast", "Parking", "Air Conditioning", "Gym"];

function AccordionSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-0">
      <button
        className="w-full flex items-center justify-between py-3.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
        onClick={() => setOpen(!open)}
      >
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function PriceSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="relative h-1.5 bg-border rounded-full mx-1">
        <div
          className="absolute h-full bg-primary rounded-full"
          style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={5000}
          value={value[0]}
          onChange={(e) => onChange([Math.min(Number(e.target.value), value[1] - 5000), value[1]])}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={5000}
          value={value[1]}
          onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0] + 5000)])}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
        <div
          className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full -translate-y-1/2 top-1/2 -translate-x-1/2 shadow-md pointer-events-none"
          style={{ left: `${pct(value[0])}%` }}
        />
        <div
          className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full -translate-y-1/2 top-1/2 translate-x-1/2 shadow-md pointer-events-none"
          style={{ right: `${100 - pct(value[1])}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatRWF(value[0])}</span>
        <span>{formatRWF(value[1])}</span>
      </div>
    </div>
  );
}

export default function Explore() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [filters, setFilters] = useState({
    types: [] as string[],
    provinces: [] as string[],
    priceRange: [0, 500000] as [number, number],
    minRating: 0,
    amenities: [] as string[],
  });

  const { data, isLoading } = useListAccommodations({ limit: 50 });

  const filteredData = data?.accommodations.filter((acc) => {
    if (filters.types.length && !filters.types.includes(acc.type)) return false;
    if (filters.provinces.length && !filters.provinces.includes(acc.province)) return false;
    if (acc.pricePerNight < filters.priceRange[0] || acc.pricePerNight > filters.priceRange[1]) return false;
    if (filters.minRating && acc.averageRating < filters.minRating) return false;
    return true;
  });

  const toggleType = (t: string) =>
    setFilters((f) => ({
      ...f,
      types: f.types.includes(t) ? f.types.filter((x) => x !== t) : [...f.types, t],
    }));

  const toggleProvince = (p: string) =>
    setFilters((f) => ({
      ...f,
      provinces: f.provinces.includes(p) ? f.provinces.filter((x) => x !== p) : [...f.provinces, p],
    }));

  const clearFilters = () =>
    setFilters({ types: [], provinces: [], priceRange: [0, 500000], minRating: 0, amenities: [] });

  const hasFilters =
    filters.types.length > 0 ||
    filters.provinces.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500000 ||
    filters.minRating > 0;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-[300px] shrink-0 border-r border-border overflow-y-auto bg-card">
          {/* Mini Map */}
          <div className="h-[220px] shrink-0 border-b border-border relative bg-muted">
            {data && data.accommodations.length > 0 ? (
              <PropertiesMap
                accommodations={data.accommodations}
                activeId={activeId}
                onMarkerClick={(id) => setActiveId(id)}
                className="h-full w-full"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Loading map...
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-bold text-foreground">Filters</span>
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear all
                </button>
              )}
            </div>

            {/* Budget */}
            <AccordionSection title="Your budget">
              <PriceSlider
                min={0}
                max={500000}
                value={filters.priceRange}
                onChange={(v) => setFilters((f) => ({ ...f, priceRange: v }))}
              />
            </AccordionSection>

            {/* Property Type */}
            <AccordionSection title="Property type">
              <div className="space-y-2.5">
                {TYPES.map((t) => (
                  <label key={t} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0
                        ${filters.types.includes(t) ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"}`}
                      onClick={() => toggleType(t)}
                    >
                      {filters.types.includes(t) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="text-sm text-foreground capitalize flex-1 group-hover:text-primary transition-colors cursor-pointer"
                      onClick={() => toggleType(t)}
                    >
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </AccordionSection>

            {/* Province */}
            <AccordionSection title="Location" defaultOpen={false}>
              <div className="space-y-2.5">
                {PROVINCES.map((p) => (
                  <label key={p} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0
                        ${filters.provinces.includes(p) ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"}`}
                      onClick={() => toggleProvince(p)}
                    >
                      {filters.provinces.includes(p) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="text-sm text-foreground flex-1 group-hover:text-primary transition-colors cursor-pointer"
                      onClick={() => toggleProvince(p)}
                    >
                      {p}
                    </span>
                  </label>
                ))}
              </div>
            </AccordionSection>

            {/* Rating */}
            <AccordionSection title="Guest rating" defaultOpen={false}>
              <div className="flex gap-2 flex-wrap">
                {[0, 3, 3.5, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilters((f) => ({ ...f, minRating: f.minRating === r ? 0 : r }))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors
                      ${filters.minRating === r ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
                  >
                    {r === 0 ? (
                      "Any"
                    ) : (
                      <>
                        <Star className="w-3 h-3 fill-current" />
                        {r}+
                      </>
                    )}
                  </button>
                ))}
              </div>
            </AccordionSection>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-foreground">
                {isLoading ? "Loading..." : `${filteredData?.length || 0} stays in Rwanda`}
              </span>
              {hasFilters && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  Filtered
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Mobile map toggle */}
              <button
                className="lg:hidden text-sm font-medium text-primary flex items-center gap-1.5"
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? "Show list" : "Show map"}
              </button>
            </div>
          </div>

          {/* Listings */}
          <div className="flex-1 overflow-y-auto">
            {/* Mobile map view */}
            {showMap && (
              <div className="lg:hidden h-80 border-b border-border">
                {data && (
                  <PropertiesMap
                    accommodations={data.accommodations}
                    activeId={activeId}
                    onMarkerClick={(id) => setActiveId(id)}
                    className="h-full w-full"
                  />
                )}
              </div>
            )}

            <div className="p-4 sm:p-6 space-y-4">
              {isLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-44 bg-muted animate-pulse rounded-2xl" />
                  ))}
                </>
              ) : filteredData?.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">
                  <p className="text-lg font-semibold mb-2">No stays match your filters</p>
                  <button onClick={clearFilters} className="text-primary hover:underline text-sm">
                    Clear all filters
                  </button>
                </div>
              ) : (
                filteredData?.map((acc) => (
                  <AccommodationCard
                    key={acc.id}
                    accommodation={acc}
                    isActive={activeId === acc.id}
                    onMouseEnter={() => setActiveId(acc.id)}
                    onMouseLeave={() => setActiveId(null)}
                    layout="horizontal"
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
