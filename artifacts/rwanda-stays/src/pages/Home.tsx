import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, MapPin, Calendar, Users, TrendingUp, Sparkles } from "lucide-react";
import { useListAccommodations } from "@workspace/api-client-react";
import { AccommodationCard } from "@/components/accommodations/AccommodationCard";
import { motion } from "framer-motion";

export default function Home() {
  const { data, isLoading } = useListAccommodations({ limit: 6, featured: true } as any); // using any for featured as it might not be in typed params yet but good for backend query

  const destinations = [
    { name: "Kigali", count: 124, img: "https://images.unsplash.com/photo-1547471080-7fc2caa6f17f?w=600&q=80" },
    { name: "Musanze", count: 45, img: "https://images.unsplash.com/photo-1518182170546-076616fdfaaf?w=600&q=80" },
    { name: "Rubavu", count: 82, img: "https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=600&q=80" },
    { name: "Akagera", count: 28, img: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600&q=80" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-32 overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] mix-blend-multiply pointer-events-none">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-pattern.png`} 
            alt="Pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* landing page hero scenic rwanda hills */}
        <div className="absolute right-0 top-0 w-1/3 h-full hidden lg:block opacity-20 mask-image-gradient">
          <img 
            src="https://pixabay.com/get/gcce11e78550dafbb5ea6695a9002d078d38b9195ce501f57ef66c64fb01c348e18c6c8a84f5b822e531d812a1aa1709a68aa71de6899507c63469fd2a0c9818f_1280.jpg" 
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

          {/* Search Bar Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 bg-card p-4 rounded-3xl shadow-xl shadow-primary/5 border border-border/50 max-w-4xl flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 flex items-center gap-3 bg-muted/50 rounded-2xl px-4 py-3 border border-transparent focus-within:border-primary/30 transition-colors">
              <MapPin className="text-primary w-5 h-5" />
              <div className="flex-1">
                <label className="text-xs font-bold text-foreground block">Location</label>
                <input type="text" placeholder="Where to?" className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex-1 flex items-center gap-3 bg-muted/50 rounded-2xl px-4 py-3 border border-transparent focus-within:border-primary/30 transition-colors">
              <Calendar className="text-primary w-5 h-5" />
              <div className="flex-1">
                <label className="text-xs font-bold text-foreground block">Dates</label>
                <input type="text" placeholder="Add dates" className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground" />
              </div>
            </div>

            <div className="flex-1 flex items-center gap-3 bg-muted/50 rounded-2xl px-4 py-3 border border-transparent focus-within:border-primary/30 transition-colors">
              <Users className="text-primary w-5 h-5" />
              <div className="flex-1">
                <label className="text-xs font-bold text-foreground block">Guests</label>
                <input type="text" placeholder="Add guests" className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground" />
              </div>
            </div>

            <Button size="lg" className="md:w-32 rounded-2xl" onClick={() => window.location.href='/explore'}>
              <Search className="w-5 h-5" />
            </Button>
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
    </div>
  );
}
