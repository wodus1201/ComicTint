import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import HomeScreen from './src/screens/HomeScreen';
import PdfListScreen from './src/screens/PdfListScreen';
import PdfViewerScreen from './src/screens/PdfViewerScreen';
import RecentFilesScreen from './src/screens/RecentFilesScreen';
import { RootStackParamList } from './src/navigation/types';

enableScreens(true);

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PdfList" component={PdfListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PdfViewer" component={PdfViewerScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RecentFiles" component={RecentFilesScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;