import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PDF_INDEX_STORAGE_KEY,
  StoredPdf,
  SortOrder,
  SORT_ORDER_STORAGE_KEY,
  DEFAULT_SORT_ORDER,
} from '../models/pdf';

export async function readPdfIndex(): Promise<StoredPdf[]> {
  try {
    const raw = await AsyncStorage.getItem(PDF_INDEX_STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data as StoredPdf[];
  } catch (e) {
    console.warn('readPdfIndex error', e);
    return [];
  }
}

export async function writePdfIndex(items: StoredPdf[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PDF_INDEX_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('writePdfIndex error', e);
    throw e;
  }
}

export async function appendPdfIndex(item: StoredPdf): Promise<void> {
  const items = await readPdfIndex();
  items.unshift(item);
  await writePdfIndex(items);
}

export async function removeFromPdfIndex(id: string): Promise<void> {
  const items = await readPdfIndex();
  const next = items.filter(i => i.id !== id);
  await writePdfIndex(next);
}

export async function updatePdfIndex(update: Partial<StoredPdf> & { id: string }): Promise<void> {
  const items = await readPdfIndex();
  const next = items.map(i => (i.id === update.id ? { ...i, ...update } : i));
  await writePdfIndex(next);
}

export async function removePdfWithTransaction(id: string, filePath: string): Promise<void> {
  const items = await readPdfIndex();
  const itemToDelete = items.find(i => i.id === id);

  if (!itemToDelete) {
    throw new Error('PDF 항목을 찾을 수 없습니다');
  }

  try {
    const next = items.filter(i => i.id !== id);
    await writePdfIndex(next);

    const { deletePdfFile, deletePdfDirectory } = await import('../utils/fileCopy');
    await deletePdfFile(filePath);
    await deletePdfDirectory(id);
  } catch (error) {
    console.warn('removePdfWithTransaction error:', error);
    throw error;
  }
}

export async function getSortOrder(): Promise<SortOrder> {
  try {
    const raw = await AsyncStorage.getItem(SORT_ORDER_STORAGE_KEY);
    if (!raw) return DEFAULT_SORT_ORDER;
    const value = JSON.parse(raw) as SortOrder;
    return value ?? DEFAULT_SORT_ORDER;
  } catch (e) {
    console.warn('getSortOrder error', e);
    return DEFAULT_SORT_ORDER;
  }
}

export async function setSortOrder(order: SortOrder): Promise<void> {
  try {
    await AsyncStorage.setItem(SORT_ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch (e) {
    console.warn('setSortOrder error', e);
    throw e;
  }
}
