import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DocumentPicker, { types } from 'react-native-document-picker';
import { RootStackParamList } from '../navigation/types';
import { StoredPdf } from '../models/pdf';
import { copyContentUriToDocumentDir } from '../utils/fileCopy';
import { generateId, toSafeFileName } from '../utils/files';
import { appendPdfIndex, readPdfIndex } from '../storage/pdfIndex';

type PdfItem = { id: string; name: string; uri?: string };

export function usePdfImport(
  navigation: NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>,
) {
  const [items, setItems] = useState<PdfItem[]>([]);

  useEffect(() => {
    loadPdfItems();
  }, []);

  const loadPdfItems = async () => {
    const stored = await readPdfIndex();
    setItems(stored.map(s => ({ id: s.id, name: s.name, uri: s.path })));
  };

  const handlePick = async () => {
    try {
      const res = await DocumentPicker.pickSingle({ type: types.pdf });
      const pickedUri = res.uri;
      console.log('DocumentPicker result:', {
        uri: res.uri,
        fileCopyUri: res.fileCopyUri,
        name: res.name,
      });
      console.log('Using URI:', pickedUri);
      const name = res.name ?? 'imported.pdf';

      Alert.alert('가져오기', `${name} 파일을 어떻게 할까요?`, [
        {
          text: '목록에 추가하기',
          onPress: () => addToLibrary(pickedUri, name),
        },
        {
          text: '미리보기',
          onPress: () => navigation.navigate('PdfViewer', { uri: pickedUri }),
        },
        {
          text: '취소하기',
          style: 'cancel',
        },
      ]);
    } catch (e: any) {
      if (DocumentPicker.isCancel(e)) return;
      console.warn('Document pick error', e);
      Alert.alert('파일 선택 오류', '파일을 선택하는 중 오류가 발생했습니다. 다시 시도해주세요.', [
        { text: '확인' },
      ]);
    }
  };

  const addToLibrary = async (pickedUri: string, name: string) => {
    try {
      const id = generateId();
      const safe = toSafeFileName(name);
      const { destPath, size } = await copyContentUriToDocumentDir({
        id,
        safeFileName: safe,
        contentUri: pickedUri,
      });
      const now = Date.now();
      const record: StoredPdf = { id, name, path: destPath, size, createdAt: now };
      await appendPdfIndex(record);
      setItems(prev => [{ id, name, uri: destPath }, ...prev]);
      Alert.alert('성공', 'PDF 파일이 목록에 추가되었습니다.');
    } catch (err: any) {
      console.warn('import error', err);
      Alert.alert(
        '가져오기 실패',
        `파일을 가져오는 중 오류가 발생했습니다.\n\n오류: ${
          err.message || '알 수 없는 오류'
        }\n\n다시 시도하시겠습니까?`,
        [
          { text: '다시 시도', onPress: () => handlePick() },
          { text: '취소', style: 'cancel' },
        ],
      );
    }
  };

  const updateItem = (id: string, updates: Partial<PdfItem>) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const removeItems = (ids: string[]) => {
    setItems(prev => prev.filter(item => !ids.includes(item.id)));
  };

  return {
    items,
    handlePick,
    updateItem,
    removeItem,
    removeItems,
    loadPdfItems,
  };
}
