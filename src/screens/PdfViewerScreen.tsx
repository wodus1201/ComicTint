import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity, Pressable, Animated, Easing } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ArrowLeftIcon, ArrowRightIcon, RefreshCcwIcon } from 'lucide-react-native';
import Pdf from 'react-native-pdf';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfViewer'>;

export default function PdfViewerScreen({ route, navigation }: Props) {
  const { uri } = route.params;
  const [resolvedUri, setResolvedUri] = useState<string | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setResolvedUri(uri);
  }, [uri]);

  const toggleControls = () => {
    const toValue = controlsVisible ? 0 : 1;
    const toY = controlsVisible ? 30 : 0;
    Animated.parallel([
      Animated.timing(opacity, { toValue, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: toY, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
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
        styles.container,
        { opacity: opacity, transform: [{ translateY }] },
      ]}
      pointerEvents={controlsVisible ? 'auto' : 'none'}
    >
      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.goBack()} hitSlop={8}>
        <ArrowLeftIcon size={25} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.goBack()} hitSlop={8}>
        <ArrowRightIcon size={25} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.goBack()} hitSlop={8}>
        <RefreshCcwIcon size={25} color="white" />
      </TouchableOpacity>
    </Animated.View>
    <Pdf
      source={{ uri: resolvedUri }}
      style={styles.pdf}
      onError={(e) => console.warn('pdf error', e)}
      onLoadComplete={(pages) => console.log('pages:', pages)}
      onPageSingleTap={() => toggleControls()}
    />
    </>
  );
}

const styles = StyleSheet.create({
  centerTap: {
    position: 'absolute',
    left: '25%',
    right: '25%',
    top: '35%',
    bottom: '35%',
    zIndex: 999,
    backgroundColor: 'transparent',
  },
  pdf: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: {
    position: 'absolute',
    zIndex: 1000,
    bottom: 10,
    left: 15,
    right: 15,
    backgroundColor: 'skyblue',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 6,
    flexDirection: 'row',
  },
  buttonContainer: {
    backgroundColor: 'dimgray',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
  },
});


