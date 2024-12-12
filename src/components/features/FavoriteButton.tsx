import { Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useAuth } from '../../contexts/AuthContext';

interface FavoriteButtonProps {
  devotionalDay: number;
}

export function FavoriteButton({ devotionalDay }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, isLoading } = useFavorites(devotionalDay);

  if (!user) return null;

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        className={`w-5 h-5 ${
          isFavorite 
            ? 'fill-red-500 text-red-500' 
            : 'text-gray-600 dark:text-gray-300'
        }`}
      />
    </button>
  );
}