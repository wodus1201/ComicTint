import { View, TouchableOpacity, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import { PenIcon, BrushIcon, EraserIcon, PaintBucketIcon } from 'lucide-react-native';
import { useColoringStore } from '../stores/coloringStore';
import { BrushType } from '../models/coloring';
import { useState, useRef } from 'react';

interface BrushToolbarProps {
  onBrushSettingsPress?: () => void;
}

export const BrushToolbar: React.FC<BrushToolbarProps> = ({ onBrushSettingsPress }) => {
  const { brush, ui, setBrushType, setSelectedTool, toggleBrushSettings, setBrushSize } =
    useColoringStore();
  const [isSliderActive, setIsSliderActive] = useState(false);
  const sliderWidth = 200;
  const sliderHeight = 40;
  const thumbSize = 20;

  const pan = useRef(new Animated.ValueXY()).current;

  const initialX = ((brush.size - 1) / 49) * (sliderWidth - thumbSize);
  pan.setValue({ x: initialX, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsSliderActive(true);
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        const newX = Math.max(
          0,
          Math.min(sliderWidth - thumbSize, gestureState.moveX - gestureState.x0),
        );
        pan.setValue({ x: newX, y: 0 });

        const progress = newX / (sliderWidth - thumbSize);
        const newSize = Math.round(1 + progress * 49);
        setBrushSize(newSize);
      },
      onPanResponderRelease: () => {
        setIsSliderActive(false);
        pan.flattenOffset();
      },
    }),
  ).current;

  const tools: { type: BrushType; icon: React.ComponentType<any>; label: string }[] = [
    { type: 'pen', icon: PenIcon, label: '펜' },
    { type: 'brush', icon: BrushIcon, label: '브러시' },
    { type: 'eraser', icon: EraserIcon, label: '지우개' },
    { type: 'bucket', icon: PaintBucketIcon, label: '버킷' },
  ];

  const handleToolSelect = (type: BrushType) => {
    setBrushType(type);
    setSelectedTool(type);
  };

  const handleBrushSettingsPress = () => {
    toggleBrushSettings();
    onBrushSettingsPress?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingsContainer}>
        {isSliderActive && (
          <View style={styles.sizeDisplay}>
            <Text style={styles.sizeText}>{brush.size}px</Text>
          </View>
        )}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>크기</Text>
          <View style={styles.sliderTrack}>
            <Animated.View
              style={[
                styles.sliderProgress,
                {
                  width: pan.x.interpolate({
                    inputRange: [0, sliderWidth - thumbSize],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.sliderThumb,
                {
                  transform: [
                    {
                      translateX: pan.x.interpolate({
                        inputRange: [0, sliderWidth - thumbSize],
                        outputRange: [0, sliderWidth - thumbSize],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
              ]}
              {...panResponder.panHandlers}
            />
          </View>
        </View>
      </View>
      <View style={styles.toolsContainer}>
        {tools.map(tool => {
          const IconComponent = tool.icon;
          const isSelected = brush.type === tool.type;

          return (
            <TouchableOpacity
              key={tool.type}
              style={[styles.toolButton, isSelected && styles.selectedToolButton]}
              onPress={() => handleToolSelect(tool.type)}
            >
              <IconComponent size={24} color='white' />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'dimgray',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toolButton: {
    alignItems: 'center',
    width: 100,
    paddingVertical: 8,
  },
  selectedToolButton: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  settingsContainer: {
    alignItems: 'center',
  },
  sizeDisplay: {
    position: 'absolute',
    top: 0,
    left: 100,
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  sizeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderLabel: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  sliderTrack: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 4,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    top: -8,
    left: -10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
