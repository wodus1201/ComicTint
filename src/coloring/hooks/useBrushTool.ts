import { useCallback, useMemo } from 'react';
import { useColoringStore } from '../stores/coloringStore';
import { BrushSettings, BrushType } from '../models/coloring';

interface BrushPreset {
  id: string;
  name: string;
  settings: BrushSettings;
  category: 'basic' | 'artistic' | 'special';
}

interface UseBrushToolReturn {
  // 현재 브러시 설정
  brush: BrushSettings;

  // 브러시 설정 변경 함수들
  setBrushType: (type: BrushType) => void;
  setBrushSize: (size: number) => void;
  setBrushOpacity: (opacity: number) => void;
  setBrushColor: (color: string) => void;
  setBrushHardness: (hardness: number) => void;

  // 브러시 설정 검증 및 제한
  validateBrushSize: (size: number) => number;
  validateBrushOpacity: (opacity: number) => number;
  validateBrushHardness: (hardness: number) => number;

  // 브러시 프리셋 관리
  presets: BrushPreset[];
  applyPreset: (presetId: string) => void;
  createPreset: (name: string, settings: BrushSettings) => void;

  // 브러시 설정 초기화
  resetToDefault: () => void;

  // 브러시 설정 복사/붙여넣기
  copyBrushSettings: () => BrushSettings;
  pasteBrushSettings: (settings: BrushSettings) => void;

  // 브러시 정보
  brushInfo: {
    isEraser: boolean;
    isBucket: boolean;
    canDraw: boolean;
    displayName: string;
  };
}

const BRUSH_LIMITS = {
  size: { min: 1, max: 100 },
  opacity: { min: 0.1, max: 1.0 },
  hardness: { min: 0, max: 1 },
} as const;

const DEFAULT_BRUSH_PRESETS: BrushPreset[] = [
  {
    id: 'pen_fine',
    name: '펜 (얇은)',
    settings: { type: 'pen', size: 2, opacity: 1, color: '#000000', hardness: 1 },
    category: 'basic',
  },
  {
    id: 'pen_medium',
    name: '펜 (중간)',
    settings: { type: 'pen', size: 5, opacity: 1, color: '#000000', hardness: 1 },
    category: 'basic',
  },
  {
    id: 'pen_thick',
    name: '펜 (굵은)',
    settings: { type: 'pen', size: 10, opacity: 1, color: '#000000', hardness: 1 },
    category: 'basic',
  },
  {
    id: 'brush_soft',
    name: '브러시 (부드러운)',
    settings: { type: 'brush', size: 15, opacity: 0.8, color: '#000000', hardness: 0.3 },
    category: 'artistic',
  },
  {
    id: 'brush_hard',
    name: '브러시 (딱딱한)',
    settings: { type: 'brush', size: 12, opacity: 0.9, color: '#000000', hardness: 0.8 },
    category: 'artistic',
  },
  {
    id: 'eraser_small',
    name: '지우개 (작은)',
    settings: { type: 'eraser', size: 8, opacity: 1, color: '#ffffff', hardness: 1 },
    category: 'special',
  },
  {
    id: 'eraser_large',
    name: '지우개 (큰)',
    settings: { type: 'eraser', size: 20, opacity: 1, color: '#ffffff', hardness: 1 },
    category: 'special',
  },
  {
    id: 'bucket_fill',
    name: '양동이 채우기',
    settings: { type: 'bucket', size: 1, opacity: 1, color: '#000000', hardness: 1 },
    category: 'special',
  },
];

export const useBrushTool = (): UseBrushToolReturn => {
  const { brush, setBrushType, setBrushSize, setBrushOpacity, setBrushColor, setBrushHardness } =
    useColoringStore();

  // 브러시 설정 검증 함수들
  const validateBrushSize = useCallback((size: number): number => {
    return Math.max(BRUSH_LIMITS.size.min, Math.min(BRUSH_LIMITS.size.max, size));
  }, []);

  const validateBrushOpacity = useCallback((opacity: number): number => {
    return Math.max(BRUSH_LIMITS.opacity.min, Math.min(BRUSH_LIMITS.opacity.max, opacity));
  }, []);

  const validateBrushHardness = useCallback((hardness: number): number => {
    return Math.max(BRUSH_LIMITS.hardness.min, Math.min(BRUSH_LIMITS.hardness.max, hardness));
  }, []);

  // 검증된 브러시 설정 변경 함수들
  const setValidatedBrushSize = useCallback(
    (size: number) => {
      const validatedSize = validateBrushSize(size);
      setBrushSize(validatedSize);
    },
    [validateBrushSize, setBrushSize],
  );

  const setValidatedBrushOpacity = useCallback(
    (opacity: number) => {
      const validatedOpacity = validateBrushOpacity(opacity);
      setBrushOpacity(validatedOpacity);
    },
    [validateBrushOpacity, setBrushOpacity],
  );

  const setValidatedBrushHardness = useCallback(
    (hardness: number) => {
      const validatedHardness = validateBrushHardness(hardness);
      setBrushHardness(validatedHardness);
    },
    [validateBrushHardness, setBrushHardness],
  );

  // 브러시 프리셋 적용
  const applyPreset = useCallback(
    (presetId: string) => {
      const preset = DEFAULT_BRUSH_PRESETS.find(p => p.id === presetId);
      if (preset) {
        setBrushType(preset.settings.type);
        setValidatedBrushSize(preset.settings.size);
        setValidatedBrushOpacity(preset.settings.opacity);
        setBrushColor(preset.settings.color);
        setValidatedBrushHardness(preset.settings.hardness);
      }
    },
    [
      setBrushType,
      setValidatedBrushSize,
      setValidatedBrushOpacity,
      setBrushColor,
      setValidatedBrushHardness,
    ],
  );

  // 커스텀 프리셋 생성 (로컬 스토리지에 저장)
  const createPreset = useCallback((name: string, settings: BrushSettings) => {
    const newPreset: BrushPreset = {
      id: `custom_${Date.now()}`,
      name,
      settings,
      category: 'basic',
    };

    // 로컬 스토리지에 저장 (추후 구현)
    console.log('새 프리셋 생성:', newPreset);
  }, []);

  // 브러시 설정 초기화
  const resetToDefault = useCallback(() => {
    const defaultPreset = DEFAULT_BRUSH_PRESETS.find(p => p.id === 'pen_medium');
    if (defaultPreset) {
      applyPreset(defaultPreset.id);
    }
  }, [applyPreset]);

  // 브러시 설정 복사/붙여넣기
  const copyBrushSettings = useCallback((): BrushSettings => {
    return { ...brush };
  }, [brush]);

  const pasteBrushSettings = useCallback(
    (settings: BrushSettings) => {
      setBrushType(settings.type);
      setValidatedBrushSize(settings.size);
      setValidatedBrushOpacity(settings.opacity);
      setBrushColor(settings.color);
      setValidatedBrushHardness(settings.hardness);
    },
    [
      setBrushType,
      setValidatedBrushSize,
      setValidatedBrushOpacity,
      setBrushColor,
      setValidatedBrushHardness,
    ],
  );

  // 브러시 정보 계산
  const brushInfo = useMemo(() => {
    const isEraser = brush.type === 'eraser';
    const isBucket = brush.type === 'bucket';
    const canDraw = brush.type === 'pen' || brush.type === 'brush' || brush.type === 'eraser';

    const displayNames: Record<BrushType, string> = {
      pen: '펜',
      brush: '브러시',
      eraser: '지우개',
      bucket: '양동이',
    };

    return {
      isEraser,
      isBucket,
      canDraw,
      displayName: displayNames[brush.type],
    };
  }, [brush.type]);

  return {
    brush,
    setBrushType,
    setBrushSize: setValidatedBrushSize,
    setBrushOpacity: setValidatedBrushOpacity,
    setBrushColor,
    setBrushHardness: setValidatedBrushHardness,
    validateBrushSize,
    validateBrushOpacity,
    validateBrushHardness,
    presets: DEFAULT_BRUSH_PRESETS,
    applyPreset,
    createPreset,
    resetToDefault,
    copyBrushSettings,
    pasteBrushSettings,
    brushInfo,
  };
};
