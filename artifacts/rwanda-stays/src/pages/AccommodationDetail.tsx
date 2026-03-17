import { useParams, Link } from "wouter";
import { useGetAccommodation } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Star, MapPin, Check, Wifi, Coffee, Car, Shield, Bed, Bath, Users } from "lucide-react";
import { formatRWF } from "@/lib/utils";

export default function AccommodationDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  
  const { data: acc, isLoading, error } = useGetAccommodation(id, { query: { enabled: !!id } });

  if (isLoading) return (
    <div className="min-h-screen bg-background"><Navbar /><div className="p-8 text-center">Loading...</div></div>
  );
  
  if (error || !acc) return (
    <div className="min-h-screen bg-background"><Navbar /><div className="p-8 text-center text-destructive">Accommodation not found.</div></div>
  );

  // Fallback for demo images if missing
  const images = acc.images?.length > 0 ? acc.images : [
    acc.mainImage,
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground">{acc.name}</h1>
          <div className="flex items-center gap-4 mt-4 text-sm font-medium">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span>{acc.averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground underline cursor-pointer">({acc.reviewCount} reviews)</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{acc.address}, {acc.district}, {acc.province}</span>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12">
          <div className="md:col-span-2 lg:col-span-2 row-span-2 relative group">
            <img src={images[0]} alt="Main" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="hidden md:block relative group">
            <img src={images[1]} alt="Side 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="hidden lg:block relative group">
            <img src={images[2] || images[0]} alt="Side 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="hidden md:block lg:col-span-2 relative group">
             <img src={images[0]} alt="Side 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
             <Button variant="secondary" className="absolute bottom-4 right-4 bg-background/90 backdrop-blur">
               Show all photos
             </Button>
          </div>
        </div>

        {/* Content Split */}
        <div className="flex flex-col lg:flex-row gap-12 relative">
          <div className="flex-1">
            <div className="flex justify-between items-start pb-8 border-b border-border">
              <div>
                <h2 className="text-2xl font-display font-bold">Entire {acc.type} hosted by RwandaStays</h2>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="w-4 h-4"/> {acc.maxGuests} guests</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Bed className="w-4 h-4"/> {acc.bedrooms} bedrooms</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Bath className="w-4 h-4"/> {acc.bathrooms} baths</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-xl">RS</span>
              </div>
            </div>

            <div className="py-8 border-b border-border">
              <h3 className="text-xl font-display font-bold mb-4">About this space</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {acc.description}
              </p>
            </div>

            <div className="py-8 border-b border-border">
              <h3 className="text-xl font-display font-bold mb-6">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {acc.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-3 text-foreground">
                    <Check className="w-5 h-5 text-primary" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Reviews Section Placeholder */}
            <div className="py-8">
               <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                 <Star className="w-5 h-5 fill-primary text-primary" />
                 {acc.averageRating.toFixed(1)} · {acc.reviewCount} reviews
               </h3>
               {acc.recentReviews && acc.recentReviews.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {acc.recentReviews.map(review => (
                     <div key={review.id} className="p-6 rounded-2xl bg-secondary/30">
                       <div className="flex items-center gap-3 mb-3">
                         <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                           {review.guestName.charAt(0)}
                         </div>
                         <div>
                           <div className="font-bold">{review.guestName}</div>
                           <div className="text-xs text-muted-foreground">{new Date(review.stayDate).toLocaleDateString()}</div>
                         </div>
                       </div>
                       <p className="text-sm text-foreground/80">{review.comment}</p>
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="text-muted-foreground">No reviews yet.</p>
               )}
            </div>
          </div>

          {/* Booking Widget */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-28 bg-card border border-border rounded-3xl p-6 shadow-xl shadow-black/5">
              <div className="mb-6 flex items-end gap-1">
                <span className="text-3xl font-display font-bold">{formatRWF(acc.pricePerNight)}</span>
                <span className="text-muted-foreground pb-1">/ night</span>
              </div>

              <div className="border border-border rounded-2xl overflow-hidden mb-6">
                <div className="flex border-b border-border">
                  <div className="p-3 border-r border-border flex-1">
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground">Check-in</label>
                    <input type="date" className="w-full bg-transparent outline-none mt-1 text-sm font-medium" />
                  </div>
                  <div className="p-3 flex-1">
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground">Check-out</label>
                    <input type="date" className="w-full bg-transparent outline-none mt-1 text-sm font-medium" />
                  </div>
                </div>
                <div className="p-3">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">Guests</label>
                  <select className="w-full bg-transparent outline-none mt-1 text-sm font-medium cursor-pointer">
                    <option>1 guest</option>
                    <option>2 guests</option>
                    <option>3 guests</option>
                  </select>
                </div>
              </div>

              <Link href={`/book/${acc.id}`}>
                <Button className="w-full text-lg h-14 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-lg shadow-primary/25">
                  Reserve
                </Button>
              </Link>
              
              <p className="text-center text-xs text-muted-foreground mt-4">You won't be charged yet</p>

              <div className="mt-6 pt-6 border-t border-border space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span className="underline">RWF {formatRWF(acc.pricePerNight).replace('RWF','')} x 5 nights</span>
                  <span>{formatRWF(acc.pricePerNight * 5)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span className="underline">Service fee</span>
                  <span>RWF 15,000</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-4 border-t border-border">
                  <span>Total</span>
                  <span>{formatRWF((acc.pricePerNight * 5) + 15000)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
