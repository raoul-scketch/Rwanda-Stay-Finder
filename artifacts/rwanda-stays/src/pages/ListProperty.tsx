import { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCreateAccommodation, AccommodationType } from "@workspace/api-client-react";
import { Check, CheckCircle2, ChevronLeft, ChevronRight, UploadCloud, MapPin, Home, List as ListIcon, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AMENITIES_LIST = [
  "WiFi", "Pool", "Restaurant", "Spa", "Gym", "Bar", 
  "Parking", "Kitchen", "Airport Shuttle", "Breakfast Included", 
  "Air Conditioning", "Garden", "Room Service", "Lake Access", 
  "Forest Views", "Mountain Views", "Guided Tours", "Conference Rooms"
];

const PROVINCES = [
  "Kigali City", "Northern Province", "Southern Province", 
  "Eastern Province", "Western Province"
];

export default function ListProperty() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { mutateAsync: createAccommodation, isPending } = useCreateAccommodation();

  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: AccommodationType.hotel,
    description: "",
    province: PROVINCES[0],
    district: "",
    address: "",
    latitude: "",
    longitude: "",
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: "",
    amenities: [] as string[],
    mainImage: "",
    additionalImages: ["", "", "", "", ""],
    contactEmail: "",
    contactPhone: ""
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => {
      if (prev.amenities.includes(amenity)) {
        return { ...prev, amenities: prev.amenities.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  const updateAdditionalImage = (index: number, url: string) => {
    const newImages = [...formData.additionalImages];
    newImages[index] = url;
    updateForm("additionalImages", newImages);
  };

  const handleSubmit = async () => {
    try {
      await createAccommodation({
        data: {
          name: formData.name,
          type: formData.type,
          description: formData.description,
          province: formData.province,
          district: formData.district,
          address: formData.address,
          latitude: parseFloat(formData.latitude) || 0,
          longitude: parseFloat(formData.longitude) || 0,
          maxGuests: parseInt(formData.maxGuests.toString()) || 1,
          bedrooms: parseInt(formData.bedrooms.toString()) || 1,
          bathrooms: parseInt(formData.bathrooms.toString()) || 1,
          pricePerNight: parseFloat(formData.pricePerNight.toString()) || 0,
          amenities: formData.amenities,
          mainImage: formData.mainImage,
          images: formData.additionalImages.filter(img => img.trim() !== ""),
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone
        }
      });
      setIsSuccess(true);
    } catch (e: any) {
      toast({ title: "Failed to list property", description: e.message, variant: "destructive" });
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 mt-20 text-center">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Property Listed Successfully!</h1>
          <p className="text-muted-foreground text-lg mb-10">
            Your accommodation is now live on Rwanda Stays. Travellers can now discover and book your property.
          </p>
          <Button size="lg" onClick={() => setLocation("/explore")}>
            Go to Explore
          </Button>
        </main>
      </div>
    );
  }

  const steps = [
    { num: 1, title: "Basic Info", icon: <Home className="w-5 h-5" /> },
    { num: 2, title: "Location", icon: <MapPin className="w-5 h-5" /> },
    { num: 3, title: "Details", icon: <ListIcon className="w-5 h-5" /> },
    { num: 4, title: "Photos", icon: <ImageIcon className="w-5 h-5" /> },
    { num: 5, title: "Review", icon: <Check className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Progress Bar */}
      <div className="bg-card border-b border-border sticky top-20 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            
            {steps.map(s => (
              <div 
                key={s.num} 
                className={`flex flex-col items-center gap-2 ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors bg-background ${step >= s.num ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>
                  {s.icon}
                </div>
                <span className="text-xs font-bold hidden md:block">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 flex flex-col">
        <div className="flex-1">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-3xl font-display font-bold">Tell us about your place</h2>
              <p className="text-muted-foreground">Start with the basics. What kind of property are you listing?</p>

              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-bold mb-2 block">Property Name</label>
                  <Input 
                    placeholder="e.g. Kigali Skyline Apartment" 
                    value={formData.name}
                    onChange={e => updateForm("name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-bold mb-2 block">Property Type</label>
                  <select 
                    className="w-full h-12 rounded-xl border-2 border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all cursor-pointer"
                    value={formData.type}
                    onChange={e => updateForm("type", e.target.value)}
                  >
                    {Object.values(AccommodationType).map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold mb-2 block">Description</label>
                  <textarea 
                    className="w-full min-h-[150px] rounded-xl border-2 border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all resize-none"
                    placeholder="Describe what makes your place special..."
                    value={formData.description}
                    onChange={e => updateForm("description", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-3xl font-display font-bold">Where is it located?</h2>
              <p className="text-muted-foreground">Help guests find your property accurately.</p>

              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold mb-2 block">Province</label>
                    <select 
                      className="w-full h-12 rounded-xl border-2 border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all cursor-pointer"
                      value={formData.province}
                      onChange={e => updateForm("province", e.target.value)}
                    >
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-2 block">District</label>
                    <Input 
                      placeholder="e.g. Gasabo" 
                      value={formData.district}
                      onChange={e => updateForm("district", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold mb-2 block">Full Address</label>
                  <Input 
                    placeholder="Street name, Neighborhood, etc." 
                    value={formData.address}
                    onChange={e => updateForm("address", e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-bold mb-1">Map Coordinates</h3>
                  <p className="text-xs text-muted-foreground mb-4">You can find these by right-clicking your location on Google Maps.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold mb-1 block">Latitude</label>
                      <Input 
                        type="number" step="any" placeholder="e.g. -1.9441" 
                        value={formData.latitude}
                        onChange={e => updateForm("latitude", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold mb-1 block">Longitude</label>
                      <Input 
                        type="number" step="any" placeholder="e.g. 30.0619" 
                        value={formData.longitude}
                        onChange={e => updateForm("longitude", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-3xl font-display font-bold">Property Details</h2>
              <p className="text-muted-foreground">Add capacity, pricing, and amenities.</p>

              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-bold mb-2 block">Guests</label>
                    <Input 
                      type="number" min="1" 
                      value={formData.maxGuests}
                      onChange={e => updateForm("maxGuests", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-2 block">Bedrooms</label>
                    <Input 
                      type="number" min="0" 
                      value={formData.bedrooms}
                      onChange={e => updateForm("bedrooms", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-2 block">Bathrooms</label>
                    <Input 
                      type="number" min="0" 
                      value={formData.bathrooms}
                      onChange={e => updateForm("bathrooms", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold mb-2 block">Price per night (RWF)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">RWF</span>
                    <Input 
                      type="number" className="pl-14" placeholder="e.g. 50000"
                      value={formData.pricePerNight}
                      onChange={e => updateForm("pricePerNight", e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <label className="text-sm font-bold mb-4 block">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AMENITIES_LIST.map(amenity => (
                      <label 
                        key={amenity} 
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.amenities.includes(amenity) 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-input hover:border-primary/30 text-foreground'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          formData.amenities.includes(amenity) ? 'bg-primary border-primary' : 'border-muted-foreground'
                        }`}>
                          {formData.amenities.includes(amenity) && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <span className="text-sm font-medium">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-3xl font-display font-bold">Add some photos</h2>
              <p className="text-muted-foreground">Provide URLs for your property images. High quality photos attract more guests.</p>

              <div className="space-y-6 pt-4">
                <div>
                  <label className="text-sm font-bold mb-2 block">Main Cover Image URL *</label>
                  <div className="flex gap-4">
                    <Input 
                      placeholder="https://..." 
                      value={formData.mainImage}
                      onChange={e => updateForm("mainImage", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  {formData.mainImage && (
                    <div className="mt-4 rounded-xl overflow-hidden h-48 bg-muted border border-border">
                      <img src={formData.mainImage} alt="Main Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold mb-2 block">Additional Image URLs (Optional)</label>
                  <div className="space-y-3">
                    {formData.additionalImages.map((url, i) => (
                      <Input 
                        key={i}
                        placeholder={`Image ${i+1} URL`} 
                        value={url}
                        onChange={e => updateAdditionalImage(i, e.target.value)}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-4">
                  <h3 className="font-bold">Contact Details</h3>
                  <div>
                    <label className="text-xs font-bold mb-1 block">Contact Email</label>
                    <Input 
                      type="email" placeholder="host@example.com"
                      value={formData.contactEmail}
                      onChange={e => updateForm("contactEmail", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1 block">Contact Phone</label>
                    <Input 
                      type="tel" placeholder="+250..."
                      value={formData.contactPhone}
                      onChange={e => updateForm("contactPhone", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-3xl font-display font-bold">Review & Submit</h2>
              <p className="text-muted-foreground">Make sure everything looks good before publishing.</p>

              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm mt-4">
                <div className="flex gap-6 pb-6 border-b border-border">
                  <div className="w-32 h-32 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                    {formData.mainImage ? (
                      <img src={formData.mainImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageIcon className="w-8 h-8" /></div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-primary uppercase mb-1">{formData.type}</div>
                    <h3 className="text-2xl font-display font-bold mb-2">{formData.name || "Untitled Property"}</h3>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {formData.district || "Unknown District"}, {formData.province}
                    </div>
                  </div>
                </div>

                <div className="py-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-border text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-1">Guests</span>
                    <span className="font-bold">{formData.maxGuests}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Bedrooms</span>
                    <span className="font-bold">{formData.bedrooms}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Bathrooms</span>
                    <span className="font-bold">{formData.bathrooms}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Price/Night</span>
                    <span className="font-bold text-primary">{formData.pricePerNight ? `RWF ${formData.pricePerNight}` : "Not set"}</span>
                  </div>
                </div>

                <div className="py-6">
                  <h4 className="font-bold mb-3 text-sm">Selected Amenities</h4>
                  {formData.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.amenities.map(a => (
                        <span key={a} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full font-medium">
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No amenities selected</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="pt-8 mt-8 border-t border-border flex justify-between items-center bg-background sticky bottom-0 pb-8">
          <Button 
            variant="ghost" 
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1 || isPending}
            className="text-muted-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          {step < 5 ? (
            <Button 
              size="lg" 
              onClick={() => setStep(prev => Math.min(steps.length, prev + 1))}
            >
              Next Step <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              size="lg" 
              onClick={handleSubmit}
              isLoading={isPending}
              disabled={!formData.name || !formData.pricePerNight || !formData.mainImage}
            >
              Publish Listing
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
