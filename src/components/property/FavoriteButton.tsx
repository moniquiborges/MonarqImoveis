"use client";

import { Heart } from "lucide-react";
import { useFavorites, type FavoriteItem } from "@/contexts/FavoritesContext";

export interface FavoriteButtonProps {
  item: FavoriteItem;
  className?: string;
}

export function FavoriteButton({ item, className = "" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(item.slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item);
  };

  return (
    <button
      type="button"
      aria-label={active ? "Remover dos favoritos" : "Salvar nos favoritos"}
      title={active ? "Salvo nos favoritos" : "Salvar imóvel"}
      onClick={handleClick}
      className={`focus-ring absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-graphite shadow-sm transition-all hover:scale-110 active:scale-95 cursor-pointer ${
        active ? "text-terracota bg-white" : "hover:text-terracota"
      } ${className}`}
    >
      <Heart
        className={`h-4 w-4 transition-transform ${
          active ? "fill-terracota text-terracota scale-110" : "text-graphite/70"
        }`}
      />
    </button>
  );
}
