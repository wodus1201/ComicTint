import { SortOrder, StoredPdf } from '../models/pdf';

const safeStr = (s?: string) => (s || '').toLocaleLowerCase();
const safeNum = (n?: number) => (typeof n === 'number' ? n : 0);

export function sortByOrder(items: StoredPdf[], order: SortOrder): StoredPdf[] {
  const byCreatedDesc = (a: StoredPdf, b: StoredPdf) => safeNum(b.createdAt) - safeNum(a.createdAt);
  const bySizeDesc = (a: StoredPdf, b: StoredPdf) => safeNum(b.size) - safeNum(a.size);
  const byNameAsc = (a: StoredPdf, b: StoredPdf) => safeStr(a.name).localeCompare(safeStr(b.name));
  const byRecentOpenedDesc = (a: StoredPdf, b: StoredPdf) =>
    safeNum(b.lastOpenedAt) - safeNum(a.lastOpenedAt);

  const comparator = (() => {
    switch (order) {
      case 'sizeDesc':
        return bySizeDesc;
      case 'nameAsc':
        return byNameAsc;
      case 'recentOpenedDesc':
        return byRecentOpenedDesc;
      case 'addedDesc':
      default:
        return byCreatedDesc;
    }
  })();

  return [...items].sort(comparator);
}

export function sortWithFavoritesPinned(
  items: StoredPdf[],
  order: SortOrder,
  isFavorite: (id: string) => boolean,
): StoredPdf[] {
  const favorites = items.filter(it => isFavorite(it.id));
  const normals = items.filter(it => !isFavorite(it.id));
  const sortedFavs = sortByOrder(favorites, order);
  const sortedNormals = sortByOrder(normals, order);
  return [...sortedFavs, ...sortedNormals];
}
