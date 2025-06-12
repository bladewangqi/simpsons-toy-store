import { useFavoritesStore } from '../stores/favoritesStore';

export function useFavorites() {
  const {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoriteCount,
  } = useFavoritesStore();

  const favoriteCount = getFavoriteCount();

  return {
    favorites,
    favoriteCount,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}
