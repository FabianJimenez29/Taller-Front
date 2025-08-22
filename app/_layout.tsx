import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AppointmentProvider } from '../contexts/AppointmentContext';
import { LanguageProvider } from '../contexts/LanguageContext';


// Componente personalizado para manejar las animaciones de navegación
function CustomStack() {
  const params = useLocalSearchParams<{ direction?: string }>();
  const direction = params.direction;
  
  // Determinar la animación basada en el parámetro de dirección
  const getAnimation = () => {
    if (direction === 'left') {
      return 'slide_from_left';
    } else {
      return 'slide_from_right';
    }
  };
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: getAnimation(),
        animationDuration: 300,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="scheduleRepair" />
      <Stack.Screen name="scheduleRepairV2" />
      <Stack.Screen name="resume" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="location" />
      <Stack.Screen name="contact" />
      <Stack.Screen name="language" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <LanguageProvider>
      <AppointmentProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <CustomStack />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AppointmentProvider>
    </LanguageProvider>
  );
}