import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useFavorites(devotionalDay: number) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          setIsLoading(false);
          return;
        }

        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', userId)
          .eq('devotional_day', devotionalDay)
          .single();

        setIsFavorite(!!data);
      } catch (error) {
        console.error('Erro ao verificar favorito:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavorite();
  }, [devotionalDay]);

  const toggleFavorite = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('user_id');
      if (!userId) return;

      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('devotional_day', devotionalDay);
      } else {
        await supabase
          .from('favorites')
          .insert([{ user_id: userId, devotional_day: devotionalDay }]);
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isFavorite, toggleFavorite, isLoading };
}