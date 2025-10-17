import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  Modal,
  Dimensions,
} from 'react-native';
import { styles } from '../styles/PdfListMenu.style';

type Props = {
  visible: boolean;
  top: number;
  left: number;
  onClose: () => void;
  onFileInfo: () => void;
  onToggleFavorite: () => void;
  onRename: () => void;
  onDelete: () => void;
  onShare: () => void;
  isFavorite?: boolean;
  containerStyle?: ViewStyle;
};

export default function PdfListMenu({
  visible,
  top,
  left,
  onClose,
  onFileInfo,
  onToggleFavorite,
  onRename,
  onDelete,
  onShare,
  isFavorite = false,
  containerStyle,
}: Props) {
  const { width, height } = Dimensions.get('screen');

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.fullOverlay, { width, height }]}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.menuContainer,
                { position: 'absolute', top: top - 30, left },
                containerStyle,
              ]}
            >
              <TouchableOpacity style={styles.menuItem} onPress={onFileInfo}>
                <Text style={styles.menuItemText}>파일 정보</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={onToggleFavorite}>
                <Text style={styles.menuItemText}>{isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}</Text>
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
    </Modal>
  );
}
