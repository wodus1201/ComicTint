import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { PenIcon, BrushIcon, EraserIcon, BucketIcon } from 'lucide-react-native';
import { useColoringStore } from '../stores/coloringStore';
import { BrushType } from '../models/coloring';

interface BrushToolbarProps {
  onBrushSettingsPress?: () => void;
}

export const BrushToolbar: React.FC<BrushToolbarProps> = ({ onBrushSettingsPress }) => {
  const { brush, ui, setBrushType, setSelectedTool, toggleBrushSettings } = useColoringStore();

  const tools: { type: BrushType; icon: React.ComponentType<any>; label: string }[] = [
    { type: 'pen', icon: PenIcon, label: '펜' },
    { type: 'brush', icon: BrushIcon, label: '브러시' },
    { type: 'eraser', icon: EraserIcon, label: '지우개' },
    { type: 'bucket', icon: BucketIcon, label: '버킷' },
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
              <IconComponent size={24} color={isSelected ? '#007AFF' : '#666666'} />
              <Text style={[styles.toolLabel, isSelected && styles.selectedToolLabel]}>
                {tool.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.settingsButton} onPress={handleBrushSettingsPress}>
          <Text style={styles.settingsButtonText}>크기: {brush.size}px</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  toolButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 60,
  },
  selectedToolButton: {
    backgroundColor: '#e3f2fd',
  },
  toolLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  selectedToolLabel: {
    color: '#007AFF',
    fontWeight: '600',
  },
  settingsContainer: {
    alignItems: 'center',
  },
  settingsButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  settingsButtonText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
});
