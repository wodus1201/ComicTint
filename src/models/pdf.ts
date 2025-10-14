export type StoredPdf = {
  id: string;
  name: string;
  path: string;
  size: number;
  createdAt: number;
  lastOpenedAt: number;
};

export const PDF_INDEX_STORAGE_KEY = 'app.pdfs';

