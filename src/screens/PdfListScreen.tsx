import { Alert, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View, Dimensions, TouchableWithoutFeedback, TextInput } from 'react-native';
import DocumentPicker, { types } from 'react-native-document-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useEffect, useRef, useState } from 'react';
import { MoreHorizontalIcon } from 'lucide-react-native';
import { appendPdfIndex, readPdfIndex, removePdfWithTransaction, updatePdfIndex } from '../storage/pdfIndex';
import { generateId, toSafeFileName, stripExtension } from '../utils/files';
import { copyContentUriToDocumentDir } from '../utils/fileCopy';
import { StoredPdf } from '../models/pdf';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfList'>;

export default function PdfListScreen({ navigation }: Props) {
  const safeAreaInsets = useSafeAreaInsets();
  const [items, setItems] = useState<Array<{ id: string; name: string; uri?: string }>>([]);
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; uri?: string } | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const [menuLeft, setMenuLeft] = useState(0);
  const moreBtnRefs = useRef<Record<string, any>>({});
  const [renameVisible, setRenameVisible] = useState(false);
  const [renameText, setRenameText] = useState('');

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
    const ref = moreBtnRefs.current[item.id];
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const MENU_WIDTH = 200;
    const MENU_HEIGHT = 110;

    if (!ref || !ref.measureInWindow) {
      setSelectedItem(item);
      setMenuTop(Math.max(8, screenHeight / 2 - MENU_HEIGHT / 2));
      setMenuLeft(Math.min(Math.max(screenWidth / 2 - MENU_WIDTH / 2, 8), screenWidth - MENU_WIDTH - 8));
      setMenuVisible(true);
      return;
    }

    ref.measureInWindow((x: number, y: number, width: number, height: number) => {
      const buttonRight = x + width;
      const buttonBottom = y + height;
      const buttonTop = y;
      const V_OFFSET = 25;

      const spaceBelow = screenHeight - buttonBottom;
      const showAbove = spaceBelow < MENU_HEIGHT;
      const top = showAbove ? Math.max(8, buttonTop - MENU_HEIGHT - V_OFFSET) : buttonBottom + V_OFFSET;

      let left = buttonRight - MENU_WIDTH;
      left = Math.min(Math.max(left, 8), screenWidth - MENU_WIDTH - 8);

      setSelectedItem(item);
      setMenuTop(top);
      setMenuLeft(left);
      setMenuVisible(true);
    });
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
          text: '이름 변경',
        },
      ]
    );
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedItem(null);
  };

  const openRename = () => {
    if (!selectedItem) return;
    setRenameText(selectedItem.name);
    setMenuVisible(false);
    setRenameVisible(true);
  };

  const closeRename = () => {
    setRenameVisible(false);
    setRenameText('');
    setSelectedItem(null);
  };

  const confirmRename = async () => {
    const target = selectedItem;
    if (!target) return;
    const nextName = renameText.trim();
    if (nextName.length === 0) {
      Alert.alert('이름 변경', '이름을 입력해주세요.');
      return;
    }
    try {
      await updatePdfIndex({ id: target.id, name: nextName });
      setItems((prev) => prev.map((it) => (it.id === target.id ? { ...it, name: nextName } : it)));
      closeRename();
    } catch (e) {
      console.warn('rename error', e);
      Alert.alert('이름 변경 실패', '이름을 변경하는 중 오류가 발생했습니다.');
    }
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
                {stripExtension(item.name)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.moreButton}
              ref={(r) => {
                if (r) {
                  moreBtnRefs.current[item.id] = r;
                } else {
                  delete moreBtnRefs.current[item.id];
                }
              }}
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

      {menuVisible && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.fullOverlay}>
            <View style={[styles.menuContainer, { position: 'absolute', top: menuTop, left: menuLeft }]}>
              <TouchableOpacity
                style={styles.menuItem}
              >
                <Text style={styles.menuItemText}>파일 정보</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
              >
                <Text style={styles.menuItemText}>즐겨찾기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={openRename}
              >
                <Text style={styles.menuItemText}>이름 변경</Text>
              </TouchableOpacity>
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
              >
                <Text style={styles.menuItemText}>공유</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
      {renameVisible && (
        <TouchableWithoutFeedback onPress={closeRename}>
          <View style={styles.fullOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.renameContainer}>
                <Text style={styles.renameTitle}>이름 변경</Text>
                <TextInput
                  style={styles.renameInput}
                  value={renameText}
                  onChangeText={setRenameText}
                  placeholder="새 이름"
                  autoFocus
                />
                <View style={styles.renameActions}>
                  <TouchableOpacity style={styles.renameButton} onPress={closeRename}>
                    <Text style={styles.renameButtonText}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.renameButtonPrimary} onPress={confirmRename}>
                    <Text style={styles.renameButtonPrimaryText}>저장</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
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
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'lightgray',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  fullOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
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
  renameContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '80%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  renameTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  renameInput: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 16,
  },
  renameActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  renameButton: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    marginRight: 8,
  },
  renameButtonText: {
    fontSize: 16,
    color: '#333',
  },
  renameButtonPrimary: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    backgroundColor: 'skyblue',
    borderRadius: 12,
  },
  renameButtonPrimaryText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
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


