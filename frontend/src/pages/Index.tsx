import { useState, useMemo } from "react";
import { Menu, Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

import SearchBar from "@/components/SearchBar";
import CategoryChips from "@/components/CategoryChips";
import EventCard from "@/components/EventCard";
import EventDetail from "@/components/EventDetail";
import BottomNav from "@/components/BottomNav";
import { events, categories, type NiagaraEvent } from "@/data/events";
import { TAB_TO_PATH, pathToTab, type AppTab } from "@/lib/tabs";

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [selectedEvent, setSelectedEvent] = useState<NiagaraEvent | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = pathToTab(location.pathname);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Events" || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-5">
          <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Menu className="w-5 h-5 text-foreground" />
          </button>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-display font-bold text-gradient"
          >
            Niagara Events
          </motion.h1>

          <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 gradient-primary rounded-full" />
          </button>
        </div>

        <SearchBar value={search} onChange={setSearch} />

        <div className="mt-4">
          <CategoryChips
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </div>

      {/* Events Section */}
      <div className="px-5 pb-28">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-foreground">
            {selectedCategory === "All Events" ? "Upcoming Events" : selectedCategory}
          </h2>
          <button className="text-sm text-primary font-medium">See all</button>
        </div>

        {filteredEvents.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="text-muted-foreground text-sm">No events found</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={setSelectedEvent}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        active={activeTab}
        onNavigate={(tab: AppTab) => navigate(TAB_TO_PATH[tab])}
      />

      {/* Event Detail Overlay */}
      <AnimatePresence>
        {selectedEvent && <EventDetail event={selectedEvent} onBack={() => setSelectedEvent(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
