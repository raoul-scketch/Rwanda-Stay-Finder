import { Link, useLocation } from "wouter";
import { Map, MapPin, Calendar, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/explore", label: "Explore" },
    { href: "/my-bookings", label: "My Bookings" },
    { href: "/list-property", label: "List your property" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
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

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm font-semibold transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button size="sm" onClick={() => window.location.href='/explore'}>
            Find Stays
          </Button>
        </nav>

        <button className="md:hidden p-2 text-foreground">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
