import { useCallback, useRef, useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Defs, ClipPath, Rect } from 'react-native-svg';
import { useColoringStore } from '../stores/coloringStore';
import { Point } from '../models/coloring';

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
      return {
        x: (x - canvas.offset.x) / canvas.scale,
        y: (y - canvas.offset.y) / canvas.scale,
        timestamp: Date.now(),
      };
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
    if (points.length === 0) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }

    return path;
  }, []);

  const renderLayers = useCallback(() => {
    return layers.items.map(layer => {
      if (!layer.visible) return null;

      return (
        <g key={layer.id} opacity={layer.opacity}>
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
        </g>
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
          <image
            href={pdfImageUri}
            x={0}
            y={0}
            width={width}
            height={height}
            clipPath='url(#canvasClip)'
          />
        )}

        <g clipPath='url(#canvasClip)'>{renderLayers()}</g>
      </Svg>
    </View>
  );
};
