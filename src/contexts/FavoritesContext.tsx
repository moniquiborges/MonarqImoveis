"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface FavoriteItem {
  slug: string;
  href: string;
  title: string;
  location: string;
  price?: number | null;
  image: { url: string; alt?: string };
  code?: string;
  specsSummary?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  totalFavorites: number;
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  removeFavorite: (slug: string) => void;
  clearFavorites: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = "monarq_favorites_v1";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // Ignora erro de localStorage
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch {
        // Ignora erro de cota
      }
    }
  }, [favorites, isLoaded]);

  const isFavorite = (slug: string) => {
    return favorites.some((item) => item.slug === slug);
  };

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.slug === item.slug);
      if (exists) {
        return prev.filter((f) => f.slug !== item.slug);
      } else {
        return [item, ...prev];
      }
    });
  };

  const removeFavorite = (slug: string) => {
    setFavorites((prev) => prev.filter((f) => f.slug !== slug));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        totalFavorites: favorites.length,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites deve ser utilizado dentro de FavoritesProvider");
  }
  return context;
}
