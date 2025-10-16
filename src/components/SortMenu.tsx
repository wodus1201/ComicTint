import { Pressable, View, TouchableOpacity, Text, Modal } from 'react-native';
import { styles } from '../styles/PdfListScreen.styles';

type Props = {
  visible: boolean;
  onClose: () => void;
  top: number;
  left: number;
};

export default function SortMenu({ visible, onClose, top, left }: Props) {
  if (!visible) return null;
  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <Pressable onPress={onClose} style={styles.popoverOverlay}>
        <View style={[styles.popoverMenuContainer, { top: top - 10, left: left - 10 }]}>
          <TouchableOpacity
            accessibilityLabel='추가순'
            testID='sort-addedDesc'
            style={styles.menuItem}
            onPress={onClose}
          >
            <Text style={styles.menuItemText}>추가순</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel='크기순'
            testID='sort-sizeDesc'
            style={styles.menuItem}
            onPress={onClose}
          >
            <Text style={styles.menuItemText}>크기순</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel='이름순'
            testID='sort-nameAsc'
            style={styles.menuItem}
            onPress={onClose}
          >
            <Text style={styles.menuItemText}>이름순</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel='열어본순'
            testID='sort-recentOpenedDesc'
            style={styles.menuItem}
            onPress={onClose}
          >
            <Text style={styles.menuItemText}>열어본순</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}
