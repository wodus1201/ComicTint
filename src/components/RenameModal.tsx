import { Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
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
              <TouchableOpacity style={styles.renameButtonPrimary} onPress={onConfirm}>
                <Text style={styles.renameButtonPrimaryText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}
