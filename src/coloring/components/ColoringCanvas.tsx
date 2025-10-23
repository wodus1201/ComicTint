import { useCallback, useRef } from 'react';
import { View } from 'react-native';
import Svg, { Path, Defs, ClipPath, Rect, Image, G } from 'react-native-svg';
import { useColoringStore } from '../stores/coloringStore';
import { useColoringCanvas } from '../hooks/useColoringCanvas';

interface ColoringCanvasProps {
  width: number;
  height: number;
  pdfImageUri?: string;
}

export const ColoringCanvas: React.FC<ColoringCanvasProps> = ({ width, height, pdfImageUri }) => {
  const { layers } = useColoringStore();
  const { canvas, handleTouchStart, handleTouchMove, handleTouchEnd, strokeToPath } =
    useColoringCanvas({ width, height });

  const svgRef = useRef<Svg>(null);

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
