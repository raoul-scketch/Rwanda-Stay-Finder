import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PropertiesMap } from "@/components/map/PropertiesMap";
import { AccommodationCard } from "@/components/accommodations/AccommodationCard";
import { useListAccommodations, AccommodationType } from "@workspace/api-client-react";
import { SlidersHorizontal, ChevronDown, Star, X, Maximize2, RotateCcw } from "lucide-react";
import { formatRWF } from "@/lib/utils";

const PROVINCES = [
  "Kigali City",
  "Northern Province",
  "Southern Province",
  "Eastern Province",
  "Western Province",
];

const TYPES = Object.values(AccommodationType);

const FACILITIES = [
  "Free WiFi",
  "Swimming Pool",
  "Free Parking",
  "Breakfast Included",
  "Air Conditioning",
  "Gym / Fitness",
  "Restaurant",
  "Room Service",
  "Spa",
  "Airport Shuttle",
  "Pet Friendly",
  "Non-smoking Rooms",
];

function Checkbox({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1">
      <div
        onClick={onChange}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0
          ${checked ? "bg-primary border-primary" : "border-border group-hover:border-primary/60"}`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span onClick={onChange} className="text-sm text-foreground flex-1 group-hover:text-primary transition-colors capitalize">
        {label}
      </span>
    </label>
  );
}

function AccordionSection({
  title, children, defaultOpen = true, count,
}: { title: string; children: React.ReactNode; defaultOpen?: boolean; count?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/60 last:border-0">
      <button
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-foreground hover:text-primary transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          {title}
          {!!count && <span className="text-xs bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-medium">{count}</span>}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

function PriceSlider({ value, onChange }: { value: [number, number]; onChange: (v: [number, number]) => void }) {
  const MIN = 0, MAX = 500000;
  const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100;
  return (
    <div className="space-y-4">
      <div className="relative h-1.5 bg-border rounded-full mt-2 mb-6">
        <div className="absolute h-full bg-primary rounded-full transition-all"
          style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }} />
        {/* Min thumb */}
        <input type="range" min={MIN} max={MAX} step={5000} value={value[0]}
          onChange={(e) => onChange([Math.min(Number(e.target.value), value[1] - 5000), value[1]])}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" style={{ zIndex: 3 }} />
        {/* Max thumb */}
        <input type="range" min={MIN} max={MAX} step={5000} value={value[1]}
          onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0] + 5000)])}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" style={{ zIndex: 4 }} />
        <div className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full -translate-y-1/2 top-1/2 -translate-x-1/2 shadow-md pointer-events-none"
          style={{ left: `${pct(value[0])}%`, zIndex: 2 }} />
        <div className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full -translate-y-1/2 top-1/2 translate-x-1/2 shadow-md pointer-events-none"
          style={{ right: `${100 - pct(value[1])}%`, zIndex: 2 }} />
      </div>
      <div className="flex justify-between gap-2">
        <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2 text-xs font-semibold text-foreground text-center">
          {formatRWF(value[0])}
        </div>
        <div className="text-muted-foreground text-xs self-center">–</div>
        <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2 text-xs font-semibold text-foreground text-center">
          {formatRWF(value[1])}
        </div>
      </div>
    </div>
  );
}

export default function Explore() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [showMobileMap, setShowMobileMap] = useState(false);

  const [filters, setFilters] = useState({
    types: [] as string[],
    provinces: [] as string[],
    priceRange: [0, 500000] as [number, number],
    minRating: 0,
    facilities: [] as string[],
    freeCancellation: false,
  });

  const { data, isLoading } = useListAccommodations({ limit: 50 });

  const filteredData = data?.accommodations.filter((acc) => {
    if (filters.types.length && !filters.types.includes(acc.type)) return false;
    if (filters.provinces.length && !filters.provinces.includes(acc.province)) return false;
    if (acc.pricePerNight < filters.priceRange[0] || acc.pricePerNight > filters.priceRange[1]) return false;
    if (filters.minRating && acc.averageRating < filters.minRating) return false;
    return true;
  });

  const toggle = (key: "types" | "provinces" | "facilities", val: string) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((x: string) => x !== val) : [...f[key], val],
    }));

  const clearFilters = () =>
    setFilters({ types: [], provinces: [], priceRange: [0, 500000], minRating: 0, facilities: [], freeCancellation: false });

  const activeFilterCount =
    filters.types.length + filters.provinces.length + filters.facilities.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.freeCancellation ? 1 : 0);

  const accomData = data?.accommodations ?? [];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* ── LEFT SIDEBAR ── */}
        <aside className="hidden lg:flex flex-col w-[360px] shrink-0 border-r border-border bg-card overflow-hidden">
          {/* Mini map */}
          <div className="relative h-[240px] shrink-0 border-b border-border bg-muted">
            {accomData.length > 0 ? (
              <>
                <PropertiesMap
                  accommodations={accomData}
                  activeId={hoveredId}
                  focusId={focusedId}
                  onMarkerClick={(id) => { setFocusedId(id); setHoveredId(id); }}
                  className="h-full w-full"
                />
                <button
                  onClick={() => setMapExpanded(true)}
                  className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 hover:bg-card transition-colors shadow-md z-10"
                >
                  <Maximize2 className="w-3 h-3" />
                  Expand map
                </button>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">Loading map…</div>
            )}
          </div>

          {/* Filters */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-bold">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="text-xs bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                  <RotateCcw className="w-3 h-3" /> Reset all
                </button>
              )}
            </div>

            {/* Budget */}
            <AccordionSection title="Your budget per night"
              count={filters.priceRange[0] > 0 || filters.priceRange[1] < 500000 ? 1 : 0}>
              <PriceSlider value={filters.priceRange}
                onChange={(v) => setFilters((f) => ({ ...f, priceRange: v }))} />
            </AccordionSection>

            {/* Free cancellation */}
            <AccordionSection title="Booking options">
              <Checkbox label="Free cancellation" checked={filters.freeCancellation}
                onChange={() => setFilters((f) => ({ ...f, freeCancellation: !f.freeCancellation }))} />
            </AccordionSection>

            {/* Property type */}
            <AccordionSection title="Property type" count={filters.types.length}>
              {TYPES.map((t) => (
                <Checkbox key={t} label={t} checked={filters.types.includes(t)} onChange={() => toggle("types", t)} />
              ))}
            </AccordionSection>

            {/* Province */}
            <AccordionSection title="Location / Province" defaultOpen={false} count={filters.provinces.length}>
              {PROVINCES.map((p) => (
                <Checkbox key={p} label={p} checked={filters.provinces.includes(p)} onChange={() => toggle("provinces", p)} />
              ))}
            </AccordionSection>

            {/* Rating */}
            <AccordionSection title="Guest rating" defaultOpen={false}
              count={filters.minRating > 0 ? 1 : 0}>
              <div className="flex flex-wrap gap-2 pt-1">
                {([0, 3, 3.5, 4, 4.5] as number[]).map((r) => (
                  <button key={r}
                    onClick={() => setFilters((f) => ({ ...f, minRating: f.minRating === r ? 0 : r }))}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors
                      ${filters.minRating === r ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
                  >
                    {r === 0 ? "Any" : <><Star className="w-3 h-3 fill-current" />{r}+</>}
                  </button>
                ))}
              </div>
            </AccordionSection>

            {/* Facilities */}
            <AccordionSection title="Facilities" defaultOpen={false} count={filters.facilities.length}>
              {FACILITIES.map((f) => (
                <Checkbox key={f} label={f} checked={filters.facilities.includes(f)} onChange={() => toggle("facilities", f)} />
              ))}
            </AccordionSection>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <div className="border-b border-border bg-card px-5 py-3 flex items-center justify-between shrink-0">
            <span className="font-semibold text-foreground">
              {isLoading ? "Loading…" : `${filteredData?.length ?? 0} stays in Rwanda`}
            </span>
            <div className="flex items-center gap-3">
              {/* Mobile map toggle */}
              <button className="lg:hidden text-sm font-medium text-primary"
                onClick={() => setShowMobileMap((v) => !v)}>
                {showMobileMap ? "Hide map" : "Show map"}
              </button>
            </div>
          </div>

          {/* Mobile map */}
          {showMobileMap && (
            <div className="lg:hidden h-64 border-b border-border shrink-0">
              <PropertiesMap accommodations={accomData} activeId={hoveredId} focusId={focusedId}
                onMarkerClick={(id) => { setFocusedId(id); setHoveredId(id); }} className="h-full w-full" />
            </div>
          )}

          {/* Listings */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="p-4 sm:p-5 space-y-4">
              {isLoading ? (
                [1, 2, 3, 4].map((i) => <div key={i} className="h-44 bg-muted animate-pulse rounded-2xl" />)
              ) : !filteredData?.length ? (
                <div className="py-20 text-center text-muted-foreground">
                  <p className="text-lg font-semibold mb-2">No stays match your filters</p>
                  <button onClick={clearFilters} className="text-primary text-sm underline">Clear filters</button>
                </div>
              ) : (
                filteredData.map((acc) => (
                  <AccommodationCard key={acc.id} accommodation={acc} layout="horizontal"
                    isActive={hoveredId === acc.id}
                    onMouseEnter={() => setHoveredId(acc.id)}
                    onMouseLeave={() => setHoveredId(null)} />
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Full-screen map overlay */}
      {mapExpanded && (
        <div className="fixed inset-0 z-[9998] flex flex-col bg-background">
          <div className="flex items-center justify-between px-5 py-3 bg-card border-b border-border shrink-0">
            <span className="font-semibold">{accomData.length} properties in Rwanda</span>
            <button onClick={() => setMapExpanded(false)}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
              <X className="w-4 h-4" /> Close map
            </button>
          </div>
          <div className="flex-1">
            <PropertiesMap accommodations={accomData} activeId={hoveredId} focusId={focusedId}
              onMarkerClick={(id) => { setFocusedId(id); setHoveredId(id); }} className="h-full w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
