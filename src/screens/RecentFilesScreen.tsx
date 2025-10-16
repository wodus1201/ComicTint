import { useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { StoredPdf } from '../models/pdf';
import { readPdfIndex } from '../storage/pdfIndex';
import { formatTimeAgo } from '../utils/timeFormat';

type Props = NativeStackScreenProps<RootStackParamList, 'RecentFiles'>;

export default function RecentFilesScreen({ navigation }: Props) {
  const safeAreaInsets = useSafeAreaInsets();
  const [items, setItems] = useState<StoredPdf[]>([]);

  useEffect(() => {
    (async () => {
      const stored = await readPdfIndex();
      const sorted = stored
        .filter(item => item.lastOpenedAt !== undefined)
        .sort((a, b) => (b.lastOpenedAt || 0) - (a.lastOpenedAt || 0));
      setItems(sorted);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='skyblue' barStyle='light-content' />
      <View style={{ height: safeAreaInsets.top, backgroundColor: 'skyblue' }} />
      <Text style={styles.title}>최근 열었던 파일</Text>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              navigation.navigate('PdfViewer', { uri: item.path, id: item.id });
            }}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.timeText}>{formatTimeAgo(item.lastOpenedAt)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>뒤로가기</Text>
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
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 30,
    fontWeight: '600',
    color: 'white',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  item: {
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    marginRight: 10,
    fontSize: 20,
    fontWeight: '500',
  },
  timeText: {
    fontWeight: '400',
    fontSize: 14,
    color: '#666',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 100,
  },
  buttonText: {
    fontWeight: '600',
    color: 'white',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'skyblue',
  },
});
