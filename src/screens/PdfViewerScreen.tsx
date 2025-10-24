import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../styles/PdfViewerScreen.style';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeftIcon, PaletteIcon, ShareIcon } from 'lucide-react-native';
import { RootStackParamList, PdfParams, ColoringParams } from '../navigation/types';
import { updatePdfIndex } from '../storage/pdfIndex';
import { stripExtension } from '../utils/files';
import Pdf from 'react-native-pdf';
import { useCustomAlert } from '../hooks/useCustomAlert';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfViewer'>;
type PdfItem = { id: string; name: string; uri?: string };

export default function PdfViewerScreen({ route, navigation }: Props) {
  const { uri, id, name } = route.params;
  const { showAlert } = useCustomAlert('PdfViewerScreen');
  const [resolvedUri, setResolvedUri] = useState<string | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);

  const opacity = useRef(new Animated.Value(1)).current;
  const translateYTop = useRef(new Animated.Value(0)).current;
  const translateYBottom = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setResolvedUri(uri);
    if (id) {
      updatePdfIndex({ id, lastOpenedAt: Date.now() }).catch(e =>
        console.warn('update lastOpenedAt error', e),
      );
    }
  }, [uri, id]);

  const handleShare = async (item: PdfItem) => {
    if (!item.uri) {
      showAlert({
        title: '공유',
        message: '공유할 파일 경로를 찾을 수 없습니다.',
        buttons: [{ text: '확인' }],
      });
      return;
    }
    await Share.share({ url: item.uri!, message: item.name, title: 'PDF 공유' });
  };

  const toggleControls = () => {
    const toValue = controlsVisible ? 0 : 1;
    const toYTop = controlsVisible ? -30 : 0;
    const toYBottom = controlsVisible ? 30 : 0;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateYTop, {
        toValue: toYTop,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateYBottom, {
        toValue: toYBottom,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
    setControlsVisible(!controlsVisible);
  };

  if (!resolvedUri) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <Animated.View
        style={[
          styles.topContainer,
          { opacity: opacity, transform: [{ translateY: translateYTop }] },
        ]}
        pointerEvents={controlsVisible ? 'auto' : 'none'}
      >
        <Text style={styles.topTitle}>{stripExtension(name || '')}</Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.bottomContainer,
          { opacity: opacity, transform: [{ translateY: translateYBottom }] },
        ]}
        pointerEvents={controlsVisible ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            {
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
            },
          ]}
          onPress={() => navigation.goBack()}
          hitSlop={8}
        >
          <ArrowLeftIcon size={25} color='dimgray' />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            {
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
            },
          ]}
          onPress={() => {
            if (id) {
              navigation.navigate('Coloring', {
                pdfUri: uri,
                pdfId: id,
                pageNumber: 1,
              } as ColoringParams);
            }
          }}
          hitSlop={8}
        >
          <PaletteIcon size={25} color='dimgray' />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            {
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
              borderTopRightRadius: 30,
              borderBottomRightRadius: 30,
            },
          ]}
          onPress={() => handleShare({ id: id || '', name: name || '', uri: uri || '' })}
          hitSlop={8}
        >
          <ShareIcon size={25} color='dimgray' />
        </TouchableOpacity>
      </Animated.View>
      <Pdf
        source={{ uri: resolvedUri }}
        style={styles.pdf}
        onError={e => console.warn('pdf error', e)}
        onPageSingleTap={() => toggleControls()}
      />
    </>
  );
}
