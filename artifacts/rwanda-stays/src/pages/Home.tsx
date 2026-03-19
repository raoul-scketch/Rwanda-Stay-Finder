import { createPortal } from "react-dom";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { DateRangePicker, type DateRange } from "@/components/ui/DateRangePicker";
import { Search, MapPin, Calendar, Users, Sparkles, Minus, Plus } from "lucide-react";
import { useListAccommodations } from "@workspace/api-client-react";
import { AccommodationCard } from "@/components/accommodations/AccommodationCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { format } from "date-fns";

const RWANDA_LOCATIONS = [
  { label: "Kigali City", type: "Province" },
  { label: "Gasabo, Kigali", type: "District" },
  { label: "Kicukiro, Kigali", type: "District" },
  { label: "Nyarugenge, Kigali", type: "District" },
  { label: "Musanze, Northern Province", type: "City" },
  { label: "Rubavu, Western Province", type: "City" },
  { label: "Huye, Southern Province", type: "City" },
  { label: "Nyamagabe, Southern Province", type: "District" },
  { label: "Nyamasheke, Western Province", type: "District" },
  { label: "Rusizi, Western Province", type: "District" },
  { label: "Karongi, Western Province", type: "District" },
  { label: "Kayonza, Eastern Province", type: "District" },
  { label: "Rwamagana, Eastern Province", type: "District" },
  { label: "Akagera National Park", type: "Attraction" },
  { label: "Volcanoes National Park", type: "Attraction" },
  { label: "Nyungwe Forest", type: "Attraction" },
  { label: "Lake Kivu", type: "Attraction" },
  { label: "Gisenyi Beach", type: "Attraction" },
];

type ActiveTab = "location" | "dates" | "guests" | null;

function useDropdownPos(ref: React.RefObject<HTMLElement | null>, active: boolean) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  useEffect(() => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ top: r.bottom + 8, left: r.left, width: r.width });
  }, [active, ref]);
  return pos;
}

export default function Home() {
  const { data, isLoading } = useListAccommodations({ limit: 6, featured: true } as any);

  const destinations = [
    { name: "Kigali", count: 124, img: "https://images.unsplash.com/photo-1547471080-7fc2caa6f17f?w=600&q=80" },
    { name: "Musanze", count: 45, img: "https://images.unsplash.com/photo-1518182170546-076616fdfaaf?w=600&q=80" },
    { name: "Rubavu", count: 82, img: "https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=600&q=80" },
    { name: "Akagera", count: 28, img: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600&q=80" },
  ];

  const [activeTab, setActiveTab] = useState<ActiveTab>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });

  const searchBarRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const locPos = useDropdownPos(locationRef, activeTab === "location");
  const datePos = useDropdownPos(datesRef, activeTab === "dates");
  const guestPos = useDropdownPos(guestsRef, activeTab === "guests");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inBar = searchBarRef.current?.contains(target);
      const inPortal = (document.getElementById("search-portal") as HTMLElement | null)?.contains(target);
      if (!inBar && !inPortal) setActiveTab(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeTab === "location") setTimeout(() => locationInputRef.current?.focus(), 60);
  }, [activeTab]);

  const filteredLocations = RWANDA_LOCATIONS.filter((l) =>
    l.label.toLowerCase().includes(locationQuery.toLowerCase())
  );

  const guestSummary = () => {
    const parts: string[] = [];
    parts.push(`${guests.adults} adult${guests.adults !== 1 ? "s" : ""}`);
    if (guests.children > 0) parts.push(`${guests.children} child${guests.children !== 1 ? "ren" : ""}`);
    parts.push(`${guests.rooms} room${guests.rooms !== 1 ? "s" : ""}`);
    return parts.join(" · ");
  };

  const dateSummary = () => {
    if (dateRange.from && dateRange.to)
      return `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d")}`;
    if (dateRange.from) return `${format(dateRange.from, "MMM d")} – Check-out`;
    return "Add dates";
  };

  const handleSearch = useCallback(() => {
    const q = locationQuery ? encodeURIComponent(locationQuery.split(",")[0].trim()) : "";
    window.location.href = `/explore${q ? `?district=${q}` : ""}`;
  }, [locationQuery]);

  const Counter = ({
    label, sub, value, min = 0, onChange,
  }: { label: string; sub: string; value: number; min?: number; onChange: (v: number) => void }) => (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div>
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-bold text-foreground">{value}</span>
        <button
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          onClick={() => onChange(value + 1)}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  const portalContent = (
    <div id="search-portal">
      <AnimatePresence>
        {/* Location dropdown */}
        {activeTab === "location" && (
          <motion.div
            key="location-dd"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.14 }}
            style={{ position: "fixed", top: locPos.top, left: locPos.left, zIndex: 9999, width: 320 }}
            className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-4 pt-4 pb-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {locationQuery ? "Matching destinations" : "Popular destinations"}
              </p>
            </div>
            <div className="max-h-60 overflow-y-auto no-scrollbar">
              {filteredLocations.slice(0, 9).map((loc) => (
                <div
                  key={loc.label}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/60 cursor-pointer transition-colors"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setLocationQuery(loc.label); setActiveTab("dates"); }}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground leading-tight">{loc.label}</div>
                    <div className="text-xs text-muted-foreground">{loc.type}</div>
                  </div>
                </div>
              ))}
              {filteredLocations.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">No destinations found</div>
              )}
            </div>
            <div className="h-2" />
          </motion.div>
        )}

        {/* Date picker dropdown — centred below the dates field */}
        {activeTab === "dates" && (
          <motion.div
            key="dates-dd"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.14 }}
            style={{
              position: "fixed",
              top: datePos.top,
              left: Math.max(16, datePos.left - 140),
              zIndex: 9999,
              width: Math.min(600, window.innerWidth - 32),
            }}
            className="bg-card border border-border rounded-2xl shadow-2xl p-6"
          >
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              onDone={() => setActiveTab("guests")}
            />
          </motion.div>
        )}

        {/* Guests dropdown — right-aligned */}
        {activeTab === "guests" && (
          <motion.div
            key="guests-dd"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.14 }}
            style={{
              position: "fixed",
              top: guestPos.top,
              left: guestPos.left,
              zIndex: 9999,
              width: 300,
            }}
            className="bg-card border border-border rounded-2xl shadow-2xl p-5"
          >
            <Counter label="Adults" sub="Age 18 or above" value={guests.adults} min={1}
              onChange={(v) => setGuests((g) => ({ ...g, adults: v }))} />
            <Counter label="Children" sub="Age 0–17" value={guests.children} min={0}
              onChange={(v) => setGuests((g) => ({ ...g, children: v }))} />
            <Counter label="Rooms" sub="Private spaces needed" value={guests.rooms} min={1}
              onChange={(v) => setGuests((g) => ({ ...g, rooms: v }))} />
            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={() => setActiveTab(null)}>Done</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-14 pb-28">
        <div className="absolute right-0 top-0 w-1/3 h-full hidden lg:block opacity-15 pointer-events-none select-none">
          <img src="https://images.unsplash.com/photo-1547471080-7fc2caa6f17f?w=900&q=80"
            alt="" className="w-full h-full object-cover object-left" />
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
            className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-[1.1]">
              Find your perfect stay in{" "}
              <span className="text-primary relative inline-block">
                Rwanda
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Discover curated hotels, cozy guesthouses, and luxury lodges across the land of a thousand hills.
            </p>
          </motion.div>

          {/* ── Search bar matching reference image 2 ── */}
          <motion.div
            ref={searchBarRef}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-12 max-w-4xl"
          >
            <div className="flex items-center gap-2 bg-secondary/50 rounded-full p-2 shadow-2xl shadow-black/30">
              {/* Location pill */}
              <div
                ref={locationRef}
                onClick={() => setActiveTab(activeTab === "location" ? null : "location")}
                className={`flex-1 flex items-center gap-3 bg-card rounded-full px-5 py-3.5 cursor-pointer transition-all
                  ${activeTab === "location" ? "ring-2 ring-primary shadow-md" : "hover:bg-muted/60"}`}
              >
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-foreground">Location</div>
                  <input
                    ref={locationInputRef}
                    type="text"
                    placeholder="Where to?"
                    className="w-full bg-transparent outline-none text-sm text-muted-foreground placeholder:text-muted-foreground/70 mt-0.5 truncate"
                    value={locationQuery}
                    onChange={(e) => { setLocationQuery(e.target.value); setActiveTab("location"); }}
                    onClick={(e) => { e.stopPropagation(); setActiveTab("location"); }}
                  />
                </div>
              </div>

              {/* Dates pill */}
              <div
                ref={datesRef}
                onClick={() => setActiveTab(activeTab === "dates" ? null : "dates")}
                className={`flex-[1.3] flex items-center gap-3 bg-card rounded-full px-5 py-3.5 cursor-pointer transition-all
                  ${activeTab === "dates" ? "ring-2 ring-primary shadow-md" : "hover:bg-muted/60"}`}
              >
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-foreground">Dates</div>
                  <div className={`text-sm mt-0.5 truncate ${dateRange.from ? "text-foreground" : "text-muted-foreground/70"}`}>
                    {dateSummary()}
                  </div>
                </div>
              </div>

              {/* Guests pill */}
              <div
                ref={guestsRef}
                onClick={() => setActiveTab(activeTab === "guests" ? null : "guests")}
                className={`flex-1 flex items-center gap-3 bg-card rounded-full px-5 py-3.5 cursor-pointer transition-all
                  ${activeTab === "guests" ? "ring-2 ring-primary shadow-md" : "hover:bg-muted/60"}`}
              >
                <Users className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-foreground">Guests</div>
                  <div className="text-sm text-muted-foreground/70 mt-0.5 truncate">{guestSummary()}</div>
                </div>
              </div>

              {/* Search button — fully separate orange pill */}
              <button
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 rounded-full w-14 h-14 flex items-center justify-center shrink-0 shadow-lg transition-colors"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portaled dropdowns — render at body level, can't be clipped */}
      {createPortal(portalContent, document.body)}

      {/* Popular Destinations */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-display font-bold text-foreground">Popular Destinations</h2>
            <p className="text-muted-foreground mt-2">Explore the most visited districts</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {destinations.map((dest) => (
              <Link key={dest.name} href={`/explore?district=${dest.name}`}>
                <div className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors z-10" />
                  <img src={dest.img} alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute bottom-0 left-0 p-5 z-20">
                    <h3 className="text-white font-display font-bold text-xl">{dest.name}</h3>
                    <p className="text-white/80 text-sm">{dest.count} properties</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stays */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
                <Sparkles className="text-primary w-6 h-6" />
                Featured Stays
              </h2>
              <p className="text-muted-foreground mt-2">Handpicked accommodations for your next trip</p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = "/explore")}>View all</Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.accommodations.map((acc) => (
                <AccommodationCard key={acc.id} accommodation={acc} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
