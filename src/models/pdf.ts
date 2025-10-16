export type StoredPdf = {
  id: string;
  name: string;
  path: string;
  size: number;
  createdAt: number;
  lastOpenedAt?: number;
  isFavorite?: boolean;
  favoriteOrder?: number;
};

export const PDF_INDEX_STORAGE_KEY = 'app.pdfs';

export type SortOrder = 'addedDesc' | 'sizeDesc' | 'nameAsc' | 'recentOpenedDesc';

export const DEFAULT_SORT_ORDER: SortOrder = 'addedDesc';

export const SORT_ORDER_STORAGE_KEY = 'app.sortOrder';
