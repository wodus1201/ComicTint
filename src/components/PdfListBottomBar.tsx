import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/PdfListBottomBar.style';

type Props = {
  editMode: boolean;
  allSelected: boolean;
  onPick: () => void;
  onOpenRecent: () => void;
  onToggleEdit: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkShare: () => void;
  onBulkDelete: () => void;
};

export default function PdfListBottomBar({
  editMode,
  onPick,
  onOpenRecent,
  onToggleEdit,
  onSelectAll,
  onClearSelection,
  onBulkShare,
  onBulkDelete,
  allSelected,
}: Props) {
  return (
    <View style={styles.bottomContainer}>
      {editMode ? (
        <View key='edit-mode' style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={allSelected ? onClearSelection : onSelectAll}
          >
            <Text style={styles.buttonText}>{allSelected ? '모두 해제' : '모두 선택'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onBulkShare}>
            <Text style={styles.buttonText}>공유</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onBulkDelete}>
            <Text style={styles.buttonText}>삭제</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onToggleEdit}>
            <Text style={styles.buttonText}>완료</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View key='normal-mode' style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.button} onPress={onPick}>
            <Text style={[styles.buttonText, { paddingRight: 20 }]}>PDF 가져오기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onOpenRecent}>
            <Text style={styles.buttonText}>최근 파일</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { paddingRight: 15 }]} onPress={onToggleEdit}>
            <Text style={styles.buttonText}>목록 수정</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
