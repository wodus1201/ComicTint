import { forwardRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MoreHorizontalIcon } from 'lucide-react-native';
import { stripExtension } from '../utils/files';

type Item = { id: string; name: string; uri?: string };

type Props = {
  item: Item;
  editMode: boolean;
  selected: boolean;
  onPressItem: (item: Item) => void;
  onPressMore: (item: Item) => void;
  onToggleSelect: (id: string) => void;
};

const PdfListItem = forwardRef<any, Props>(
  ({ item, editMode, selected, onPressItem, onPressMore, onToggleSelect }, ref) => {
    return (
      <View style={styles.item}>
        <TouchableOpacity style={styles.itemContent} onPress={() => onPressItem(item)}>
          <Text style={styles.itemText} numberOfLines={1} ellipsizeMode='tail'>
            {stripExtension(item.name)}
          </Text>
        </TouchableOpacity>
        {editMode ? (
          <TouchableOpacity style={styles.moreButton} onPress={() => onToggleSelect(item.id)}>
            <View style={styles.checkOuter}>
              {selected ? <View style={styles.checkInner} /> : null}
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.moreButton} ref={ref} onPress={() => onPressMore(item)}>
            <MoreHorizontalIcon size={20} color='#666' />
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
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  itemContent: {
    flex: 1,
    paddingRight: 10,
    paddingVertical: 20,
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
  checkOuter: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: '100%',
  },
  checkInner: {
    width: 20,
    height: 20,
    borderRadius: '100%',
    backgroundColor: 'skyblue',
  },
});
