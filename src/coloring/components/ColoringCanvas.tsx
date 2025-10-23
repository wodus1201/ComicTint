import { useCallback, useRef, useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Defs, ClipPath, Rect, Image, G } from 'react-native-svg';
import { useColoringStore } from '../stores/coloringStore';
import { Point } from '../models/coloring';
import {
  touchToCanvasCoordinates,
  pointsToSvgPath,
  getDefaultZoomLimits,
  getDefaultPanLimits,
} from '../utils/canvasUtils';

interface ColoringCanvasProps {
  width: number;
  height: number;
  pdfImageUri?: string;
}

export const ColoringCanvas: React.FC<ColoringCanvasProps> = ({ width, height, pdfImageUri }) => {
  const { canvas, layers, setCanvasSize, startDrawing, continueDrawing, endDrawing } =
    useColoringStore();

  const svgRef = useRef<Svg>(null);

  useEffect(() => {
    setCanvasSize(width, height);
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

  const handleTouchStart = useCallback(
    (event: any) => {
      const { locationX, locationY } = event.nativeEvent;
      const point = convertToCanvasCoordinates(locationX, locationY);
      startDrawing(point);
    },
    [convertToCanvasCoordinates, startDrawing],
  );

  const handleTouchMove = useCallback(
    (event: any) => {
      if (!canvas.isDrawing) return;

      const { locationX, locationY } = event.nativeEvent;
      const point = convertToCanvasCoordinates(locationX, locationY);
      continueDrawing(point);
    },
    [canvas.isDrawing, convertToCanvasCoordinates, continueDrawing],
  );

  const handleTouchEnd = useCallback(() => {
    endDrawing();
  }, [endDrawing]);

  const strokeToPath = useCallback((points: Point[]): string => {
    return pointsToSvgPath(points, true, 0.3);
  }, []);

  const renderLayers = useCallback(() => {
    return layers.items.map(layer => {
      if (!layer.visible) return null;

      return (
        <G key={layer.id} opacity={layer.opacity}>
          {layer.strokes.map(stroke => {
            const path = strokeToPath(stroke.points);

            return (
              <Path
                key={stroke.id}
                d={path}
                stroke={stroke.brush.color}
                strokeWidth={stroke.brush.size}
                strokeOpacity={stroke.brush.opacity}
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            );
          })}
        </G>
      );
    });
  }, [layers.items, strokeToPath]);

  return (
    <View style={{ width, height, backgroundColor: '#ffffff' }}>
      <Svg
        ref={svgRef}
        width={width}
        height={height}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ flex: 1 }}
      >
        <Defs>
          <ClipPath id='canvasClip'>
            <Rect x={0} y={0} width={width} height={height} />
          </ClipPath>
        </Defs>

        {pdfImageUri && (
          <Image
            href={pdfImageUri}
            x={0}
            y={0}
            width={width}
            height={height}
            clipPath='url(#canvasClip)'
          />
        )}

        <G clipPath='url(#canvasClip)'>{renderLayers()}</G>
      </Svg>
    </View>
  );
};
