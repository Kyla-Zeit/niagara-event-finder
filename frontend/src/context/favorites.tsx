import { createContext, useContext, useEffect, useState } from "react";

type FavoritesContextType = {
  favorites: Set<string>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = "niagara:favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setFavorites(new Set(JSON.parse(raw)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const isFavorite = (id: string) => favorites.has(id);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
