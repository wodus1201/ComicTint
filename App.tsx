import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import HomeScreen from './src/screens/HomeScreen';
import PdfListScreen from './src/screens/PdfListScreen';
import { RootStackParamList } from './src/navigation/types';

enableScreens(true);

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: '시작 페이지' }} />
          <Stack.Screen name="PdfList" component={PdfListScreen} options={{ title: 'PDF 목록' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;