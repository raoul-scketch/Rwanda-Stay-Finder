import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useGetAccommodation, useCreateBooking, useProcessPayment, PaymentMethod } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatRWF } from "@/lib/utils";
import { ChevronLeft, CreditCard, Smartphone, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BookingFlow() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const id = parseInt(params.id || "0");
  
  const { data: acc } = useGetAccommodation(id, { query: { enabled: !!id } });
  const { mutateAsync: createBooking, isPending: isCreating } = useCreateBooking();
  const { mutateAsync: processPayment, isPending: isPaying } = useProcessPayment();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    checkIn: "2025-06-01", // Hardcoded for demo
    checkOut: "2025-06-06",
    guests: 2,
    paymentMethod: "credit_card" as PaymentMethod,
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    mobileMoneyPhone: "",
    mobileNetwork: "mtn" as "mtn" | "airtel"
  });

  const [bookingId, setBookingId] = useState<number | null>(null);

  if (!acc) return null;

  const handleCreateBooking = async () => {
    try {
      const res = await createBooking({
        data: {
          accommodationId: acc.id,
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhone: formData.guestPhone,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: formData.guests,
          paymentMethod: formData.paymentMethod,
        }
      });
      setBookingId(res.id);
      setStep(3);
    } catch (e: any) {
      toast({ title: "Booking failed", description: e.message, variant: "destructive" });
    }
  };

  const handlePayment = async () => {
    if (!bookingId) return;
    try {
      await processPayment({
        id: bookingId,
        data: {
          paymentMethod: formData.paymentMethod,
          cardNumber: formData.cardNumber,
          cardExpiry: formData.cardExpiry,
          cardCvv: formData.cardCvv,
          mobileMoneyPhone: formData.mobileMoneyPhone,
          mobileMoneyNetwork: formData.mobileNetwork,
        }
      });
      setLocation(`/confirmation/${bookingId}`);
    } catch (e: any) {
      toast({ title: "Payment failed", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => step > 1 ? setStep(step - 1) : history.back()} className="flex items-center text-sm font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Main Form Area */}
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold mb-8">
              {step === 1 ? "Review your trip" : step === 2 ? "Who's coming?" : "How would you like to pay?"}
            </h1>

            {step === 1 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-border">
                  <div>
                    <h3 className="font-bold">Dates</h3>
                    <p className="text-muted-foreground">{formData.checkIn} to {formData.checkOut}</p>
                  </div>
                  <Button variant="ghost">Edit</Button>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-border">
                  <div>
                    <h3 className="font-bold">Guests</h3>
                    <p className="text-muted-foreground">{formData.guests} guests</p>
                  </div>
                  <Button variant="ghost">Edit</Button>
                </div>
                <Button size="lg" className="w-full mt-8" onClick={() => setStep(2)}>
                  Continue to guest details
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold mb-2 block">Full Name</label>
                  <Input 
                    value={formData.guestName} 
                    onChange={e => setFormData({...formData, guestName: e.target.value})}
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block">Email Address</label>
                  <Input 
                    type="email"
                    value={formData.guestEmail} 
                    onChange={e => setFormData({...formData, guestEmail: e.target.value})}
                    placeholder="john@example.com" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">We'll send your confirmation here.</p>
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block">Phone Number</label>
                  <Input 
                    type="tel"
                    value={formData.guestPhone} 
                    onChange={e => setFormData({...formData, guestPhone: e.target.value})}
                    placeholder="+250 7XX XXX XXX" 
                  />
                </div>
                <Button 
                  size="lg" 
                  className="w-full mt-8" 
                  onClick={handleCreateBooking}
                  isLoading={isCreating}
                  disabled={!formData.guestName || !formData.guestEmail}
                >
                  Continue to payment
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                {/* Payment Method Selector */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div 
                    onClick={() => setFormData({...formData, paymentMethod: 'credit_card'})}
                    className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.paymentMethod === 'credit_card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                  >
                    <CreditCard className={`w-8 h-8 ${formData.paymentMethod === 'credit_card' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-bold text-center">Card</span>
                  </div>
                  <div 
                    onClick={() => setFormData({...formData, paymentMethod: 'mobile_money', mobileNetwork: 'mtn'})}
                    className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.paymentMethod === 'mobile_money' && formData.mobileNetwork === 'mtn' ? 'border-yellow-500 bg-yellow-500/10' : 'border-border hover:border-yellow-500/30'}`}
                  >
                    <Smartphone className={`w-8 h-8 ${formData.paymentMethod === 'mobile_money' && formData.mobileNetwork === 'mtn' ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-bold text-center">MTN MoMo</span>
                  </div>
                  <div 
                    onClick={() => setFormData({...formData, paymentMethod: 'mobile_money', mobileNetwork: 'airtel'})}
                    className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.paymentMethod === 'mobile_money' && formData.mobileNetwork === 'airtel' ? 'border-red-500 bg-red-500/10' : 'border-border hover:border-red-500/30'}`}
                  >
                    <Smartphone className={`w-8 h-8 ${formData.paymentMethod === 'mobile_money' && formData.mobileNetwork === 'airtel' ? 'text-red-500' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-bold text-center">Airtel Money</span>
                  </div>
                </div>

                {formData.paymentMethod === 'credit_card' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <Input placeholder="Card number" value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="MM/YY" value={formData.cardExpiry} onChange={e => setFormData({...formData, cardExpiry: e.target.value})} />
                      <Input placeholder="CVV" value={formData.cardCvv} onChange={e => setFormData({...formData, cardCvv: e.target.value})} />
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'mobile_money' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className={`p-4 rounded-xl mb-4 ${formData.mobileNetwork === 'mtn' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                      <p className="text-sm font-medium">Enter your phone number. A prompt will appear on your phone to enter your PIN and approve the transaction.</p>
                    </div>
                    <Input 
                      placeholder="07XX XXX XXX" 
                      value={formData.mobileMoneyPhone} 
                      onChange={e => setFormData({...formData, mobileMoneyPhone: e.target.value})} 
                    />
                  </div>
                )}

                <Button 
                  size="lg" 
                  className="w-full mt-8" 
                  onClick={handlePayment}
                  isLoading={isPaying}
                >
                  Confirm and Pay
                </Button>
              </div>
            )}
          </div>

          {/* Right Summary Sidebar */}
          <div className="w-full md:w-[350px]">
            <div className="bg-card border border-border rounded-3xl p-6 sticky top-28">
              <div className="flex gap-4 pb-6 border-b border-border mb-6">
                <img src={acc.mainImage} alt={acc.name} className="w-24 h-24 rounded-xl object-cover" />
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase">{acc.type}</div>
                  <h4 className="font-display font-bold leading-tight mt-1">{acc.name}</h4>
                  <div className="text-xs text-muted-foreground mt-1">5 nights</div>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-4">Price details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{formatRWF(acc.pricePerNight)} x 5 nights</span>
                  <span>{formatRWF(acc.pricePerNight * 5)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service fee</span>
                  <span>{formatRWF(15000)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-4 border-t border-border">
                  <span>Total (RWF)</span>
                  <span>{formatRWF(acc.pricePerNight * 5 + 15000)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
