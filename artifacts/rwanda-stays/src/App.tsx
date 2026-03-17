import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import AccommodationDetail from "@/pages/AccommodationDetail";
import BookingFlow from "@/pages/BookingFlow";
import Confirmation from "@/pages/Confirmation";
import MyBookings from "@/pages/MyBookings";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }
  }
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/accommodation/:id" component={AccommodationDetail} />
      <Route path="/book/:id" component={BookingFlow} />
      <Route path="/confirmation/:id" component={Confirmation} />
      <Route path="/my-bookings" component={MyBookings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
