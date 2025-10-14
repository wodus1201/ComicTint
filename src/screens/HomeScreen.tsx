import { useState } from 'react';
import { StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { MoonIcon, SunIcon } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <StatusBar barStyle={currentTheme === 'light' ? 'light-content' : 'dark-content'} />
      <View style={styles.centerBox}>
        <Text style={styles.title}>COMIC:TINT</Text>
        <Text style={styles.subtitle}>Comic book color tinting tool</Text>
          <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('PdfList')} activeOpacity={0.8}>
            <Text style={styles.startButtonText}>시작하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeButton} onPress={() => {
            setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
          }} activeOpacity={0.8}>
            {currentTheme === 'light' ? <SunIcon size={20} color="white" /> : <MoonIcon size={20} color="white" />}
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    margin: 0,
    color: 'dimgray',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: 'dimgray',
  },
  startButton: {
    marginBottom: 10,
    paddingHorizontal: 40,
    paddingVertical: 15,
    backgroundColor: 'skyblue',
    borderRadius: 30,
  },
  startButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  themeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 15,
    backgroundColor: 'dimgray',
    borderRadius: 30,
  },
  themeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});


