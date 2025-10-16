const store = new Map();

module.exports = {
  setItem: async (key, value) => {
    store.set(key, value);
  },
  getItem: async key => (store.has(key) ? store.get(key) : null),
  removeItem: async key => {
    store.delete(key);
  },
  clear: async () => {
    store.clear();
  },
  getAllKeys: async () => Array.from(store.keys()),
  multiGet: async keys => keys.map(k => [k, store.get(k) ?? null]),
  multiSet: async pairs => {
    pairs.forEach(([k, v]) => store.set(k, v));
  },
  multiRemove: async keys => {
    keys.forEach(k => store.delete(k));
  },
};
