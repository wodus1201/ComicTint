import { sortByOrder, sortWithFavoritesPinned } from '../src/utils/sort';
import { StoredPdf } from '../src/models/pdf';

const base = (overrides: Partial<StoredPdf> = {}): StoredPdf => ({
  id: overrides.id || Math.random().toString(36).slice(2),
  name: overrides.name || 'a.pdf',
  path: overrides.path || '/tmp/a.pdf',
  size: overrides.size ?? 100,
  createdAt: overrides.createdAt ?? 1000,
  lastOpenedAt: overrides.lastOpenedAt,
  isFavorite: overrides.isFavorite,
  favoriteOrder: overrides.favoriteOrder,
});

describe('sortByOrder', () => {
  const a = base({ name: 'alpha.pdf', size: 100, createdAt: 1000, lastOpenedAt: 500 });
  const b = base({ name: 'beta.pdf', size: 300, createdAt: 2000, lastOpenedAt: 700 });
  const c = base({ name: 'gamma.pdf', size: 200, createdAt: 1500, lastOpenedAt: 600 });
  const arr = [a, b, c];

  test('addedDesc by createdAt desc', () => {
    const res = sortByOrder(arr, 'addedDesc');
    expect(res.map(x => x.createdAt)).toEqual([2000, 1500, 1000]);
  });

  test('sizeDesc by size desc', () => {
    const res = sortByOrder(arr, 'sizeDesc');
    expect(res.map(x => x.size)).toEqual([300, 200, 100]);
  });

  test('nameAsc by name asc', () => {
    const res = sortByOrder(arr, 'nameAsc');
    expect(res.map(x => x.name)).toEqual(['alpha.pdf', 'beta.pdf', 'gamma.pdf']);
  });

  test('recentOpenedDesc by lastOpenedAt desc', () => {
    const res = sortByOrder(arr, 'recentOpenedDesc');
    expect(res.map(x => x.lastOpenedAt)).toEqual([700, 600, 500]);
  });
});

describe('sortWithFavoritesPinned', () => {
  const fav1 = base({ id: 'f1', name: 'fav-one.pdf', createdAt: 3000, size: 50 });
  const fav2 = base({ id: 'f2', name: 'fav-two.pdf', createdAt: 1000, size: 500 });
  const n1 = base({ id: 'n1', name: 'normal-one.pdf', createdAt: 4000, size: 10 });
  const n2 = base({ id: 'n2', name: 'normal-two.pdf', createdAt: 2000, size: 20 });
  const items = [n1, fav2, n2, fav1];

  const isFavorite = (id: string) => id === 'f1' || id === 'f2';

  test('favorites pinned before normals, each group sorted by order', () => {
    const res = sortWithFavoritesPinned(items, 'addedDesc', isFavorite);
    const ids = res.map(x => x.id);
    expect(ids).toEqual(['f1', 'f2', 'n1', 'n2']);
  });

  test('nameAsc within groups', () => {
    const res = sortWithFavoritesPinned(items, 'nameAsc', isFavorite);
    const ids = res.map(x => x.id);
    expect(ids).toEqual(['f1', 'f2', 'n1', 'n2']);
  });
});
