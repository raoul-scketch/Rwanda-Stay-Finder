import { Link } from "wouter";
import { Instagram, Twitter, Facebook, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("bg-card/50 border-t border-border mt-auto", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <img 
                  src={`${import.meta.env.BASE_URL}images/logo-icon.png`} 
                  alt="Rwanda Stays Logo" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                Rwanda<span className="text-primary">Stays</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Discover Rwanda's finest accommodations. Experience the land of a thousand hills in comfort and luxury.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <p className="text-muted-foreground text-xs mt-4">
              © {new Date().getFullYear()} RwandaStays. All rights reserved.
            </p>
          </div>

          {/* Discover */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Discover</h3>
            <ul className="space-y-4">
              <li><Link href="/explore" className="text-muted-foreground hover:text-primary transition-colors text-sm">Explore Stays</Link></li>
              <li><Link href="/explore" className="text-muted-foreground hover:text-primary transition-colors text-sm">Interactive Map</Link></li>
              <li><Link href="/explore?featured=true" className="text-muted-foreground hover:text-primary transition-colors text-sm">Featured Lodges</Link></li>
              <li><Link href="/explore?type=lodge" className="text-muted-foreground hover:text-primary transition-colors text-sm">Gorilla Trekking</Link></li>
              <li><Link href="/explore?district=Rubavu" className="text-muted-foreground hover:text-primary transition-colors text-sm">Lake Kivu Stays</Link></li>
              <li><Link href="/explore?district=Rusizi" className="text-muted-foreground hover:text-primary transition-colors text-sm">Nyungwe Forest Lodges</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link href="/list-property" className="text-muted-foreground hover:text-primary transition-colors text-sm">List your property</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Partner with us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">About us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Press</Link></li>
            </ul>
          </div>

          {/* Payment & Support */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">We accept</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-3 py-1.5 bg-[#1434CB]/10 text-[#1434CB] dark:bg-[#1434CB]/20 dark:text-[#889cf5] rounded-md text-xs font-bold border border-[#1434CB]/20">Visa</span>
              <span className="px-3 py-1.5 bg-[#EB001B]/10 text-[#EB001B] dark:bg-[#EB001B]/20 dark:text-[#ff7a89] rounded-md text-xs font-bold border border-[#EB001B]/20">Mastercard</span>
              <span className="px-3 py-1.5 bg-[#FFCC00]/10 text-[#FFCC00] dark:bg-[#FFCC00]/20 dark:text-[#ffe066] rounded-md text-xs font-bold border border-[#FFCC00]/20">MTN MoMo</span>
              <span className="px-3 py-1.5 bg-[#FF0000]/10 text-[#FF0000] dark:bg-[#FF0000]/20 dark:text-[#ff6666] rounded-md text-xs font-bold border border-[#FF0000]/20">Airtel Money</span>
            </div>

            <h3 className="font-display font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Help Center</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Cancellation policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Trust & Safety</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for Rwanda tourism
          </p>
        </div>
      </div>
    </footer>
  );
}