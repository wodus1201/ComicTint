import { FlatList, StatusBar, Text, View } from 'react-native';
import { useState } from 'react';
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

  const { items, handlePick, updateItem, removeItem, removeItems } = usePdfImport(navigation);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
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

  const onMorePress = (item: { id: string; name: string; uri?: string }) => {
    handleMorePress(item, editMode);
  };

  const onRename = () => {
    if (selectedItem) {
      openRename(selectedItem);
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
    if (selectedItem) {
      confirmRename(selectedItem);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    const aIsFavorite = isFavorite(a.id);
    const bIsFavorite = isFavorite(b.id);

    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;

    if (aIsFavorite && bIsFavorite) {
      const aOrder = favorites.find(fav => fav.id === a.id)?.favoriteOrder || 0;
      const bOrder = favorites.find(fav => fav.id === b.id)?.favoriteOrder || 0;
      return aOrder - bOrder;
    }

    return 0;
  });

  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor='skyblue' barStyle='light-content' />
        <View style={{ height: safeAreaInsets.top, backgroundColor: 'skyblue' }} />
        <SortHeader title={'PDF 목록'} onOpenSortMenu={() => setSortMenuVisible(true)} />
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
                  navigation.navigate('PdfViewer', { uri: it.uri, id: it.id });
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
            onCancel={closeRename}
            onConfirm={onConfirmRename}
          />
        )}
        <SortMenu visible={sortMenuVisible} onClose={() => setSortMenuVisible(false)} />
      </View>
      <FileInfoModal
        visible={fileInfoVisible}
        file={selectedFileInfo}
        onClose={() => setFileInfoVisible(false)}
      />
    </>
  );
}
