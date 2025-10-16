import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle, TouchableWithoutFeedback } from 'react-native';

type Item = { id: string; name: string; uri?: string };

type Props = {
  visible: boolean;
  top: number;
  left: number;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
  onShare: () => void;
  containerStyle?: ViewStyle;
};

export default function PdfListMenu({ visible, top, left, onClose, onRename, onDelete, onShare, containerStyle }: Props) {
  if (!visible) return null;
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.fullOverlay}>
        <TouchableWithoutFeedback>
          <View style={[styles.menuContainer, { position: 'absolute', top, left }, containerStyle]}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>파일 정보</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>즐겨찾기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={onRename}>
              <Text style={styles.menuItemText}>이름 변경</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={onDelete}>
              <Text style={styles.menuItemText}>삭제</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={onShare}>
              <Text style={styles.menuItemText}>공유</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  fullOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});


