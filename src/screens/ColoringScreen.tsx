import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, ColoringParams } from '../navigation/types';
import { useColoringStore } from '../coloring/stores/coloringStore';
import { useColoringCanvas } from '../coloring/hooks/useColoringCanvas';
import { useBrushTool } from '../coloring/hooks/useBrushTool';
import { useLayerManagement } from '../coloring/hooks/useLayerManagement';
import { ColoringCanvas } from '../coloring/components/ColoringCanvas';
import { BrushToolbar } from '../coloring/components/BrushToolbar';
import { LayerPanel } from '../coloring/components/LayerPanel';
import { HistoryControls } from '../coloring/components/HistoryControls';
import { dataManager } from '../coloring/services/dataManager';
import { ArrowLeftIcon, SaveIcon, SettingsIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Coloring'>;

export default function ColoringScreen({ route }: Props) {
  const { pdfUri, pdfId, pageNumber } = route.params;
  const { createProject, project, markDirty } = useColoringStore();
  const navigation = useNavigation();

  const { canvas, canDraw } = useColoringCanvas({
    width: Dimensions.get('window').width,
    height: Math.round((Dimensions.get('window').width * 4) / 3),
  });
  const { brush, brushInfo } = useBrushTool();
  const { layerStats, activeLayer } = useLayerManagement();

  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const initializeProject = async () => {
      try {
        createProject(pdfId, pageNumber);
        setIsInitialized(true);
      } catch (error) {
        Alert.alert('오류', '프로젝트 초기화에 실패했습니다.');
      }
    };

    initializeProject();
  }, [createProject, pdfId, pageNumber]);

  const handleSaveProject = useCallback(async () => {
    if (!project.id || isSaving) return;

    setIsSaving(true);
    try {
      const result = await dataManager.saveProject({
        id: project.id,
        pdfId: project.pdfId,
        pageNumber: project.pageNumber,
        createdAt: project.createdAt,
        lastModified: Date.now(),
        version: '1.0.0',
        canvas: {
          width: canvas.width,
          height: canvas.height,
          scale: canvas.scale,
          offset: canvas.offset,
        },
        layers: [],
        metadata: {
          title: `컬러링 프로젝트 - ${pdfId}`,
          description: `페이지 ${pageNumber}`,
          tags: ['coloring', 'comic'],
        },
      });

      if (result.success) {
        markDirty();
        Alert.alert('성공', '프로젝트가 저장되었습니다.');
      } else {
        Alert.alert('오류', result.error || '프로젝트 저장에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '프로젝트 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [project, canvas, pdfId, pageNumber, markDirty, isSaving]);

  const handleBackPress = useCallback(() => {
    if (project.isDirty) {
      Alert.alert('저장되지 않은 변경사항', '변경사항을 저장하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        { text: '저장하지 않고 나가기', onPress: () => navigation.goBack() },
        {
          text: '저장하고 나가기',
          onPress: () => {
            handleSaveProject().then(() => navigation.goBack());
          },
        },
      ]);
    } else {
      navigation.goBack();
    }
  }, [project.isDirty, navigation, handleSaveProject]);

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>프로젝트를 초기화하는 중...</Text>
      </View>
    );
  }

  const { width } = Dimensions.get('window');
  const canvasHeight = Math.round((width * 4) / 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.headerButton}>
          <ArrowLeftIcon size={24} color='white' />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            {brushInfo.displayName} • {activeLayer?.name || '레이어 없음'}
          </Text>
          <Text style={styles.headerSubtitle}>
            레이어 {layerStats.visibleLayers}/{layerStats.totalLayers}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleSaveProject}
            style={[styles.headerButton, isSaving && styles.headerButtonDisabled]}
            disabled={isSaving}
          >
            <SaveIcon size={20} color={isSaving ? 'gray' : 'white'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowSettings(!showSettings)}
            style={styles.headerButton}
          >
            <SettingsIcon size={20} color='white' />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.canvasContainer}>
        <ColoringCanvas width={width} height={canvasHeight} pdfImageUri={pdfUri} />

        {!canDraw && (
          <View style={styles.canvasOverlay}>
            <Text style={styles.canvasOverlayText}>그리기 가능한 레이어를 선택해주세요</Text>
          </View>
        )}
      </View>

      <View style={styles.controlsContainer}>
        <HistoryControls compact />
        <LayerPanel compact />
        <BrushToolbar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'dimgray',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: 'dimgray',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerButtonDisabled: {
    backgroundColor: 'white',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  canvasContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'darkgray',
    position: 'relative',
  },
  canvasOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  canvasOverlayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: 'dimgray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  controlsContainer: {
    paddingTop: 12,
    backgroundColor: 'dimgray',
  },
});
