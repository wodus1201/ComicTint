import { Alert, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import DocumentPicker, { types } from 'react-native-document-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useEffect, useState } from 'react';
import { MoreHorizontalIcon } from 'lucide-react-native';
import { appendPdfIndex, readPdfIndex, removePdfWithTransaction } from '../storage/pdfIndex';
import { generateId, toSafeFileName } from '../utils/files';
import { copyContentUriToDocumentDir } from '../utils/fileCopy';
import { StoredPdf } from '../models/pdf';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfList'>;

export default function PdfListScreen({ navigation }: Props) {
  const safeAreaInsets = useSafeAreaInsets();
  const [items, setItems] = useState<Array<{ id: string; name: string; uri?: string }>>([]);
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; uri?: string } | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await readPdfIndex();
      setItems(stored.map((s) => ({ id: s.id, name: s.name, uri: s.path })));
    })();
  }, []);

  const handlePick = async () => {
    try {
      const res = await DocumentPicker.pickSingle({ type: types.pdf });
      const pickedUri = res.uri;
      console.log('DocumentPicker result:', { uri: res.uri, fileCopyUri: res.fileCopyUri, name: res.name });
      console.log('Using URI:', pickedUri);
      const name = res.name ?? 'imported.pdf';
      Alert.alert(
        '가져오기',
        `${name} 파일을 어떻게 할까요?`,
        [
          {
            text: '목록에 추가하기',
            onPress: async () => {
              try {
                const id = generateId();
                const safe = toSafeFileName(name);
                const { destPath, size } = await copyContentUriToDocumentDir({ id, safeFileName: safe, contentUri: pickedUri });
                const now = Date.now();
                const record: StoredPdf = { id, name, path: destPath, size, createdAt: now };
                await appendPdfIndex(record);
                setItems((prev) => [{ id, name, uri: destPath }, ...prev]);
                Alert.alert('성공', 'PDF 파일이 목록에 추가되었습니다.');
              } catch (err: any) {
                console.warn('import error', err);
                Alert.alert(
                  '가져오기 실패',
                  `파일을 가져오는 중 오류가 발생했습니다.\n\n오류: ${err.message || '알 수 없는 오류'}\n\n다시 시도하시겠습니까?`,
                  [
                    { text: '다시 시도', onPress: () => handlePick() },
                    { text: '취소', style: 'cancel' }
                  ]
                );
              }
            },
          },
          {
            text: '미리보기',
            onPress: () => navigation.navigate('PdfViewer', { uri: pickedUri }),
          },
          {
            text: '취소하기',
            style: 'cancel',
          },
        ]
      );
    } catch (e: any) {
      if (DocumentPicker.isCancel(e)) return;
      console.warn('Document pick error', e);
      Alert.alert(
        '파일 선택 오류',
        '파일을 선택하는 중 오류가 발생했습니다. 다시 시도해주세요.',
        [{ text: '확인' }]
      );
    }
  };

  const handleMorePress = (item: { id: string; name: string; uri?: string }) => {
    setSelectedItem(item);
    setMenuVisible(true);
  };

  const handleDelete = (item: { id: string; name: string; uri?: string }) => {
    if (!item.uri) {
      Alert.alert('오류', '파일 경로를 찾을 수 없습니다.');
      return;
    }

    Alert.alert(
      '파일 삭제',
      `"${item.name}" 파일을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`,
      [
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await removePdfWithTransaction(item.id, item.uri!);
              setItems((prev) => prev.filter((i) => i.id !== item.id));
              Alert.alert('삭제 완료', '파일이 성공적으로 삭제되었습니다.');
            } catch (error: any) {
              console.warn('delete error', error);
              Alert.alert(
                '삭제 실패',
                `파일을 삭제하는 중 오류가 발생했습니다.\n\n오류: ${error.message || '알 수 없는 오류'}\n\n파일이 목록에서 제거되었지만 실제 파일은 남아있을 수 있습니다.`,
                [{ text: '확인' }]
              );
            }
          },
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ]
    );
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="skyblue" barStyle="light-content" />
      <View style={{ height: safeAreaInsets.top, backgroundColor: 'skyblue' }} />
      <Text style={styles.title}>PDF 목록</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              style={styles.itemContent}
              onPress={() => {
                if (item.uri) {
                  navigation.navigate('PdfViewer', { uri: item.uri, id: item.id });
                }
              }}
            >
              <Text style={styles.itemText} numberOfLines={1} ellipsizeMode="tail">
                {item.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => handleMorePress(item)}
            >
              <MoreHorizontalIcon size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePick}>
          <Text style={styles.buttonText}>기기에서 PDF 선택</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RecentFiles')}>
          <Text style={styles.buttonText}>최근 열었던 파일</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>목록 비우기</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeMenu}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (selectedItem) {
                  closeMenu();
                  handleDelete(selectedItem);
                }
              }}
            >
              <Text style={styles.menuItemText}>삭제</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={closeMenu}
            >
              <Text style={styles.menuItemText}>취소</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: 'white',
    backgroundColor: 'skyblue',
    padding: 10,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  itemContent: {
    flex: 1,
    paddingRight: 10,
  },
  itemText: {
    fontSize: 20,
    fontWeight: '500',
  },
  moreButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'skyblue',
    paddingHorizontal: 35,
  },
});


