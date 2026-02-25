import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/context/favorites";

import Index from "./pages/Index";
import Tickets from "./pages/Tickets";
import Map from "./pages/Map";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/map" element={<Map />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  );
}
