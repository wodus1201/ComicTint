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
          <LayersIcon size={16} color={isActive ? 'dimgray' : 'white'} />
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
              <EyeIcon size={18} color={isActive ? 'dimgray' : 'white'} />
            ) : (
              <EyeOffIcon size={18} color={isActive ? 'dimgray' : 'white'} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => reorderLayers(index, Math.max(0, index - 1))}
            style={styles.iconButton}
            disabled={index === 0}
          >
            <ChevronUpIcon size={18} color={isActive ? 'dimgray' : 'white'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => reorderLayers(index, Math.min(layers.items.length - 1, index + 1))}
            style={styles.iconButton}
            disabled={index === layers.items.length - 1}
          >
            <ChevronDownIcon size={18} color={isActive ? 'dimgray' : 'white'} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteLayer(item.id)} style={styles.iconButton}>
            <Trash2Icon size={18} color={isActive ? 'dimgray' : 'white'} />
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
          <PlusIcon size={16} color={'dimgray'} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={layers.items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        style={{ flexGrow: 0 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'dimgray',
  },
  compact: {
    paddingHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  listContent: {
    paddingBottom: 10,
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 6,
    borderRadius: 10,
  },
  activeLayerRow: {
    backgroundColor: 'lightgray',
  },
  layerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  layerName: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  activeLayerName: {
    color: 'dimgray',
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
