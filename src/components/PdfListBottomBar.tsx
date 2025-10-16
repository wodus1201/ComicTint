import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
        <>
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
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={onPick}>
            <Text style={styles.buttonText}>기기에서 PDF 선택</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onOpenRecent}>
            <Text style={styles.buttonText}>최근 열었던 파일</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onToggleEdit}>
            <Text style={styles.buttonText}>목록 수정</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'skyblue',
    paddingHorizontal: 35,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
