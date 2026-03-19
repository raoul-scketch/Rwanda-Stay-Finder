import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { DateRangePicker, type DateRange } from "@/components/ui/DateRangePicker";
import { Search, MapPin, Calendar, Users, Sparkles, Minus, Plus } from "lucide-react";
import { useListAccommodations } from "@workspace/api-client-react";
import { AccommodationCard } from "@/components/accommodations/AccommodationCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
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

export default function Home() {
  const { data, isLoading } = useListAccommodations({ limit: 6, featured: true } as any);

  const destinations = [
    { name: "Kigali", count: 124, img: "https://images.unsplash.com/photo-1547471080-7fc2caa6f17f?w=600&q=80" },
    { name: "Musanze", count: 45, img: "https://images.unsplash.com/photo-1518182170546-076616fdfaaf?w=600&q=80" },
    { name: "Rubavu", count: 82, img: "https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=600&q=80" },
    { name: "Akagera", count: 28, img: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600&q=80" },
  ];

  type ActiveTab = "location" | "dates" | "guests" | null;
  const [activeTab, setActiveTab] = useState<ActiveTab>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });

  const searchBarRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        setActiveTab(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeTab === "location") {
      setTimeout(() => locationInputRef.current?.focus(), 50);
    }
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
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d")}`;
    }
    if (dateRange.from) return `${format(dateRange.from, "MMM d")} – Check-out`;
    return "Add dates";
  };

  const handleSearch = () => {
    const q = locationQuery ? encodeURIComponent(locationQuery.split(",")[0].trim()) : "";
    window.location.href = `/explore${q ? `?district=${q}` : ""}`;
  };

  const Counter = ({
    label,
    sub,
    value,
    min = 0,
    onChange,
  }: {
    label: string;
    sub: string;
    value: number;
    min?: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div>
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="w-8 h-8 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-semibold text-foreground">{value}</span>
        <button
          className="w-8 h-8 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
          onClick={() => onChange(value + 1)}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20">
        <div className="absolute right-0 top-0 w-1/3 h-full hidden lg:block opacity-20 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1547471080-7fc2caa6f17f?w=800&q=80"
            alt="Rwanda scenery"
            className="w-full h-full object-cover object-left"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
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

          {/* Search Widget */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 relative max-w-4xl"
            ref={searchBarRef}
          >
            {/* Search Bar Row */}
            <div className="bg-card border border-border rounded-2xl shadow-xl flex flex-col md:flex-row overflow-visible">
              {/* Where */}
              <div
                className={`flex-1 flex items-center gap-3 px-5 py-4 cursor-pointer rounded-tl-2xl rounded-bl-2xl md:rounded-tr-none md:rounded-br-none border-b md:border-b-0 md:border-r border-border transition-colors ${activeTab === "location" ? "bg-secondary/60" : "hover:bg-muted/40"}`}
                onClick={() => setActiveTab(activeTab === "location" ? null : "location")}
              >
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Where</div>
                  <input
                    ref={locationInputRef}
                    type="text"
                    placeholder="Search destinations"
                    className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground mt-0.5 truncate"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onClick={(e) => { e.stopPropagation(); setActiveTab("location"); }}
                  />
                </div>
              </div>

              {/* When */}
              <div
                className={`flex-[1.4] flex items-center gap-3 px-5 py-4 cursor-pointer border-b md:border-b-0 md:border-r border-border transition-colors ${activeTab === "dates" ? "bg-secondary/60" : "hover:bg-muted/40"}`}
                onClick={() => setActiveTab(activeTab === "dates" ? null : "dates")}
              >
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">When</div>
                  <div className={`text-sm mt-0.5 truncate ${dateRange.from ? "text-foreground" : "text-muted-foreground"}`}>
                    {dateSummary()}
                  </div>
                </div>
              </div>

              {/* Who + Search */}
              <div
                className={`flex-1 flex items-center gap-3 px-5 py-4 cursor-pointer rounded-tr-2xl rounded-br-2xl transition-colors ${activeTab === "guests" ? "bg-secondary/60" : "hover:bg-muted/40"}`}
                onClick={() => setActiveTab(activeTab === "guests" ? null : "guests")}
              >
                <Users className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Who</div>
                  <div className="text-sm text-foreground mt-0.5 truncate">{guestSummary()}</div>
                </div>
                <Button
                  size="sm"
                  className="rounded-xl px-4 h-10 shrink-0 shadow-md"
                  onClick={(e) => { e.stopPropagation(); handleSearch(); }}
                >
                  <Search className="w-4 h-4 mr-1.5" />
                  <span className="font-bold text-sm">Search</span>
                </Button>
              </div>
            </div>

            {/* Dropdowns */}
            <AnimatePresence>
              {/* Location Dropdown */}
              {activeTab === "location" && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="px-4 pt-4 pb-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      {locationQuery ? "Matching destinations" : "Popular destinations"}
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredLocations.slice(0, 8).map((loc) => (
                      <div
                        key={loc.label}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/60 cursor-pointer transition-colors"
                        onClick={() => {
                          setLocationQuery(loc.label);
                          setActiveTab("dates");
                        }}
                      >
                        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground leading-tight">{loc.label}</div>
                          <div className="text-xs text-muted-foreground">{loc.type}</div>
                        </div>
                      </div>
                    ))}
                    {filteredLocations.length === 0 && (
                      <div className="px-4 py-8 text-center text-sm text-muted-foreground">No destinations found</div>
                    )}
                  </div>
                  <div className="h-3" />
                </motion.div>
              )}

              {/* Date Picker */}
              {activeTab === "dates" && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-card border border-border rounded-2xl shadow-2xl z-50 p-6"
                  style={{ width: "580px", maxWidth: "calc(100vw - 2rem)" }}
                >
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    onDone={() => setActiveTab("guests")}
                  />
                </motion.div>
              )}

              {/* Guests Dropdown */}
              {activeTab === "guests" && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 p-5"
                >
                  <Counter
                    label="Adults"
                    sub="Age 18 or above"
                    value={guests.adults}
                    min={1}
                    onChange={(v) => setGuests((g) => ({ ...g, adults: v }))}
                  />
                  <Counter
                    label="Children"
                    sub="Age 0–17"
                    value={guests.children}
                    min={0}
                    onChange={(v) => setGuests((g) => ({ ...g, children: v }))}
                  />
                  <Counter
                    label="Rooms"
                    sub="Private spaces needed"
                    value={guests.rooms}
                    min={1}
                    onChange={(v) => setGuests((g) => ({ ...g, rooms: v }))}
                  />
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" onClick={() => setActiveTab(null)}>Done</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

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
                  <img
                    src={dest.img}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
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
            <Button variant="outline" onClick={() => (window.location.href = "/explore")}>
              View all
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl" />
              ))}
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
