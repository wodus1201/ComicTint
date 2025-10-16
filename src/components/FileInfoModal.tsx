import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Modal,
  StatusBar,
  Dimensions,
} from 'react-native';
import { XIcon } from 'lucide-react-native';
import { StoredPdf } from '../models/pdf';
import { formatFileSize, formatDate } from '../utils/timeFormat';

type Props = {
  visible: boolean;
  file: StoredPdf | null;
  onClose: () => void;
};

export default function FileInfoModal({ visible, file, onClose }: Props) {
  const { width, height } = Dimensions.get('screen');

  if (!file) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar backgroundColor='rgba(0, 0, 0, 0.5)' barStyle='light-content' translucent />
      <View style={[styles.overlay, { width, height }]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlayTouchable} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <View style={styles.popover}>
            <View style={styles.header}>
              <Text style={styles.title}>파일 정보</Text>
              <TouchableOpacity onPress={onClose}>
                <XIcon size={24} color='#666' />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>파일명</Text>
                <Text style={styles.value}>{file.name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>파일 크기</Text>
                <Text style={styles.value}>{formatFileSize(file.size)}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>추가된 날짜</Text>
                <Text style={styles.value}>{formatDate(file.createdAt)}</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  popover: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  value: {
    flex: 2,
    textAlign: 'right',
    fontSize: 14,
    color: '#333',
  },
});
