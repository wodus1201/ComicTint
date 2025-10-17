import {
  Modal,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { styles } from '../styles/RenameModal.style';

type Props = {
  visible: boolean;
  value: string;
  onChangeText: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function RenameModal({ visible, value, onChangeText, onCancel, onConfirm }: Props) {
  if (!visible) return null;
  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onCancel}
      statusBarTranslucent={true}
    >
      <StatusBar backgroundColor='rgba(0, 0, 0, 0.5)' barStyle='light-content' translucent />
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.fullOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.renameContainer}>
              <Text style={styles.renameTitle}>이름 변경</Text>
              <TextInput
                style={styles.renameInput}
                value={value}
                onChangeText={onChangeText}
                placeholder='새 이름'
                autoFocus
              />
              <View style={styles.renameActions}>
                <TouchableOpacity style={styles.renameButton} onPress={onCancel}>
                  <Text style={styles.renameButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.renameButton} onPress={onConfirm}>
                  <Text style={[styles.renameButtonText, { color: '#2ac92a' }]}>저장</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
