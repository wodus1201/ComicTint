import { FlatList, StatusBar, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { usePdfImport } from '../hooks/usePdfImport';
import { usePdfSelection } from '../hooks/usePdfSelection';
import { useMenuPosition } from '../hooks/useMenuPosition';
import { usePdfActions } from '../hooks/usePdfActions';
import { useFavorites } from '../hooks/useFavorites';
import { styles } from '../styles/PdfListScreen.styles';
import { StoredPdf } from '../models/pdf';
import { SortOrder, DEFAULT_SORT_ORDER } from '../models/pdf';
import { getSortOrder, setSortOrder } from '../storage/pdfIndex';
import PdfListBottomBar from '../components/PdfListBottomBar';
import PdfListItem from '../components/PdfListItem';
import PdfListMenu from '../components/PdfListMenu';
import RenameModal from '../components/RenameModal';
import FileInfoModal from '../components/FileInfoModal';
import SortHeader from '../components/SortHeader';
import SortMenu from '../components/SortMenu';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfList'>;

export default function PdfListScreen({ navigation }: Props) {
  const safeAreaInsets = useSafeAreaInsets();
  const [fileInfoVisible, setFileInfoVisible] = useState(false);
  const [selectedFileInfo, setSelectedFileInfo] = useState<StoredPdf | null>(null);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortMenuTop, setSortMenuTop] = useState(0);
  const [sortMenuLeft, setSortMenuLeft] = useState(0);
  const [sortOrder, setSortOrderState] = useState<SortOrder>(DEFAULT_SORT_ORDER);
  const [renameTarget, setRenameTarget] = useState<{
    id: string;
    name: string;
    uri?: string;
  } | null>(null);

  const { items, handlePick, updateItem, removeItem, removeItems } = usePdfImport(navigation);
  const { toggleFavorite, isFavorite } = useFavorites();
  const {
    editMode,
    selectedIds,
    toggleEditMode,
    toggleSelect,
    selectAll,
    clearSelection,
    isSelected,
    allSelected,
  } = usePdfSelection(items);
  const { menuVisible, menuTop, menuLeft, selectedItem, handleMorePress, closeMenu, setRef } =
    useMenuPosition();
  const {
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
  } = usePdfActions(
    items,
    selectedIds,
    updateItem,
    removeItem,
    removeItems,
    toggleEditMode,
    clearSelection,
  );

  useEffect(() => {
    (async () => {
      const saved = await getSortOrder();
      setSortOrderState(saved);
    })();
  }, []);

  const applySort = (arr: typeof items, order: SortOrder) => {
    const safeStr = (s?: string) => (s || '').toLocaleLowerCase();
    const safeNum = (n?: number) => (typeof n === 'number' ? n : 0);
    const byCreatedDesc = (a: any, b: any) => safeNum(b.createdAt) - safeNum(a.createdAt);
    const bySizeDesc = (a: any, b: any) => safeNum(b.size) - safeNum(a.size);
    const byNameAsc = (a: any, b: any) => safeStr(a.name).localeCompare(safeStr(b.name));
    const byRecentOpenedDesc = (a: any, b: any) =>
      safeNum(b.lastOpenedAt) - safeNum(a.lastOpenedAt);

    const comparator = (() => {
      switch (order) {
        case 'sizeDesc':
          return bySizeDesc;
        case 'nameAsc':
          return byNameAsc;
        case 'recentOpenedDesc':
          return byRecentOpenedDesc;
        case 'addedDesc':
        default:
          return byCreatedDesc;
      }
    })();

    return [...arr].sort(comparator);
  };

  const onMorePress = (item: { id: string; name: string; uri?: string }) => {
    handleMorePress(item, editMode);
  };

  const onRename = () => {
    if (selectedItem) {
      openRename(selectedItem);
      setRenameTarget(selectedItem);
      closeMenu();
    }
  };

  const onDelete = () => {
    if (selectedItem) {
      closeMenu();
      handleDelete(selectedItem);
    }
  };

  const onShare = () => {
    if (selectedItem) {
      closeMenu();
      handleShare(selectedItem);
    }
  };

  const onFileInfo = () => {
    if (selectedItem) {
      const fullItem = items.find(item => item.id === selectedItem.id);
      if (fullItem) {
        const storedPdf: StoredPdf = {
          id: fullItem.id,
          name: fullItem.name,
          path: fullItem.uri || '',
          size: fullItem.size || 0,
          createdAt: fullItem.createdAt || Date.now(),
          lastOpenedAt: fullItem.lastOpenedAt,
          isFavorite: isFavorite(fullItem.id),
          favoriteOrder: fullItem.favoriteOrder,
        };
        setSelectedFileInfo(storedPdf);
        setFileInfoVisible(true);
      }
      closeMenu();
    }
  };

  const onToggleFavorite = () => {
    if (selectedItem) {
      const fullItem = items.find(item => item.id === selectedItem.id);
      if (fullItem) {
        const storedPdf: StoredPdf = {
          id: fullItem.id,
          name: fullItem.name,
          path: fullItem.uri || '',
          size: fullItem.size || 0,
          createdAt: fullItem.createdAt || Date.now(),
          lastOpenedAt: fullItem.lastOpenedAt,
          isFavorite: isFavorite(fullItem.id),
          favoriteOrder: fullItem.favoriteOrder,
        };
        toggleFavorite(storedPdf);
      }
      closeMenu();
    }
  };

  const onConfirmRename = () => {
    if (renameTarget) {
      confirmRename(renameTarget);
      setRenameTarget(null);
    }
  };

  const sortedItems = useMemo(() => {
    const favs = items.filter(it => isFavorite(it.id));
    const normals = items.filter(it => !isFavorite(it.id));
    const sortedFavs = applySort(favs, sortOrder);
    const sortedNormals = applySort(normals, sortOrder);
    return [...sortedFavs, ...sortedNormals];
  }, [items, sortOrder, isFavorite]);

  const handleSelectSort = async (order: SortOrder) => {
    try {
      setSortOrderState(order);
      await setSortOrder(order);
    } catch (e) {}
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor='skyblue' barStyle='light-content' />
        <View style={{ height: safeAreaInsets.top, backgroundColor: 'skyblue' }} />
        <SortHeader
          title={'PDF 목록'}
          onOpenSortMenu={({ x, y, width, height }) => {
            const MENU_WIDTH = 200;
            const V_OFFSET = 8;
            const top = y + height + V_OFFSET;
            const left = Math.max(8, Math.min(x + width - MENU_WIDTH, Math.max(8, x)));
            setSortMenuTop(top);
            setSortMenuLeft(left);
            setSortMenuVisible(true);
          }}
        />
        <FlatList
          data={sortedItems}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PdfListItem
              ref={r => setRef(item.id, r)}
              item={item}
              editMode={editMode}
              selected={isSelected(item.id)}
              isFavorite={isFavorite(item.id)}
              onPressItem={it => {
                if (!editMode && it.uri) {
                  navigation.navigate('PdfViewer', { uri: it.uri, id: it.id, name: it.name });
                }
                if (editMode) {
                  toggleSelect(it.id);
                }
              }}
              onPressMore={it => onMorePress(it)}
              onToggleSelect={id => toggleSelect(id)}
            />
          )}
        />
        <PdfListBottomBar
          editMode={editMode}
          onPick={handlePick}
          onOpenRecent={() => navigation.navigate('RecentFiles')}
          onToggleEdit={toggleEditMode}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
          onBulkShare={handleBulkShare}
          onBulkDelete={handleBulkDelete}
          allSelected={allSelected}
        />

        <PdfListMenu
          visible={menuVisible}
          top={menuTop}
          left={menuLeft}
          onClose={closeMenu}
          onFileInfo={onFileInfo}
          onToggleFavorite={onToggleFavorite}
          onRename={onRename}
          onDelete={onDelete}
          onShare={onShare}
          isFavorite={selectedItem ? isFavorite(selectedItem.id) : false}
        />
        {renameVisible && (
          <RenameModal
            visible={renameVisible}
            value={renameText}
            onChangeText={setRenameText}
            onCancel={() => {
              closeRename();
              setRenameTarget(null);
            }}
            onConfirm={onConfirmRename}
          />
        )}
        <SortMenu
          visible={sortMenuVisible}
          onClose={() => setSortMenuVisible(false)}
          top={sortMenuTop}
          left={sortMenuLeft}
          currentOrder={sortOrder}
          onSelect={handleSelectSort}
        />
      </View>
      <FileInfoModal
        visible={fileInfoVisible}
        file={selectedFileInfo}
        onClose={() => setFileInfoVisible(false)}
      />
    </>
  );
}
