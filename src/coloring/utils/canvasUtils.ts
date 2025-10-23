import { Point } from '../models/coloring';

export interface CanvasTransform {
  scale: number;
  offset: { x: number; y: number };
}

export interface CanvasBounds {
  width: number;
  height: number;
}

export interface ZoomLimits {
  minScale: number;
  maxScale: number;
}

export interface PanLimits {
  minOffsetX: number;
  maxOffsetX: number;
  minOffsetY: number;
  maxOffsetY: number;
}

export const touchToCanvasCoordinates = (
  touchX: number,
  touchY: number,
  transform: CanvasTransform,
): Point => {
  return {
    x: (touchX - transform.offset.x) / transform.scale,
    y: (touchY - transform.offset.y) / transform.scale,
    timestamp: Date.now(),
  };
};

export const canvasToTouchCoordinates = (
  canvasX: number,
  canvasY: number,
  transform: CanvasTransform,
): { x: number; y: number } => {
  return {
    x: canvasX * transform.scale + transform.offset.x,
    y: canvasY * transform.scale + transform.offset.y,
  };
};

export const smoothStroke = (points: Point[], smoothingFactor: number = 0.3): Point[] => {
  if (points.length < 3) return points;

  const smoothed: Point[] = [points[0]];

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const current = points[i];
    const next = points[i + 1];

    const smoothedX = current.x * (1 - smoothingFactor) + (prev.x + next.x) * (smoothingFactor / 2);
    const smoothedY = current.y * (1 - smoothingFactor) + (prev.y + next.y) * (smoothingFactor / 2);

    smoothed.push({
      x: smoothedX,
      y: smoothedY,
      pressure: current.pressure,
      timestamp: current.timestamp,
    });
  }

  smoothed.push(points[points.length - 1]);
  return smoothed;
};

export const pointsToSvgPath = (
  points: Point[],
  useSmoothing: boolean = true,
  smoothingFactor: number = 0.3,
): string => {
  if (points.length === 0) return '';

  const processedPoints = useSmoothing ? smoothStroke(points, smoothingFactor) : points;

  let path = `M ${processedPoints[0].x} ${processedPoints[0].y}`;

  for (let i = 1; i < processedPoints.length; i++) {
    path += ` L ${processedPoints[i].x} ${processedPoints[i].y}`;
  }

  return path;
};

export const clampZoomScale = (scale: number, limits: ZoomLimits): number => {
  return Math.max(limits.minScale, Math.min(limits.maxScale, scale));
};

export const clampPanOffset = (
  offset: { x: number; y: number },
  bounds: CanvasBounds,
  scale: number,
  limits?: PanLimits,
): { x: number; y: number } => {
  const scaledWidth = bounds.width * scale;
  const scaledHeight = bounds.height * scale;

  let minX = bounds.width - scaledWidth;
  let maxX = 0;
  let minY = bounds.height - scaledHeight;
  let maxY = 0;

  if (limits) {
    minX = Math.max(minX, limits.minOffsetX);
    maxX = Math.min(maxX, limits.maxOffsetX);
    minY = Math.max(minY, limits.minOffsetY);
    maxY = Math.min(maxY, limits.maxOffsetY);
  }

  return {
    x: Math.max(minX, Math.min(maxX, offset.x)),
    y: Math.max(minY, Math.min(maxY, offset.y)),
  };
};

export const zoomAtPoint = (
  currentScale: number,
  newScale: number,
  centerX: number,
  centerY: number,
  bounds: CanvasBounds,
  limits: ZoomLimits,
): { scale: number; offset: { x: number; y: number } } => {
  const clampedScale = clampZoomScale(newScale, limits);
  const scaleRatio = clampedScale / currentScale;

  const newOffsetX = centerX - (centerX - bounds.width / 2) * scaleRatio;
  const newOffsetY = centerY - (centerY - bounds.height / 2) * scaleRatio;

  return {
    scale: clampedScale,
    offset: { x: newOffsetX, y: newOffsetY },
  };
};

export const calculateDistance = (
  point1: { x: number; y: number },
  point2: { x: number; y: number },
): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const findNearestPoint = (
  points: Point[],
  target: { x: number; y: number },
  threshold: number = 10,
): number => {
  let nearestIndex = -1;
  let minDistance = threshold;

  for (let i = 0; i < points.length; i++) {
    const distance = calculateDistance(points[i], target);
    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = i;
    }
  }

  return nearestIndex;
};

export const isPointInBounds = (
  point: { x: number; y: number },
  bounds: CanvasBounds,
  margin: number = 0,
): boolean => {
  return (
    point.x >= -margin &&
    point.x <= bounds.width + margin &&
    point.y >= -margin &&
    point.y <= bounds.height + margin
  );
};

export const getDefaultZoomLimits = (): ZoomLimits => ({
  minScale: 0.1,
  maxScale: 5.0,
});

export const getDefaultPanLimits = (bounds: CanvasBounds): PanLimits => ({
  minOffsetX: -bounds.width * 2,
  maxOffsetX: bounds.width * 2,
  minOffsetY: -bounds.height * 2,
  maxOffsetY: bounds.height * 2,
});
