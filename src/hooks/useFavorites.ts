import { useState, useEffect } from 'react';
import { StoredPdf } from '../models/pdf';
import { readPdfIndex, updatePdfIndex } from '../storage/pdfIndex';
import { useCustomAlert } from './useCustomAlert';

export function useFavorites() {
  const [favorites, setFavorites] = useState<StoredPdf[]>([]);
  const { showAlert, AlertComponent } = useCustomAlert();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const allPdfs = await readPdfIndex();
      const favoritePdfs = allPdfs.filter(pdf => pdf.isFavorite);
      const sortedFavorites = favoritePdfs.sort(
        (a, b) => (a.favoriteOrder || 0) - (b.favoriteOrder || 0),
      );
      setFavorites(sortedFavorites);
    } catch (error) {
      console.warn('Failed to load favorites:', error);
    }
  };

  const toggleFavorite = async (pdf: StoredPdf) => {
    try {
      const isCurrentlyFavorite = pdf.isFavorite || false;
      const now = Date.now();

      if (isCurrentlyFavorite) {
        await updatePdfIndex({
          id: pdf.id,
          isFavorite: false,
          favoriteOrder: undefined,
        });

        setFavorites(prev => prev.filter(fav => fav.id !== pdf.id));
      } else {
        const nextOrder = favorites.length;
        await updatePdfIndex({
          id: pdf.id,
          isFavorite: true,
          favoriteOrder: nextOrder,
        });

        const updatedPdf = { ...pdf, isFavorite: true, favoriteOrder: nextOrder };
        setFavorites(prev => [...prev, updatedPdf]);
      }
    } catch (error) {
      console.warn('Failed to toggle favorite:', error);
      showAlert({
        title: '오류',
        message: '즐겨찾기 상태를 변경하는 중 오류가 발생했습니다.',
        buttons: [{ text: '확인' }],
      });
    }
  };

  const isFavorite = (pdfId: string): boolean => {
    return favorites.some(fav => fav.id === pdfId);
  };

  const getFavoriteOrder = (pdfId: string): number | undefined => {
    const favorite = favorites.find(fav => fav.id === pdfId);
    return favorite?.favoriteOrder;
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoriteOrder,
    loadFavorites,
    AlertComponent,
  };
}
