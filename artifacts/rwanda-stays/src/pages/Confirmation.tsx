import { useParams, Link } from "wouter";
import { useGetBooking } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Calendar, MapPin, Receipt } from "lucide-react";
import { formatRWF } from "@/lib/utils";

export default function Confirmation() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  
  const { data: booking, isLoading } = useGetBooking(id, { query: { enabled: !!id } });

  if (isLoading) return <div className="min-h-screen bg-background"><Navbar /><div className="p-10 text-center">Loading...</div></div>;
  if (!booking) return <div className="min-h-screen bg-background"><Navbar /><div className="p-10 text-center">Booking not found.</div></div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 mt-12">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Booking Confirmed!</h1>
          <p className="text-muted-foreground text-lg">
            Pack your bags, {booking.guestName.split(' ')[0]}. You're going to Rwanda!
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg shadow-black/5">
          <div className="p-8 border-b border-border bg-secondary/30 flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Confirmation Code</div>
              <div className="text-2xl font-mono font-bold tracking-widest">{booking.confirmationCode}</div>
            </div>
            <Receipt className="w-8 h-8 text-primary opacity-50" />
          </div>

          <div className="p-8">
            <div className="flex gap-6 mb-8 pb-8 border-b border-border">
              <img src={booking.accommodationImage} alt={booking.accommodationName} className="w-32 h-32 rounded-2xl object-cover shadow-md" />
              <div>
                <h2 className="text-xl font-display font-bold">{booking.accommodationName}</h2>
                <div className="flex items-center text-muted-foreground mt-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Rwanda</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Check-in</div>
                <div className="font-bold text-lg">{booking.checkIn}</div>
                <div className="text-sm text-muted-foreground mt-1">14:00 onwards</div>
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Check-out</div>
                <div className="font-bold text-lg">{booking.checkOut}</div>
                <div className="text-sm text-muted-foreground mt-1">Before 11:00</div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-2xl p-6 flex justify-between items-center">
              <div>
                <div className="font-bold">Total Paid</div>
                <div className="text-sm text-muted-foreground">{booking.paymentMethod.replace('_', ' ')}</div>
              </div>
              <div className="text-2xl font-bold">{formatRWF(booking.totalPrice)}</div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/explore">
            <Button variant="outline" size="lg">Explore more</Button>
          </Link>
          <Link href="/my-bookings">
            <Button size="lg">View my bookings</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
