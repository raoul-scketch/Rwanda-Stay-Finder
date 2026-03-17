import { useState } from "react";
import { useListBookings, useUpdateBooking, BookingStatus } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Search, CalendarX2 } from "lucide-react";
import { formatRWF } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function MyBookings() {
  const [email, setEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useListBookings({ guestEmail: searchEmail }, { 
    query: { enabled: !!searchEmail } 
  });

  const { mutate: updateBooking, isPending: isUpdating } = useUpdateBooking({
    mutation: {
      onSuccess: () => {
        toast({ title: "Booking cancelled successfully" });
        queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      }
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSearchEmail(email);
  };

  const handleCancel = (id: number) => {
    if(confirm("Are you sure you want to cancel this booking?")) {
      updateBooking({ id, data: { status: BookingStatus.cancelled } });
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch(status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'destructive';
      case 'completed': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-display font-bold mb-8">My Bookings</h1>

        <form onSubmit={handleSearch} className="flex gap-4 mb-12 bg-card p-4 rounded-2xl shadow-sm border border-border">
          <Input 
            type="email" 
            placeholder="Enter the email you used to book..." 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 border-none shadow-none focus-visible:ring-0 text-lg"
          />
          <Button type="submit" size="lg" className="rounded-xl">
            <Search className="w-5 h-5 mr-2" /> Find Bookings
          </Button>
        </form>

        {isLoading && <div className="text-center py-10">Searching records...</div>}

        {data?.bookings && data.bookings.length > 0 ? (
          <div className="space-y-6">
            {data.bookings.map((booking) => (
              <div key={booking.id} className="bg-card border border-border rounded-3xl p-6 flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-shadow">
                <img src={booking.accommodationImage} alt="" className="w-full sm:w-48 h-32 rounded-2xl object-cover" />
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display font-bold text-xl">{booking.accommodationName}</h3>
                    <Badge variant={getStatusColor(booking.status) as any}>
                      {booking.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="text-muted-foreground text-sm space-y-1 mb-4">
                    <p>{booking.checkIn} — {booking.checkOut}</p>
                    <p>{booking.guests} guests • {booking.nights} nights</p>
                    <p className="font-mono text-xs mt-2">Code: {booking.confirmationCode}</p>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-end border-t border-border pt-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Total paid</div>
                      <div className="font-bold">{formatRWF(booking.totalPrice)}</div>
                    </div>
                    
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleCancel(booking.id)}
                        disabled={isUpdating}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchEmail && !isLoading ? (
          <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-border">
            <CalendarX2 className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h3 className="font-display font-bold text-xl mb-2">No bookings found</h3>
            <p className="text-muted-foreground">We couldn't find any reservations for "{searchEmail}".</p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
