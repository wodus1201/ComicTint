import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfViewer'>;

export default function PdfViewerScreen({ route }: Props) {
  const { uri } = route.params;
  const [resolvedUri, setResolvedUri] = useState<string | null>(null);

  useEffect(() => {
    setResolvedUri(uri);
  }, [uri]);

  if (!resolvedUri) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Pdf
      source={{ uri: resolvedUri }}
      style={styles.pdf}
      onError={(e) => console.warn('pdf error', e)}
      onLoadComplete={(pages) => console.log('pages:', pages)}
    />
  );
}

const styles = StyleSheet.create({
  pdf: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});


