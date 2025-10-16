import { Pressable, View, TouchableOpacity, Text, Modal } from 'react-native';
import { styles } from '../styles/PdfListScreen.styles';
import { SortOrder } from '../models/pdf';

type Props = {
  visible: boolean;
  onClose: () => void;
  top: number;
  left: number;
  currentOrder: SortOrder;
  onSelect: (order: SortOrder) => void;
};

export default function SortMenu({ visible, onClose, top, left, currentOrder, onSelect }: Props) {
  if (!visible) return null;
  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <Pressable onPress={onClose} style={styles.popoverOverlay}>
        <View style={[styles.popoverMenuContainer, { top: top - 10, left: left - 10 }]}>
          <TouchableOpacity
            accessibilityLabel='추가순'
            testID='sort-addedDesc'
            style={styles.menuItem}
            onPress={() => {
              onSelect('addedDesc');
            }}
          >
            <Text
              style={[styles.menuItemText, currentOrder === 'addedDesc' && { color: 'skyblue' }]}
            >
              추가순
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel='크기순'
            testID='sort-sizeDesc'
            style={styles.menuItem}
            onPress={() => {
              onSelect('sizeDesc');
            }}
          >
            <Text
              style={[styles.menuItemText, currentOrder === 'sizeDesc' && { color: 'skyblue' }]}
            >
              크기순
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel='이름순'
            testID='sort-nameAsc'
            style={styles.menuItem}
            onPress={() => {
              onSelect('nameAsc');
            }}
          >
            <Text style={[styles.menuItemText, currentOrder === 'nameAsc' && { color: 'skyblue' }]}>
              이름순
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel='열어본순'
            testID='sort-recentOpenedDesc'
            style={styles.menuItem}
            onPress={() => {
              onSelect('recentOpenedDesc');
            }}
          >
            <Text
              style={[
                styles.menuItemText,
                currentOrder === 'recentOpenedDesc' && { color: 'skyblue' },
              ]}
            >
              열어본순
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}
