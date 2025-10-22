import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Undo2Icon, Redo2Icon, HistoryIcon } from 'lucide-react-native';
import { useColoringStore } from '../stores/coloringStore';

interface HistoryControlsProps {
  compact?: boolean;
}

export const HistoryControls: React.FC<HistoryControlsProps> = ({ compact = false }) => {
  const { history, undo, redo } = useColoringStore();

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const presentLabel = history.present?.type ? history.present.type : '없음';

  return (
    <View style={[styles.container, compact && styles.compact]}>
      <View style={styles.leftGroup}>
        <HistoryIcon size={18} color={'#666666'} />
        <Text style={styles.title}>히스토리</Text>
        <Text style={styles.stateText}>
          과거 {history.past.length} · 현재 {presentLabel} · 미래 {history.future.length}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={undo}
          disabled={!canUndo}
          style={[styles.iconButton, !canUndo && styles.iconButtonDisabled]}
          accessibilityLabel='undo-button'
        >
          <Undo2Icon size={18} color={canUndo ? '#444444' : '#cccccc'} />
          <Text style={[styles.actionLabel, !canUndo && styles.actionLabelDisabled]}>되돌리기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={redo}
          disabled={!canRedo}
          style={[styles.iconButton, !canRedo && styles.iconButtonDisabled]}
          accessibilityLabel='redo-button'
        >
          <Redo2Icon size={18} color={canRedo ? '#444444' : '#cccccc'} />
          <Text style={[styles.actionLabel, !canRedo && styles.actionLabelDisabled]}>다시하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compact: {
    paddingVertical: 8,
    paddingHorizontal: 10,
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
    color: '#333333',
  },
  stateText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666666',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginLeft: 8,
  },
  iconButtonDisabled: {
    backgroundColor: '#f1f3f5',
  },
  actionLabel: {
    marginLeft: 6,
    fontSize: 12,
    color: '#444444',
    fontWeight: '600',
  },
  actionLabelDisabled: {
    color: '#999999',
  },
});
