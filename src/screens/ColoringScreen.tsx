import { useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useColoringStore } from '../coloring/stores/coloringStore';
import { ColoringCanvas } from '../coloring/components/ColoringCanvas';
import { BrushToolbar } from '../coloring/components/BrushToolbar';
import { LayerPanel } from '../coloring/components/LayerPanel';
import { HistoryControls } from '../coloring/components/HistoryControls';
import { ArrowLeftIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Coloring'>;

export default function ColoringScreen({ route }: Props) {
  const { pdfUri, pdfId, pageNumber } = route.params;
  const { createProject } = useColoringStore();
  const navigation = useNavigation();

  useEffect(() => {
    createProject(pdfId, pageNumber);
  }, [createProject, pdfId, pageNumber]);

  const { width } = Dimensions.get('window');
  const canvasHeight = Math.round((width * 4) / 3);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <ArrowLeftIcon size={30} color='white' />
      </TouchableOpacity>
      <View style={styles.canvasContainer}>
        <ColoringCanvas width={width} height={canvasHeight} pdfImageUri={pdfUri} />
      </View>

      <LayerPanel compact />
      <HistoryControls compact />
      <BrushToolbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backButton: {
    position: 'absolute',
    top: 35,
    left: 25,
    zIndex: 1000,
  },
  canvasContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'darkgray',
  },
});
