import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DocumentPicker, { types } from 'react-native-document-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useState } from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfList'>;

export default function PdfListScreen({ navigation }: Props) {
  const safeAreaInsets = useSafeAreaInsets();
  const [items, setItems] = useState<Array<{ id: string; name: string; uri?: string }>>([]);

  const handlePick = async () => {
    try {
      const res = await DocumentPicker.pickSingle({ type: types.pdf, copyTo: 'documentDirectory' });
      const pickedUri = res.fileCopyUri ?? res.uri;
      const name = res.name ?? 'imported.pdf';
      setItems((prev) => [{ id: String(Date.now()), name, uri: pickedUri }, ...prev]);
    } catch (e: any) {
      if (DocumentPicker.isCancel(e)) return;
      console.warn('Document pick error', e);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <Text style={styles.title}>PDF 목록</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              if (item.uri) {
                navigation.navigate('PdfViewer', { uri: item.uri });
              }
            }}
          >
            <Text style={styles.itemText}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.pickButtonContainer}>
        <TouchableOpacity onPress={handlePick}>
          <Text style={styles.pickButtonText}>기기에서 PDF 선택</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>뒤로가기</Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  itemText: {
    fontSize: 20,
    fontWeight: '500',
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'dimgray',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 15,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  pickButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'dimgray',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 15,
  },
  pickButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});


