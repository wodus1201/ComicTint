import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import {
  EyeIcon,
  EyeOffIcon,
  PlusIcon,
  Trash2Icon,
  ChevronUpIcon,
  ChevronDownIcon,
  LayersIcon,
} from 'lucide-react-native';
import { useColoringStore } from '../stores/coloringStore';

interface LayerPanelProps {
  compact?: boolean;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({ compact = false }) => {
  const { layers, addLayer, deleteLayer, selectLayer, toggleLayerVisibility, reorderLayers } =
    useColoringStore();

  const renderItem = ({ item, index }: any) => {
    const isActive = layers.activeLayerId === item.id;

    return (
      <TouchableOpacity
        onPress={() => selectLayer(item.id)}
        style={[styles.layerRow, isActive && styles.activeLayerRow]}
      >
        <View style={styles.layerInfo}>
          <LayersIcon size={16} color={isActive ? '#007AFF' : '#666666'} />
          <Text numberOfLines={1} style={[styles.layerName, isActive && styles.activeLayerName]}>
            {item.name}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => toggleLayerVisibility(item.id)}
            style={styles.iconButton}
          >
            {item.visible ? (
              <EyeIcon size={18} color={'#444444'} />
            ) : (
              <EyeOffIcon size={18} color={'#999999'} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => reorderLayers(index, Math.max(0, index - 1))}
            style={styles.iconButton}
            disabled={index === 0}
          >
            <ChevronUpIcon size={18} color={index === 0 ? '#cccccc' : '#444444'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => reorderLayers(index, Math.min(layers.items.length - 1, index + 1))}
            style={styles.iconButton}
            disabled={index === layers.items.length - 1}
          >
            <ChevronDownIcon
              size={18}
              color={index === layers.items.length - 1 ? '#cccccc' : '#444444'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteLayer(item.id)} style={styles.iconButton}>
            <Trash2Icon size={18} color={'#C0392B'} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, compact && styles.compact]}>
      <View style={styles.header}>
        <Text style={styles.title}>레이어</Text>
        <TouchableOpacity
          onPress={() => addLayer()}
          style={styles.addButton}
          accessibilityLabel='add-layer'
        >
          <PlusIcon size={16} color={'#ffffff'} />
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={layers.items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        style={{ flexGrow: 0 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  compact: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  listContent: {
    paddingBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#e9ecef',
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  activeLayerRow: {
    backgroundColor: '#e3f2fd',
  },
  layerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  layerName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444444',
  },
  activeLayerName: {
    color: '#007AFF',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  iconButton: {
    padding: 6,
    borderRadius: 6,
  },
});
