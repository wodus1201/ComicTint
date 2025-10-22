import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Undo2Icon, Redo2Icon } from 'lucide-react-native';
import { useColoringStore } from '../stores/coloringStore';

interface HistoryControlsProps {
  compact?: boolean;
}

export const HistoryControls: React.FC<HistoryControlsProps> = ({ compact = false }) => {
  const { history, undo, redo } = useColoringStore();

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return (
    <View style={[styles.container, compact && styles.compact]}>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={undo}
          disabled={!canUndo}
          style={[styles.iconButton, !canUndo && styles.iconButtonDisabled]}
          accessibilityLabel='undo-button'
        >
          <Undo2Icon size={18} color={canUndo ? 'dimgray' : 'white'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={redo}
          disabled={!canRedo}
          style={[styles.iconButton, !canRedo && styles.iconButtonDisabled]}
          accessibilityLabel='redo-button'
        >
          <Redo2Icon size={18} color={canRedo ? 'dimgray' : 'white'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'dimgray',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compact: {
    paddingHorizontal: 14,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  title: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  stateText: {
    marginLeft: 8,
    fontSize: 12,
    color: 'white',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-end',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    marginLeft: 8,
  },
  iconButtonDisabled: {
    backgroundColor: 'darkgray',
  },
  actionLabel: {
    marginLeft: 6,
    fontSize: 12,
    color: 'dimgray',
    fontWeight: '600',
  },
  actionLabelDisabled: {
    color: 'white',
  },
});
