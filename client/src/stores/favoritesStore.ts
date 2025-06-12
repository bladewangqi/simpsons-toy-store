import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  getFavoriteCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (productId) => {
        const favorites = get().favorites;
        if (!favorites.includes(productId)) {
          set({ favorites: [...favorites, productId] });
        }
      },
      removeFavorite: (productId) => {
        set(state => ({
          favorites: state.favorites.filter(id => id !== productId)
        }));
      },
      toggleFavorite: (productId) => {
        const favorites = get().favorites;
        if (favorites.includes(productId)) {
          get().removeFavorite(productId);
        } else {
          get().addFavorite(productId);
        }
      },
      isFavorite: (productId) => {
        return get().favorites.includes(productId);
      },
      getFavoriteCount: () => {
        return get().favorites.length;
      },
    }),
    {
      name: 'simpsons-favorites',
    }
  )
);
