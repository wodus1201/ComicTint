import { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useColoringStore } from '../stores/coloringStore';
import { getDefaultColorPalettes, getContrastingColor } from '../utils/colorUtils';

interface ColorPaletteProps {
  onColorSelect?: (color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ onColorSelect }) => {
  const { brush, setBrushColor } = useColoringStore();
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<string>('기본 색상');

  const defaultPalettes = getDefaultColorPalettes();
  const currentPalette = defaultPalettes.find(p => p.name === selectedPalette);
  const allColors = currentPalette ? [...currentPalette.colors, ...customColors] : [];

  const handleColorSelect = (color: string) => {
    setBrushColor(color);
    onColorSelect?.(color);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>색상 팔레트</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.paletteSelector}
        contentContainerStyle={styles.paletteSelectorContent}
      >
        {defaultPalettes.map(palette => (
          <TouchableOpacity
            key={palette.name}
            style={[
              styles.paletteButton,
              selectedPalette === palette.name && styles.selectedPaletteButton,
            ]}
            onPress={() => setSelectedPalette(palette.name)}
          >
            <Text
              style={[
                styles.paletteButtonText,
                selectedPalette === palette.name && styles.selectedPaletteButtonText,
              ]}
            >
              {palette.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.colorGrid}>
          {allColors.map((color, index) => {
            const isSelected = brush.color === color;
            const contrastingColor = getContrastingColor(color);
            return (
              <TouchableOpacity
                key={`${color}-${index}`}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  isSelected && styles.selectedColorButton,
                ]}
                onPress={() => handleColorSelect(color)}
              >
                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Text style={[styles.checkmark, { color: contrastingColor }]}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.currentColorContainer}>
        <Text style={styles.currentColorLabel}>현재 색상:</Text>
        <View style={styles.currentColorDisplay}>
          <View style={[styles.currentColorBox, { backgroundColor: brush.color }]} />
          <Text style={styles.currentColorText}>{brush.color}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  paletteSelector: {
    marginBottom: 12,
  },
  paletteSelectorContent: {
    paddingHorizontal: 4,
  },
  paletteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  selectedPaletteButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  paletteButtonText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  selectedPaletteButtonText: {
    color: '#ffffff',
  },
  scrollContainer: {
    paddingHorizontal: 4,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
    borderWidth: 2,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorButton: {
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentColorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  currentColorLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 12,
  },
  currentColorDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentColorBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginRight: 8,
  },
  currentColorText: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'monospace',
  },
});
