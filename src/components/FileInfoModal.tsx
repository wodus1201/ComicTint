import React from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Modal,
  StatusBar,
  Dimensions,
} from 'react-native';
import { styles } from '../styles/FileInfoModal.style';
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
