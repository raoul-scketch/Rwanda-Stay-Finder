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
}

export function AccommodationCard({ accommodation, onMouseEnter, onMouseLeave, isActive }: Props) {
  return (
    <Link href={`/accommodation/${accommodation.id}`}>
      <div 
        className={`group flex flex-col bg-card rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer h-full
          ${isActive ? 'border-primary ring-4 ring-primary/10 shadow-lg' : 'border-border hover:border-primary/50 hover:shadow-xl hover:-translate-y-1'}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img 
            src={accommodation.mainImage} 
            alt={accommodation.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
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
          <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center hover:bg-background transition-colors text-muted-foreground hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {accommodation.name}
            </h3>
            <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span className="text-xs font-bold text-foreground">{accommodation.averageRating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm mb-4">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            <span className="line-clamp-1">{accommodation.district}, {accommodation.province}</span>
          </div>
          
          <div className="mt-auto pt-4 border-t border-border flex items-end justify-between">
            <div className="flex items-center gap-3 text-muted-foreground text-xs">
              <div className="flex items-center gap-1" title="Max Guests">
                <Users className="w-4 h-4" /> {accommodation.maxGuests}
              </div>
              <div className="flex items-center gap-1" title="Bedrooms">
                <Bed className="w-4 h-4" /> {accommodation.bedrooms}
              </div>
              <div className="flex items-center gap-1" title="Bathrooms">
                <Bath className="w-4 h-4" /> {accommodation.bathrooms}
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-lg text-foreground">{formatRWF(accommodation.pricePerNight)}</span>
              <span className="text-muted-foreground text-xs block">/ night</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
