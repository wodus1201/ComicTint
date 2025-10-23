export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface ColorPalette {
  name: string;
  colors: string[];
  category: 'basic' | 'pastel' | 'vibrant' | 'monochrome' | 'custom';
}

export interface ColorInfo {
  hex: string;
  rgb: RGBColor;
  hsl: HSLColor;
  brightness: number;
  contrast: number;
  isDark: boolean;
}

export const hexToRgb = (hex: string): RGBColor | null => {
  const cleanHex = hex.replace('#', '');

  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  }

  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }

  return null;
};

export const rgbToHex = (rgb: RGBColor): string => {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
};

export const rgbToHsl = (rgb: RGBColor): HSLColor => {
  const { r, g, b } = rgb;
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / diff + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / diff + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

export const hslToRgb = (hsl: HSLColor): RGBColor => {
  const { h, s, l } = hsl;
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (sNorm === 0) {
    r = g = b = lNorm;
  } else {
    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;
    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

export const calculateBrightness = (color: RGBColor): number => {
  return (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
};

export const calculateContrast = (color1: RGBColor, color2: RGBColor): number => {
  const brightness1 = calculateBrightness(color1);
  const brightness2 = calculateBrightness(color2);

  const lighter = Math.max(brightness1, brightness2);
  const darker = Math.min(brightness1, brightness2);

  return (lighter + 0.05) / (darker + 0.05);
};

export const isDarkColor = (color: RGBColor): boolean => {
  return calculateBrightness(color) < 128;
};

export const getColorInfo = (hex: string): ColorInfo | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const hsl = rgbToHsl(rgb);
  const brightness = calculateBrightness(rgb);
  const contrast = calculateContrast(rgb, { r: 255, g: 255, b: 255 });

  return {
    hex,
    rgb,
    hsl,
    brightness,
    contrast,
    isDark: isDarkColor(rgb),
  };
};

export const generateColorPalette = (
  baseColor: string,
  type: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' = 'monochromatic',
  count: number = 5,
): string[] => {
  const baseRgb = hexToRgb(baseColor);
  if (!baseRgb) return [baseColor];

  const baseHsl = rgbToHsl(baseRgb);
  const colors: string[] = [baseColor];

  switch (type) {
    case 'monochromatic':
      for (let i = 1; i < count; i++) {
        const lightness = Math.max(10, Math.min(90, baseHsl.l + (i - 2) * 20));
        const newHsl = { ...baseHsl, l: lightness };
        const newRgb = hslToRgb(newHsl);
        colors.push(rgbToHex(newRgb));
      }
      break;

    case 'analogous':
      for (let i = 1; i < count; i++) {
        const hue = (baseHsl.h + i * 30) % 360;
        const newHsl = { ...baseHsl, h: hue };
        const newRgb = hslToRgb(newHsl);
        colors.push(rgbToHex(newRgb));
      }
      break;

    case 'complementary':
      for (let i = 1; i < count; i++) {
        const hue = (baseHsl.h + i * 180) % 360;
        const newHsl = { ...baseHsl, h: hue };
        const newRgb = hslToRgb(newHsl);
        colors.push(rgbToHex(newRgb));
      }
      break;

    case 'triadic':
      for (let i = 1; i < count; i++) {
        const hue = (baseHsl.h + i * 120) % 360;
        const newHsl = { ...baseHsl, h: hue };
        const newRgb = hslToRgb(newHsl);
        colors.push(rgbToHex(newRgb));
      }
      break;
  }

  return colors;
};

export const getDefaultColorPalettes = (): ColorPalette[] => [
  {
    name: '기본 색상',
    category: 'basic',
    colors: [
      '#000000',
      '#FFFFFF',
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FFFF00',
      '#FF00FF',
      '#00FFFF',
      '#FFA500',
      '#800080',
      '#FFC0CB',
      '#A52A2A',
      '#808080',
      '#000080',
      '#008000',
      '#FFD700',
      '#FF6347',
      '#40E0D0',
      '#EE82EE',
      '#90EE90',
    ],
  },
  {
    name: '파스텔 톤',
    category: 'pastel',
    colors: [
      '#FFB6C1',
      '#FFA07A',
      '#98FB98',
      '#F0E68C',
      '#DDA0DD',
      '#B0E0E6',
      '#FFE4B5',
      '#F5DEB3',
      '#FFEFD5',
      '#E6E6FA',
      '#FFF8DC',
      '#F0FFF0',
      '#FFFACD',
      '#E0FFFF',
      '#FDF5E6',
    ],
  },
  {
    name: '비브란트',
    category: 'vibrant',
    colors: [
      '#FF1744',
      '#E91E63',
      '#9C27B0',
      '#673AB7',
      '#3F51B5',
      '#2196F3',
      '#03A9F4',
      '#00BCD4',
      '#009688',
      '#4CAF50',
      '#8BC34A',
      '#CDDC39',
      '#FFEB3B',
      '#FFC107',
      '#FF9800',
    ],
  },
  {
    name: '모노크롬',
    category: 'monochrome',
    colors: [
      '#000000',
      '#1A1A1A',
      '#333333',
      '#4D4D4D',
      '#666666',
      '#808080',
      '#999999',
      '#B3B3B3',
      '#CCCCCC',
      '#E6E6E6',
      '#FFFFFF',
    ],
  },
];

export const adjustColorBrightness = (hex: string, factor: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const adjustedRgb: RGBColor = {
    r: Math.max(0, Math.min(255, rgb.r * factor)),
    g: Math.max(0, Math.min(255, rgb.g * factor)),
    b: Math.max(0, Math.min(255, rgb.b * factor)),
  };

  return rgbToHex(adjustedRgb);
};

export const adjustColorSaturation = (hex: string, factor: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb);
  const adjustedHsl: HSLColor = {
    ...hsl,
    s: Math.max(0, Math.min(100, hsl.s * factor)),
  };

  const adjustedRgb = hslToRgb(adjustedHsl);
  return rgbToHex(adjustedRgb);
};

export const blendColors = (color1: string, color2: string, ratio: number = 0.5): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return color1;

  const blendedRgb: RGBColor = {
    r: Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio),
    g: Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio),
    b: Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio),
  };

  return rgbToHex(blendedRgb);
};

export const getContrastingColor = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';

  return isDarkColor(rgb) ? '#FFFFFF' : '#000000';
};

export const isValidHexColor = (hex: string): boolean => {
  const cleanHex = hex.replace('#', '');
  return /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex);
};

export const normalizeHexColor = (hex: string): string => {
  const cleanHex = hex.replace('#', '').toUpperCase();

  if (cleanHex.length === 3) {
    return `#${cleanHex[0]}${cleanHex[0]}${cleanHex[1]}${cleanHex[1]}${cleanHex[2]}${cleanHex[2]}`;
  }

  if (cleanHex.length === 6) {
    return `#${cleanHex}`;
  }

  return '#000000';
};
