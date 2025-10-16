import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/PdfListScreen.styles';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SortMenu({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.menuContainer}>
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
      </View>
    </Modal>
  );
}
