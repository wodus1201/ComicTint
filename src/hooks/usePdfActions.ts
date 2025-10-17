import { useState } from 'react';
import { Share } from 'react-native';
import { stripExtension } from '../utils/files';
import { removePdfWithTransaction, updatePdfIndex } from '../storage/pdfIndex';
import { useCustomAlert } from './useCustomAlert';

type PdfItem = { id: string; name: string; uri?: string };

export function usePdfActions(
  items: PdfItem[],
  selectedIds: Set<string>,
  updateItem: (id: string, updates: Partial<PdfItem>) => void,
  removeItem: (id: string) => void,
  removeItems: (ids: string[]) => void,
  setEditMode: (value: boolean) => void,
  clearSelection: () => void,
) {
  const [renameVisible, setRenameVisible] = useState(false);
  const [renameText, setRenameText] = useState('');
  const { showAlert, AlertComponent } = useCustomAlert();

  const handleShare = async (item: PdfItem) => {
    if (!item.uri) {
      showAlert({
        title: '공유',
        message: '공유할 파일 경로를 찾을 수 없습니다.',
        buttons: [{ text: '확인' }],
      });
      return;
    }
    await Share.share({ url: item.uri!, message: item.name, title: 'PDF 공유' });
  };

  const handleBulkShare = async () => {
    if (selectedIds.size === 0) {
      showAlert({
        title: '공유',
        message: '선택된 항목이 없습니다.',
        buttons: [{ text: '확인' }],
      });
      return;
    }
    const selected = items.filter(i => selectedIds.has(i.id) && i.uri);
    if (selected.length === 0) {
      showAlert({
        title: '공유',
        message: '공유할 파일 경로를 찾을 수 없습니다.',
        buttons: [{ text: '확인' }],
      });
      return;
    }
    try {
      const first = selected[0];
      const others = selected.slice(1);
      const message =
        others.length > 0
          ? `${others.length + 1}개 파일 공유:\n- ${stripExtension(first.name)}\n${others
              .map(o => `- ${stripExtension(o.name)}`)
              .join('\n')}`
          : stripExtension(first.name);
      await Share.share({ url: first.uri!, message, title: 'PDF 공유' });
    } catch (e) {
      console.warn('bulk share error', e);
      showAlert({
        title: '공유 실패',
        message: '파일 공유 중 오류가 발생했습니다.',
        buttons: [{ text: '확인' }],
      });
    }
  };

  const handleDelete = (item: PdfItem) => {
    if (!item.uri) {
      showAlert({
        title: '오류',
        message: '파일 경로를 찾을 수 없습니다.',
        buttons: [{ text: '확인' }],
      });
      return;
    }

    showAlert({
      title: '파일 삭제',
      message: '해당 파일을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
      buttons: [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await removePdfWithTransaction(item.id, item.uri!);
              removeItem(item.id);
            } catch (error: any) {
              console.warn('delete error', error);
              showAlert({
                title: '삭제 실패',
                message: `파일을 삭제하는 중 오류가 발생했습니다.\n오류: ${
                  error.message || '알 수 없는 오류'
                }\n파일이 목록에서 제거되었지만 실제 파일은 남아있을 수 있습니다.`,
                buttons: [{ text: '확인' }],
              });
            }
          },
        },
      ],
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) {
      showAlert({
        title: '삭제',
        message: '선택된 항목이 없습니다.',
        buttons: [{ text: '확인' }],
      });
      return;
    }
    showAlert({
      title: '삭제',
      message: `${selectedIds.size}개 항목을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      buttons: [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              const selectedSet = new Set(selectedIds);
              for (const it of items) {
                if (selectedSet.has(it.id) && it.uri) {
                  await removePdfWithTransaction(it.id, it.uri);
                }
              }
              removeItems(Array.from(selectedIds));
              clearSelection();
              setEditMode(false);
              showAlert({
                title: '삭제 완료',
                message: '선택한 파일이 삭제되었습니다.',
                buttons: [{ text: '확인' }],
              });
            } catch (e: any) {
              console.warn('bulk delete error', e);
              showAlert({
                title: '삭제 실패',
                message: '일부 파일을 삭제하지 못했습니다.',
                buttons: [{ text: '확인' }],
              });
            }
          },
        },
      ],
    });
  };

  const openRename = (item: PdfItem) => {
    setRenameText(item.name);
    setRenameVisible(true);
  };

  const closeRename = () => {
    setRenameVisible(false);
    setRenameText('');
  };

  const confirmRename = async (item: PdfItem) => {
    const nextName = renameText.trim();
    if (nextName.length === 0) {
      showAlert({
        title: '이름 변경',
        message: '이름을 입력해주세요.',
        buttons: [{ text: '확인' }],
      });
      return;
    }
    try {
      await updatePdfIndex({ id: item.id, name: nextName });
      updateItem(item.id, { name: nextName });
      closeRename();
    } catch (e) {
      console.warn('rename error', e);
      showAlert({
        title: '이름 변경 실패',
        message: '이름을 변경하는 중 오류가 발생했습니다.',
        buttons: [{ text: '확인' }],
      });
    }
  };

  return {
    renameVisible,
    renameText,
    setRenameText,
    handleShare,
    handleBulkShare,
    handleDelete,
    handleBulkDelete,
    openRename,
    closeRename,
    confirmRename,
    AlertComponent,
  };
}
