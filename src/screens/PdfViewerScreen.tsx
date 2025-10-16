import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/PdfViewerScreen.style';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Pdf from 'react-native-pdf';
import { ArrowLeftIcon, ArrowRightIcon, RefreshCcwIcon } from 'lucide-react-native';
import { RootStackParamList } from '../navigation/types';
import { updatePdfIndex } from '../storage/pdfIndex';
import { stripExtension } from '../utils/files';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfViewer'>;

export default function PdfViewerScreen({ route, navigation }: Props) {
  const { uri, id, name } = route.params;

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
          onPress={() => navigation.goBack()}
          hitSlop={8}
        >
          <ArrowRightIcon size={25} color='dimgray' />
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
          onPress={() => navigation.goBack()}
          hitSlop={8}
        >
          <RefreshCcwIcon size={25} color='dimgray' />
        </TouchableOpacity>
      </Animated.View>
      <Pdf
        source={{ uri: resolvedUri }}
        style={styles.pdf}
        onError={e => console.warn('pdf error', e)}
        onLoadComplete={pages => console.log('pages:', pages)}
        onPageSingleTap={() => toggleControls()}
      />
    </>
  );
}
