import { useState } from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/HomeScreen.style';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MoonIcon, SunIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const safeAreaInsets = useSafeAreaInsets();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <StatusBar barStyle={currentTheme === 'light' ? 'light-content' : 'dark-content'} />
      <View style={styles.centerBox}>
        <Text style={styles.title}>COMIC:TINT</Text>
        <Text style={styles.subtitle}>Comic book color tinting tool</Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('PdfList')}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>시작하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.themeButton}
          onPress={() => {
            setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
          }}
          activeOpacity={0.8}
        >
          {currentTheme === 'light' ? (
            <SunIcon size={20} color='white' />
          ) : (
            <MoonIcon size={20} color='white' />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
