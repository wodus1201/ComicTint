import { ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/HomeScreen.style';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <ImageBackground
      source={require('../../assets/images/chainsawman-comic.jpg')}
      style={styles.container}
    >
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      />
      <StatusBar barStyle='light-content' />
      <View style={styles.centerBox}>
        <Text style={styles.title}>
          <Text style={{ fontFamily: 'VITRO CORE TTF', fontSize: 40 }}>COMIC:</Text>
          <Text style={{ fontFamily: 'Cafe24Lovingu', fontSize: 55 }}>TINT </Text>
        </Text>
        <Text style={styles.subtitle}>Comic Viewer With Color Tinting</Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('PdfList')}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>시작하기</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
