import { useCallback, useMemo } from 'react';
import { useColoringStore } from '../stores/coloringStore';
import { Layer, LayerState } from '../models/coloring';

interface UseLayerManagementReturn {
  layers: LayerState;

  addLayer: (name?: string) => void;
  deleteLayer: (layerId: string) => void;
  selectLayer: (layerId: string) => void;
  renameLayer: (layerId: string, name: string) => void;

  toggleLayerVisibility: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setLayerBlendMode: (
    layerId: string,
    blendMode: 'normal' | 'multiply' | 'screen' | 'overlay',
  ) => void;

  reorderLayers: (fromIndex: number, toIndex: number) => void;
  moveLayerUp: (layerId: string) => void;
  moveLayerDown: (layerId: string) => void;
  moveLayerToTop: (layerId: string) => void;
  moveLayerToBottom: (layerId: string) => void;

  duplicateLayer: (layerId: string) => void;

  activeLayer: Layer | null;
  getLayerById: (layerId: string) => Layer | null;
  getLayerIndex: (layerId: string) => number;
  canMoveUp: (layerId: string) => boolean;
  canMoveDown: (layerId: string) => boolean;

  validateLayerName: (name: string) => string;
  validateLayerOpacity: (opacity: number) => number;

  createLayerGroup: (name: string) => void;
  addLayerToGroup: (layerId: string, groupId: string) => void;

  layerStats: {
    totalLayers: number;
    visibleLayers: number;
    hiddenLayers: number;
    layersWithStrokes: number;
  };
}

const LAYER_LIMITS = {
  maxLayers: 50,
  minOpacity: 0,
  maxOpacity: 1,
  maxNameLength: 50,
} as const;

export const useLayerManagement = (): UseLayerManagementReturn => {
  const {
    layers,
    addLayer: storeAddLayer,
    deleteLayer: storeDeleteLayer,
    selectLayer: storeSelectLayer,
    renameLayer: storeRenameLayer,
    toggleLayerVisibility: storeToggleLayerVisibility,
    reorderLayers: storeReorderLayers,
  } = useColoringStore();

  const addLayer = useCallback(
    (name?: string) => {
      if (layers.items.length >= LAYER_LIMITS.maxLayers) {
        console.warn('최대 레이어 수에 도달했습니다.');
        return;
      }

      const validatedName = validateLayerName(name || `Layer ${layers.nextLayerId}`);
      storeAddLayer(validatedName);
    },
    [layers.items.length, layers.nextLayerId, storeAddLayer],
  );

  const deleteLayer = useCallback(
    (layerId: string) => {
      if (layers.items.length <= 1) {
        console.warn('최소 하나의 레이어는 유지되어야 합니다.');
        return;
      }

      storeDeleteLayer(layerId);
    },
    [layers.items.length, storeDeleteLayer],
  );

  const selectLayer = useCallback(
    (layerId: string) => {
      const layer = layers.items.find(l => l.id === layerId);
      if (layer) {
        storeSelectLayer(layerId);
      }
    },
    [layers.items, storeSelectLayer],
  );

  const renameLayer = useCallback(
    (layerId: string, name: string) => {
      const validatedName = validateLayerName(name);
      storeRenameLayer(layerId, validatedName);
    },
    [storeRenameLayer],
  );

  const toggleLayerVisibility = useCallback(
    (layerId: string) => {
      storeToggleLayerVisibility(layerId);
    },
    [storeToggleLayerVisibility],
  );

  const setLayerOpacity = useCallback((layerId: string, opacity: number) => {
    const validatedOpacity = validateLayerOpacity(opacity);
    // TODO: 스토어에 setLayerOpacity 액션 추가
  }, []);

  const setLayerBlendMode = useCallback(
    (layerId: string, blendMode: 'normal' | 'multiply' | 'screen' | 'overlay') => {
      // TODO: 스토어에 setLayerBlendMode 액션 추가
    },
    [],
  );

  const reorderLayers = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (
        fromIndex < 0 ||
        fromIndex >= layers.items.length ||
        toIndex < 0 ||
        toIndex >= layers.items.length
      ) {
        return;
      }

      storeReorderLayers(fromIndex, toIndex);
    },
    [layers.items.length, storeReorderLayers],
  );

  const moveLayerUp = useCallback(
    (layerId: string) => {
      const currentIndex = getLayerIndex(layerId);
      if (currentIndex > 0) {
        reorderLayers(currentIndex, currentIndex - 1);
      }
    },
    [reorderLayers],
  );

  const moveLayerDown = useCallback(
    (layerId: string) => {
      const currentIndex = getLayerIndex(layerId);
      if (currentIndex < layers.items.length - 1) {
        reorderLayers(currentIndex, currentIndex + 1);
      }
    },
    [layers.items.length, reorderLayers],
  );

  const moveLayerToTop = useCallback(
    (layerId: string) => {
      const currentIndex = getLayerIndex(layerId);
      if (currentIndex > 0) {
        reorderLayers(currentIndex, 0);
      }
    },
    [reorderLayers],
  );

  const moveLayerToBottom = useCallback(
    (layerId: string) => {
      const currentIndex = getLayerIndex(layerId);
      if (currentIndex < layers.items.length - 1) {
        reorderLayers(currentIndex, layers.items.length - 1);
      }
    },
    [layers.items.length, reorderLayers],
  );

  const duplicateLayer = useCallback((layerId: string) => {
    const layer = getLayerById(layerId);
    if (!layer) return;

    // TODO: 실제 복제 로직 구현 (스토어에 duplicateLayer 액션 추가)
    const duplicatedName = `${layer.name} 복사본`;
  }, []);

  const validateLayerName = useCallback(
    (name: string): string => {
      if (!name.trim()) {
        return `Layer ${layers.nextLayerId}`;
      }

      const trimmedName = name.trim();
      if (trimmedName.length > LAYER_LIMITS.maxNameLength) {
        return trimmedName.substring(0, LAYER_LIMITS.maxNameLength);
      }

      return trimmedName;
    },
    [layers.nextLayerId],
  );

  const validateLayerOpacity = useCallback((opacity: number): number => {
    return Math.max(LAYER_LIMITS.minOpacity, Math.min(LAYER_LIMITS.maxOpacity, opacity));
  }, []);

  const createLayerGroup = useCallback((name: string) => {
    // TODO: 레이어 그룹 기능 구현
  }, []);

  const addLayerToGroup = useCallback((layerId: string, groupId: string) => {
    // TODO: 레이어 그룹 기능 구현
  }, []);

  const activeLayer = useMemo(() => {
    return layers.items.find(layer => layer.id === layers.activeLayerId) || null;
  }, [layers.items, layers.activeLayerId]);

  const getLayerById = useCallback(
    (layerId: string): Layer | null => {
      return layers.items.find(layer => layer.id === layerId) || null;
    },
    [layers.items],
  );

  const getLayerIndex = useCallback(
    (layerId: string): number => {
      return layers.items.findIndex(layer => layer.id === layerId);
    },
    [layers.items],
  );

  const canMoveUp = useCallback(
    (layerId: string): boolean => {
      const index = getLayerIndex(layerId);
      return index > 0;
    },
    [getLayerIndex],
  );

  const canMoveDown = useCallback(
    (layerId: string): boolean => {
      const index = getLayerIndex(layerId);
      return index < layers.items.length - 1;
    },
    [layers.items.length, getLayerIndex],
  );

  const layerStats = useMemo(() => {
    const totalLayers = layers.items.length;
    const visibleLayers = layers.items.filter(layer => layer.visible).length;
    const hiddenLayers = totalLayers - visibleLayers;
    const layersWithStrokes = layers.items.filter(layer => layer.strokes.length > 0).length;

    return {
      totalLayers,
      visibleLayers,
      hiddenLayers,
      layersWithStrokes,
    };
  }, [layers.items]);

  return {
    layers,
    addLayer,
    deleteLayer,
    selectLayer,
    renameLayer,
    toggleLayerVisibility,
    setLayerOpacity,
    setLayerBlendMode,
    reorderLayers,
    moveLayerUp,
    moveLayerDown,
    moveLayerToTop,
    moveLayerToBottom,
    duplicateLayer,
    activeLayer,
    getLayerById,
    getLayerIndex,
    canMoveUp,
    canMoveDown,
    validateLayerName,
    validateLayerOpacity,
    createLayerGroup,
    addLayerToGroup,
    layerStats,
  };
};
