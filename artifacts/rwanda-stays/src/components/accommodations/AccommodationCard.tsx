import { Link } from "wouter";
import { Star, MapPin, Users, Bed, Bath } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatRWF } from "@/lib/utils";
import type { Accommodation } from "@workspace/api-client-react";

interface Props {
  accommodation: Accommodation;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isActive?: boolean;
  layout?: 'vertical' | 'horizontal';
}

export function AccommodationCard({ accommodation, onMouseEnter, onMouseLeave, isActive, layout = 'vertical' }: Props) {
  const isHorizontal = layout === 'horizontal';

  // Mock amenities for display
  const amenities = ["Free WiFi", "Pool", "Breakfast"];

  return (
    <Link href={`/accommodation/${accommodation.id}`}>
      <div 
        className={`group flex bg-card rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer h-full
          ${isHorizontal ? 'flex-col sm:flex-row' : 'flex-col'}
          ${isActive ? 'border-primary ring-4 ring-primary/10 shadow-lg' : 'border-border hover:border-primary/50 hover:shadow-xl hover:-translate-y-1'}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className={`relative overflow-hidden bg-muted ${isHorizontal ? 'w-full sm:w-[35%] aspect-[4/3] sm:aspect-auto sm:h-full shrink-0' : 'aspect-[4/3] w-full h-[55%]'}`}>
          <img 
            src={accommodation.mainImage} 
            alt={accommodation.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-background/90 text-foreground backdrop-blur-md hover:bg-background">
              {accommodation.type.charAt(0).toUpperCase() + accommodation.type.slice(1)}
            </Badge>
            {accommodation.featured && (
              <Badge className="bg-accent text-accent-foreground border-none">
                Featured
              </Badge>
            )}
          </div>
          <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center hover:bg-background transition-colors text-white/90 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        </div>
        
        <div className={`p-5 flex flex-col flex-grow ${isHorizontal ? 'justify-center' : ''}`}>
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center text-muted-foreground text-sm mb-1.5">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span className="line-clamp-1">{accommodation.district}, {accommodation.province}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm font-bold text-foreground">{accommodation.averageRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground ml-1">(312)</span>
            </div>
          </div>

          <h3 className="font-display font-bold text-xl text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight mb-3">
            {accommodation.name}
          </h3>
          
          <div className="flex flex-wrap gap-1.5 mb-4">
            {amenities.map(amenity => (
              <span key={amenity} className="px-2 py-0.5 rounded-full bg-secondary text-xs text-secondary-foreground font-medium border border-border">
                {amenity}
              </span>
            ))}
            <span className="px-2 py-0.5 rounded-full bg-secondary text-xs text-secondary-foreground font-medium border border-border">
              +2 more
            </span>
          </div>
          
          <div className="mt-auto pt-4 border-t border-border flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <div className="flex items-center gap-1.5" title="Max Guests">
                <Users className="w-4 h-4" /> {accommodation.maxGuests}
              </div>
              <div className="flex items-center gap-1.5" title="Bedrooms">
                <Bed className="w-4 h-4" /> {accommodation.bedrooms}
              </div>
              <div className="flex items-center gap-1.5" title="Bathrooms">
                <Bath className="w-4 h-4" /> {accommodation.bathrooms}
              </div>
            </div>
            <div className="text-left sm:text-right flex flex-col sm:items-end">
              <span className="text-muted-foreground text-xs mb-0.5 hidden sm:block">from</span>
              <div>
                <span className="font-bold text-xl text-foreground">{formatRWF(accommodation.pricePerNight)}</span>
                <span className="text-muted-foreground text-sm"> /night</span>
              </div>
              
              <div className="mt-2 w-full sm:w-auto overflow-hidden h-0 sm:h-auto opacity-0 sm:opacity-100 max-h-0 sm:max-h-[40px] transition-all group-hover:opacity-100 group-hover:h-auto group-hover:max-h-[40px]">
                <span className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold w-full text-center hover:bg-primary/90 transition-colors">
                  View Details
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}