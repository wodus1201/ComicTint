import { forwardRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MoreHorizontalIcon, PinIcon } from 'lucide-react-native';
import { stripExtension } from '../utils/files';

type Item = { id: string; name: string; uri?: string };

type Props = {
  item: Item;
  editMode: boolean;
  selected: boolean;
  isFavorite?: boolean;
  onPressItem: (item: Item) => void;
  onPressMore: (item: Item) => void;
  onToggleSelect: (id: string) => void;
};

const PdfListItem = forwardRef<any, Props>(
  (
    { item, editMode, selected, isFavorite = false, onPressItem, onPressMore, onToggleSelect },
    ref,
  ) => {
    return (
      <View style={styles.item}>
        <TouchableOpacity style={styles.itemContent} onPress={() => onPressItem(item)}>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemText} numberOfLines={1} ellipsizeMode='tail'>
              {stripExtension(item.name)}
            </Text>
            {isFavorite && <PinIcon size={16} color='skyblue' style={styles.pinIcon} />}
          </View>
        </TouchableOpacity>
        {editMode ? (
          <TouchableOpacity style={styles.moreButton} onPress={() => onToggleSelect(item.id)}>
            <View
              style={[styles.checkOuter, { backgroundColor: selected ? 'skyblue' : 'white' }]}
            ></View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.moreButton} ref={ref} onPress={() => onPressMore(item)}>
            <MoreHorizontalIcon size={20} color='dimgray' />
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

PdfListItem.displayName = 'PdfListItem';

export default PdfListItem;

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    paddingVertical: 20,
    paddingRight: 10,
    flex: 1,
  },
  itemTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontWeight: '500',
    fontSize: 20,
  },
  pinIcon: {
    marginLeft: 8,
  },
  moreButton: {
    borderRadius: 20,
    padding: 5,
  },
  checkOuter: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'darkgray',
    borderWidth: 3,
    borderRadius: '100%',
  },
});
