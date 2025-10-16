import { FlatList, StatusBar, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { usePdfImport } from '../hooks/usePdfImport';
import { usePdfSelection } from '../hooks/usePdfSelection';
import { useMenuPosition } from '../hooks/useMenuPosition';
import { usePdfActions } from '../hooks/usePdfActions';
import { styles } from '../styles/PdfListScreen.styles';
import PdfListBottomBar from '../components/PdfListBottomBar';
import PdfListItem from '../components/PdfListItem';
import PdfListMenu from '../components/PdfListMenu';
import RenameModal from '../components/RenameModal';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfList'>;

export default function PdfListScreen({ navigation }: Props) {
  const safeAreaInsets = useSafeAreaInsets();

  const { items, handlePick, updateItem, removeItem, removeItems } = usePdfImport(navigation);
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

  const onConfirmRename = () => {
    if (selectedItem) {
      confirmRename(selectedItem);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='skyblue' barStyle='light-content' />
      <View style={{ height: safeAreaInsets.top, backgroundColor: 'skyblue' }} />
      <Text style={styles.title}>PDF 목록</Text>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PdfListItem
            ref={r => setRef(item.id, r)}
            item={item}
            editMode={editMode}
            selected={isSelected(item.id)}
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
        onRename={onRename}
        onDelete={onDelete}
        onShare={onShare}
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
    </View>
  );
}
