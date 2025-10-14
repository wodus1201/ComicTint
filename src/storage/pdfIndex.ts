import AsyncStorage from '@react-native-async-storage/async-storage';
import { PDF_INDEX_STORAGE_KEY, StoredPdf } from '../models/pdf';

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
  const next = items.filter((i) => i.id !== id);
  await writePdfIndex(next);
}

export async function updatePdfIndex(update: Partial<StoredPdf> & { id: string }): Promise<void> {
  const items = await readPdfIndex();
  const next = items.map((i) => (i.id === update.id ? { ...i, ...update } : i));
  await writePdfIndex(next);
}

