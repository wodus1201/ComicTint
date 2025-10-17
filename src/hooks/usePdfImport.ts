import { useState, useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DocumentPicker, { types } from 'react-native-document-picker';
import RNBlobUtil from 'react-native-blob-util';
import { RootStackParamList } from '../navigation/types';
import { StoredPdf } from '../models/pdf';
import { copyContentUriToDocumentDir } from '../utils/fileCopy';
import { generateId, toSafeFileName } from '../utils/files';
import { appendPdfIndex, readPdfIndex, removePdfWithTransaction } from '../storage/pdfIndex';
import { useCustomAlert } from './useCustomAlert';

type PdfItem = {
  id: string;
  name: string;
  uri?: string;
  size?: number;
  createdAt?: number;
  lastOpenedAt?: number;
  isFavorite?: boolean;
  favoriteOrder?: number;
};

export function usePdfImport(
  navigation: NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>,
) {
  const [items, setItems] = useState<PdfItem[]>([]);
  const { showAlert, AlertComponent } = useCustomAlert('usePdfImport');

  useEffect(() => {
    loadPdfItems();
  }, []);

  const loadPdfItems = async () => {
    const stored = await readPdfIndex();

    const mappedItems = stored.map(s => ({
      id: s.id,
      name: s.name,
      uri: s.path,
      size: s.size,
      createdAt: s.createdAt,
      lastOpenedAt: s.lastOpenedAt,
      isFavorite: s.isFavorite,
      favoriteOrder: s.favoriteOrder,
    }));

    setItems(mappedItems);
  };

  const handlePick = async () => {
    try {
      const res = await DocumentPicker.pickSingle({ type: types.pdf });
      const pickedUri = res.uri;
      const name = res.name ?? 'imported.pdf';

      showAlert({
        title: '가져오기',
        message: '해당 파일을 어떻게 할까요?',
        buttons: [
          {
            text: '목록에 추가하기',
            onPress: () => addToLibrary(pickedUri, name, res.size || undefined),
          },
          {
            text: '미리보기',
            onPress: () => navigation.navigate('PdfViewer', { uri: pickedUri }),
          },
          {
            text: '취소하기',
            style: 'cancel',
          },
        ],
      });
    } catch (e: any) {
      if (DocumentPicker.isCancel(e)) return;
      console.warn('Document pick error', e);
      showAlert({
        title: '파일 선택 오류',
        message: '파일을 선택하는 중 오류가 발생했습니다. 다시 시도해주세요.',
        buttons: [{ text: '확인' }],
      });
    }
  };

  const getFileSize = async (uri: string): Promise<number | undefined> => {
    try {
      if (!uri.startsWith('content://')) {
        const stat = await RNBlobUtil.fs.stat(uri);
        return Number(stat.size || 0);
      }

      try {
        const stat = await RNBlobUtil.fs.stat(uri);
        return Number(stat.size || 0);
      } catch {
        try {
          const tempPath = `${RNBlobUtil.fs.dirs.CacheDir}/temp_size_check.pdf`;
          await RNBlobUtil.fs.cp(uri, tempPath);
          const tempStat = await RNBlobUtil.fs.stat(tempPath);
          const size = Number(tempStat.size || 0);
          await RNBlobUtil.fs.unlink(tempPath).catch(() => {});
          return size;
        } catch (copyError) {
          return undefined;
        }
      }
    } catch (error) {
      return undefined;
    }
  };

  const checkDuplicateFile = async (
    fileName: string,
    fileSize?: number,
  ): Promise<{ isDuplicate: boolean; reason: 'name' | 'size' | 'none' }> => {
    const normalizedFileName = fileName.trim().toLowerCase();

    const nameDuplicate = items.some(item => {
      const normalizedItemName = item.name.trim().toLowerCase();
      const isMatch = normalizedItemName === normalizedFileName;
      return isMatch;
    });

    if (nameDuplicate) {
      return { isDuplicate: true, reason: 'name' };
    }

    if (fileSize !== undefined) {
      const sizeDuplicate = items.some(item => {
        const isMatch = item.size === fileSize;
        return isMatch;
      });

      if (sizeDuplicate) {
        return { isDuplicate: true, reason: 'size' };
      }
    }

    return { isDuplicate: false, reason: 'none' };
  };

  const addToLibrary = async (pickedUri: string, name: string, documentSize?: number) => {
    try {
      let fileSize: number | undefined = documentSize;

      if (fileSize === undefined) {
        try {
          fileSize = await getFileSize(pickedUri);
        } catch (sizeError) {
          console.warn('파일 크기 가져오기 실패, 이름만으로 중복 검사:', sizeError);
          fileSize = undefined;
        }
      }

      const duplicateResult = await checkDuplicateFile(name, fileSize);

      if (duplicateResult.isDuplicate) {
        setTimeout(() => {
          const sizeText = fileSize ? ` (크기: ${Math.round(fileSize / 1024)}KB)` : '';
          let message = '';

          if (duplicateResult.reason === 'name') {
            message = `같은 이름의 파일이 이미 목록에 있습니다.\n어떻게 하시겠습니까?`;
          } else if (duplicateResult.reason === 'size') {
            message = `같은 크기의 파일이 이미 목록에 있습니다.\n어떻게 하시겠습니까?`;
          }

          showAlert({
            title: '중복 파일 발견',
            message,
            buttons: [
              {
                text: '덮어쓰기',
                onPress: () => replaceExistingFile(pickedUri, name),
              },
              {
                text: '새 이름으로 저장',
                onPress: () => addWithNewName(pickedUri, name, documentSize),
              },
              {
                text: '취소',
                style: 'cancel',
              },
            ],
          });
        }, 100);
        return;
      }

      await addNewFile(pickedUri, name);
    } catch (err: any) {
      console.warn('import error', err);
      showAlert({
        title: '가져오기 실패',
        message: `파일을 가져오는 중 오류가 발생했습니다.\n오류: ${
          err.message || '알 수 없는 오류'
        }\n다시 시도하시겠습니까?`,
        buttons: [
          { text: '다시 시도', onPress: () => handlePick() },
          { text: '취소', style: 'cancel' },
        ],
      });
    }
  };

  const addNewFile = async (pickedUri: string, name: string) => {
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
    setItems(prev => [{ id, name, uri: destPath, size, createdAt: now }, ...prev]);
  };

  const replaceExistingFile = async (pickedUri: string, name: string) => {
    try {
      const existingItem = items.find(item => item.name === name);
      if (!existingItem) {
        showAlert({
          title: '오류',
          message: '기존 파일을 찾을 수 없습니다.',
          buttons: [{ text: '확인' }],
        });
        return;
      }

      const safe = toSafeFileName(name);
      const { destPath, size } = await copyContentUriToDocumentDir({
        id: existingItem.id,
        safeFileName: safe,
        contentUri: pickedUri,
      });
      const now = Date.now();
      const record: StoredPdf = {
        id: existingItem.id,
        name,
        path: destPath,
        size,
        createdAt: now,
      };

      await removePdfWithTransaction(existingItem.id, existingItem.uri || '');
      await appendPdfIndex(record);

      setItems(prev =>
        prev.map(item =>
          item.id === existingItem.id ? { id: existingItem.id, name, uri: destPath } : item,
        ),
      );

      showAlert({
        title: '성공',
        message: '파일이 성공적으로 교체되었습니다.',
        buttons: [{ text: '확인' }],
      });
    } catch (err: any) {
      console.warn('replace error', err);
      showAlert({
        title: '교체 실패',
        message: '파일 교체 중 오류가 발생했습니다.',
        buttons: [{ text: '확인' }],
      });
    }
  };

  const addWithNewName = async (pickedUri: string, originalName: string, documentSize?: number) => {
    try {
      let fileSize: number | undefined = documentSize;

      if (fileSize === undefined) {
        try {
          fileSize = await getFileSize(pickedUri);
        } catch (sizeError) {
          console.warn('파일 크기 가져오기 실패, 이름만으로 중복 검사:', sizeError);
          fileSize = undefined;
        }
      }

      let newName = originalName;
      let counter = 1;

      while (true) {
        const duplicateResult = await checkDuplicateFile(newName, fileSize);
        if (!duplicateResult.isDuplicate) {
          break;
        }

        const nameWithoutExt = originalName.replace(/\.pdf$/i, '');
        newName = `${nameWithoutExt} (${counter}).pdf`;
        counter++;
      }

      await addNewFile(pickedUri, newName);
    } catch (err: any) {
      console.warn('add with new name error', err);
      showAlert({
        title: '저장 실패',
        message: '새 이름으로 저장하는 중 오류가 발생했습니다.',
        buttons: [{ text: '확인' }],
      });
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
    AlertComponent,
  };
}
