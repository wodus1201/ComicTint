import { useEffect, useState } from 'react';
import { FlatList, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/RecentFilesScreen.style';
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
      <StatusBar backgroundColor='darkgray' barStyle='light-content' />
      <View style={{ height: safeAreaInsets.top, backgroundColor: 'darkgray' }} />
      <Text style={styles.title}>최근 파일</Text>
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
