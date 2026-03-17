import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Search, MapPin, Calendar, Users, Sparkles, X, Plus, Minus, ChevronRight } from "lucide-react";
import { useListAccommodations } from "@workspace/api-client-react";
import { AccommodationCard } from "@/components/accommodations/AccommodationCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

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

  const [activeTab, setActiveTab] = useState<'location' | 'dates' | 'guests' | null>(null);
  
  const [locationQuery, setLocationQuery] = useState("");
  const filteredLocations = RWANDA_LOCATIONS.filter(loc => loc.label.toLowerCase().includes(locationQuery.toLowerCase()));

  const [dateRange, setDateRange] = useState<{from?: Date, to?: Date}>({});

  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });

  const searchBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setActiveTab(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    window.location.href = `/explore?district=${locationQuery ? locationQuery.split(',')[0] : ''}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-32 overflow-visible">
        <div className="absolute inset-0 z-0 opacity-[0.03] mix-blend-multiply pointer-events-none">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-pattern.png`} 
            alt="Pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute right-0 top-0 w-1/3 h-full hidden lg:block opacity-20 mask-image-gradient">
          <img 
            src="https://pixabay.com/get/gcce11e78550dafbb5ea6695a9002d078d38b9195ce501f57ef66c64fb01c348e18c6c8a84f5b822e531d812a1aa1709a68aa71de6899507c63469fd2a0c9818f_1280.jpg" 
            alt="Rwanda scenery" 
            className="w-full h-full object-cover object-left"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-[1.1]">
              Find your perfect stay in <span className="text-primary relative inline-block">
                Rwanda
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Discover curated hotels, cozy guesthouses, and luxury lodges across the land of a thousand hills.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 bg-card rounded-[2rem] shadow-2xl shadow-primary/5 border border-border max-w-4xl relative"
            ref={searchBarRef}
          >
            <div className="flex flex-col md:flex-row p-2 gap-2 relative z-10 bg-card rounded-[2rem]">
              <div 
                className={`flex-1 flex flex-col justify-center rounded-[1.5rem] px-6 py-3 cursor-pointer transition-colors ${activeTab === 'location' ? 'bg-secondary shadow-lg' : 'hover:bg-muted/50'}`}
                onClick={() => setActiveTab('location')}
              >
                <label className="text-xs font-bold text-foreground mb-0.5 cursor-pointer">Where</label>
                <input 
                  type="text" 
                  placeholder="Search destinations" 
                  className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground truncate" 
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </div>
              
              <div className="hidden md:block w-px bg-border my-2"></div>
              
              <div 
                className={`flex-[1.5] flex flex-col justify-center rounded-[1.5rem] px-6 py-3 cursor-pointer transition-colors ${activeTab === 'dates' ? 'bg-secondary shadow-lg' : 'hover:bg-muted/50'}`}
                onClick={() => setActiveTab('dates')}
              >
                <label className="text-xs font-bold text-foreground mb-0.5 cursor-pointer">When</label>
                <div className="text-sm text-foreground truncate">
                  {dateRange.from ? (
                    dateRange.to ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}` : `${format(dateRange.from, 'MMM d')} - Check out`
                  ) : "Add dates"}
                </div>
              </div>

              <div className="hidden md:block w-px bg-border my-2"></div>

              <div 
                className={`flex-1 flex items-center justify-between rounded-[1.5rem] pl-6 pr-2 py-2 cursor-pointer transition-colors ${activeTab === 'guests' ? 'bg-secondary shadow-lg' : 'hover:bg-muted/50'}`}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  setActiveTab('guests');
                }}
              >
                <div className="flex flex-col justify-center flex-1">
                  <label className="text-xs font-bold text-foreground mb-0.5 cursor-pointer">Who</label>
                  <div className="text-sm text-foreground truncate">
                    {guests.adults + guests.children} guests, {guests.rooms} room
                  </div>
                </div>
                
                <Button size="lg" className="w-12 md:w-auto h-12 rounded-full md:px-6 shadow-md ml-2 shrink-0" onClick={(e) => { e.stopPropagation(); handleSearch(); }}>
                  <Search className="w-5 h-5 md:mr-2" />
                  <span className="hidden md:inline font-bold">Search</span>
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {activeTab === 'location' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-4 w-full md:w-96 bg-card rounded-3xl shadow-2xl border border-border p-4 z-50 overflow-hidden"
                >
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">Suggested Destinations</h3>
                  <div className="max-h-80 overflow-y-auto pr-2 no-scrollbar">
                    {filteredLocations.map(loc => (
                      <div 
                        key={loc.label}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => {
                          setLocationQuery(loc.label);
                          setActiveTab('dates');
                        }}
                      >
                        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-foreground" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground text-sm">{loc.label}</div>
                          <div className="text-xs text-muted-foreground">{loc.type}</div>
                        </div>
                      </div>
                    ))}
                    {filteredLocations.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No destinations found.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'dates' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-card rounded-3xl shadow-2xl border border-border p-6 z-50 min-w-max hidden md:block"
                >
                  <div className="flex justify-between items-center mb-6 px-4">
                    <h3 className="text-lg font-bold">Select Dates</h3>
                    <div className="flex items-center gap-4 text-sm bg-muted/50 rounded-full px-4 py-2">
                      <span className={dateRange.from ? "font-bold text-primary" : "text-muted-foreground"}>
                        {dateRange.from ? format(dateRange.from, 'MMM d, yyyy') : "Check-in"}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      <span className={dateRange.to ? "font-bold text-primary" : "text-muted-foreground"}>
                        {dateRange.to ? format(dateRange.to, 'MMM d, yyyy') : "Check-out"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-card">
                    <DayPicker
                      mode="range"
                      selected={dateRange}
                      onSelect={(range: any) => setDateRange(range || {})}
                      numberOfMonths={2}
                      disabled={{ before: new Date() }}
                      className="border-0 !m-0"
                      classNames={{
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-8 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity flex justify-center items-center rounded-md border border-input",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                        day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-secondary rounded-md flex justify-center items-center transition-colors",
                        day_selected: "!bg-primary text-primary-foreground hover:!bg-primary/90 focus:!bg-primary",
                        day_today: "bg-accent/20 text-accent-foreground font-bold",
                        day_outside: "text-muted-foreground opacity-50",
                        day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed hover:bg-transparent",
                        day_range_middle: "aria-selected:!bg-primary/20 aria-selected:!text-foreground !rounded-none",
                        day_hidden: "invisible",
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                    <Button variant="ghost" onClick={() => setDateRange({})}>Clear dates</Button>
                    <Button onClick={() => setActiveTab('guests')}>Next step</Button>
                  </div>
                </motion.div>
              )}
              {activeTab === 'dates' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-4 bg-card rounded-3xl shadow-2xl border border-border p-4 z-50 w-full md:hidden"
                >
                   <div className="bg-card flex justify-center">
                    <DayPicker
                      mode="range"
                      selected={dateRange}
                      onSelect={(range: any) => setDateRange(range || {})}
                      numberOfMonths={1}
                      disabled={{ before: new Date() }}
                      className="border-0 !m-0"
                      classNames={{
                        months: "flex flex-col space-y-4",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity flex justify-center items-center rounded-md border border-input",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                        day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-secondary rounded-md flex justify-center items-center transition-colors",
                        day_selected: "!bg-primary text-primary-foreground hover:!bg-primary/90 focus:!bg-primary",
                        day_today: "bg-accent/20 text-accent-foreground font-bold",
                        day_outside: "text-muted-foreground opacity-50",
                        day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed hover:bg-transparent",
                        day_range_middle: "aria-selected:!bg-primary/20 aria-selected:!text-foreground !rounded-none",
                        day_hidden: "invisible",
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                    <Button variant="ghost" size="sm" onClick={() => setDateRange({})}>Clear</Button>
                    <Button size="sm" onClick={() => setActiveTab('guests')}>Next step</Button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'guests' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-4 w-full md:w-[400px] bg-card rounded-3xl shadow-2xl border border-border p-6 z-50"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-foreground text-sm">Adults</h4>
                        <p className="text-xs text-muted-foreground">Ages 18 or above</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => setGuests(prev => ({...prev, adults: Math.max(1, prev.adults - 1)}))}
                          disabled={guests.adults <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-4 text-center font-medium">{guests.adults}</span>
                        <button 
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                          onClick={() => setGuests(prev => ({...prev, adults: prev.adults + 1}))}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-foreground text-sm">Children</h4>
                        <p className="text-xs text-muted-foreground">Ages 0-17</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => setGuests(prev => ({...prev, children: Math.max(0, prev.children - 1)}))}
                          disabled={guests.children <= 0}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-4 text-center font-medium">{guests.children}</span>
                        <button 
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                          onClick={() => setGuests(prev => ({...prev, children: prev.children + 1}))}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-foreground text-sm">Rooms</h4>
                        <p className="text-xs text-muted-foreground">Private spaces needed</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => setGuests(prev => ({...prev, rooms: Math.max(1, prev.rooms - 1)}))}
                          disabled={guests.rooms <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-4 text-center font-medium">{guests.rooms}</span>
                        <button 
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                          onClick={() => setGuests(prev => ({...prev, rooms: prev.rooms + 1}))}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border text-right">
                    <Button onClick={() => setActiveTab(null)} variant="outline">Done</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">Popular Destinations</h2>
              <p className="text-muted-foreground mt-2">Explore the most visited districts</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {destinations.map((dest, i) => (
              <Link key={dest.name} href={`/explore?district=${dest.name}`}>
                <div className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                  <img src={dest.img} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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

      {/* Featured Accommodations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
                <Sparkles className="text-accent w-6 h-6" />
                Featured Stays
              </h2>
              <p className="text-muted-foreground mt-2">Handpicked accommodations for your next trip</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href='/explore'}>View all</Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.accommodations.map(acc => (
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