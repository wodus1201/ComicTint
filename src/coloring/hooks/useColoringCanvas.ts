import { useCallback, useRef, useEffect } from 'react';
import { useColoringStore } from '../stores/coloringStore';
import { Point } from '../models/coloring';
import {
  touchToCanvasCoordinates,
  pointsToSvgPath,
  CanvasTransform,
  CanvasBounds,
  ZoomLimits,
  PanLimits,
  clampZoomScale,
  clampPanOffset,
  zoomAtPoint,
  getDefaultZoomLimits,
  getDefaultPanLimits,
} from '../utils/canvasUtils';

interface UseColoringCanvasProps {
  width: number;
  height: number;
}

interface UseColoringCanvasReturn {
  canvas: {
    width: number;
    height: number;
    scale: number;
    offset: { x: number; y: number };
    isDrawing: boolean;
  };

  handleTouchStart: (event: any) => void;
  handleTouchMove: (event: any) => void;
  handleTouchEnd: () => void;

  convertToCanvasCoordinates: (x: number, y: number) => Point;
  convertToTouchCoordinates: (x: number, y: number) => { x: number; y: number };

  zoomIn: (centerX?: number, centerY?: number) => void;
  zoomOut: (centerX?: number, centerY?: number) => void;
  zoomToFit: () => void;
  zoomToActualSize: () => void;
  panTo: (x: number, y: number) => void;
  resetView: () => void;

  isDrawing: boolean;
  canDraw: boolean;

  strokeToPath: (points: Point[]) => string;

  setCanvasSize: (width: number, height: number) => void;
  setCanvasScale: (scale: number) => void;
  setCanvasOffset: (offset: { x: number; y: number }) => void;
}

export const useColoringCanvas = ({
  width,
  height,
}: UseColoringCanvasProps): UseColoringCanvasReturn => {
  const {
    canvas,
    layers,
    setCanvasSize,
    setCanvasScale,
    setCanvasOffset,
    startDrawing,
    continueDrawing,
    endDrawing,
  } = useColoringStore();

  const svgRef = useRef<any>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const zoomLimitsRef = useRef<ZoomLimits>(getDefaultZoomLimits());
  const panLimitsRef = useRef<PanLimits>(getDefaultPanLimits({ width, height }));

  useEffect(() => {
    setCanvasSize(width, height);
    panLimitsRef.current = getDefaultPanLimits({ width, height });
  }, [width, height, setCanvasSize]);

  const convertToCanvasCoordinates = useCallback(
    (x: number, y: number): Point => {
      return touchToCanvasCoordinates(x, y, {
        scale: canvas.scale,
        offset: canvas.offset,
      });
    },
    [canvas.offset, canvas.scale],
  );

  const convertToTouchCoordinates = useCallback(
    (x: number, y: number): { x: number; y: number } => {
      return {
        x: x * canvas.scale + canvas.offset.x,
        y: y * canvas.scale + canvas.offset.y,
      };
    },
    [canvas.scale, canvas.offset],
  );

  const handleTouchStart = useCallback(
    (event: any) => {
      const { locationX, locationY } = event.nativeEvent;
      const point = convertToCanvasCoordinates(locationX, locationY);
      lastTouchRef.current = { x: locationX, y: locationY };
      startDrawing(point);
    },
    [convertToCanvasCoordinates, startDrawing],
  );

  const handleTouchMove = useCallback(
    (event: any) => {
      if (!canvas.isDrawing) return;

      const { locationX, locationY } = event.nativeEvent;
      const point = convertToCanvasCoordinates(locationX, locationY);
      lastTouchRef.current = { x: locationX, y: locationY };
      continueDrawing(point);
    },
    [canvas.isDrawing, convertToCanvasCoordinates, continueDrawing],
  );

  const handleTouchEnd = useCallback(() => {
    lastTouchRef.current = null;
    endDrawing();
  }, [endDrawing]);

  const zoomIn = useCallback(
    (centerX?: number, centerY?: number) => {
      const newScale = canvas.scale * 1.2;
      const centerPointX = centerX ?? canvas.width / 2;
      const centerPointY = centerY ?? canvas.height / 2;

      const result = zoomAtPoint(
        canvas.scale,
        newScale,
        centerPointX,
        centerPointY,
        { width: canvas.width, height: canvas.height },
        zoomLimitsRef.current,
      );

      setCanvasScale(result.scale);
      setCanvasOffset(result.offset);
    },
    [canvas.scale, canvas.width, canvas.height, canvas.offset, setCanvasScale, setCanvasOffset],
  );

  const zoomOut = useCallback(
    (centerX?: number, centerY?: number) => {
      const newScale = canvas.scale / 1.2;
      const centerPointX = centerX ?? canvas.width / 2;
      const centerPointY = centerY ?? canvas.height / 2;

      const result = zoomAtPoint(
        canvas.scale,
        newScale,
        centerPointX,
        centerPointY,
        { width: canvas.width, height: canvas.height },
        zoomLimitsRef.current,
      );

      setCanvasScale(result.scale);
      setCanvasOffset(result.offset);
    },
    [canvas.scale, canvas.width, canvas.height, canvas.offset, setCanvasScale, setCanvasOffset],
  );

  const zoomToFit = useCallback(() => {
    const scaleX = canvas.width / canvas.width;
    const scaleY = canvas.height / canvas.height;
    const scale = Math.min(scaleX, scaleY, zoomLimitsRef.current.maxScale);

    const clampedScale = clampZoomScale(scale, zoomLimitsRef.current);
    const offsetX = (canvas.width - canvas.width * clampedScale) / 2;
    const offsetY = (canvas.height - canvas.height * clampedScale) / 2;

    setCanvasScale(clampedScale);
    setCanvasOffset({ x: offsetX, y: offsetY });
  }, [canvas.width, canvas.height, setCanvasScale, setCanvasOffset]);

  const zoomToActualSize = useCallback(() => {
    setCanvasScale(1);
    setCanvasOffset({ x: 0, y: 0 });
  }, [setCanvasScale, setCanvasOffset]);

  const panTo = useCallback(
    (x: number, y: number) => {
      const clampedOffset = clampPanOffset(
        { x, y },
        { width: canvas.width, height: canvas.height },
        canvas.scale,
        panLimitsRef.current,
      );
      setCanvasOffset(clampedOffset);
    },
    [canvas.width, canvas.height, canvas.scale, setCanvasOffset],
  );

  const resetView = useCallback(() => {
    setCanvasScale(1);
    setCanvasOffset({ x: 0, y: 0 });
  }, [setCanvasScale, setCanvasOffset]);

  const isDrawing = canvas.isDrawing;
  const canDraw =
    layers.activeLayerId !== '' && layers.items.some(layer => layer.id === layers.activeLayerId);

  const strokeToPath = useCallback((points: Point[]): string => {
    return pointsToSvgPath(points, true, 0.3);
  }, []);

  return {
    canvas,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    convertToCanvasCoordinates,
    convertToTouchCoordinates,
    zoomIn,
    zoomOut,
    zoomToFit,
    zoomToActualSize,
    panTo,
    resetView,
    isDrawing,
    canDraw,
    strokeToPath,
    setCanvasSize,
    setCanvasScale,
    setCanvasOffset,
  };
};
