import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorBoundary from '../components/ErrorBoundary';
import FallbackScreen from '../components/FallbackScreen';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AppointmentProvider } from '../contexts/AppointmentContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { NavigationAnimations } from '../constants/NavigationAnimations';
import { Colors } from '../constants/Colors';


// Componente personalizado para manejar las animaciones de navegación
function CustomStack() {
  const params = useLocalSearchParams<{ direction?: string }>();
  const direction = params.direction;
  
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
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
        animation: getAnimation() as any,
        animationDuration: 300,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: theme.textInverse,
        headerTitleStyle: {
          fontWeight: 'bold',
        }
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
      <Stack.Screen name="admin" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  // Make the font loading optional to prevent app crash
  // First attempt to load fonts normally
  
  // Log application startup information for debugging
  useEffect(() => {
    
    
    // Check for AsyncStorage token
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
      } catch (e) {
        console.error("🔴 AsyncStorage error:", e);
      }
    };
    
    checkToken();
    
    return () => {
      console.log("🚪 RootLayout unmounting");
    };
  }, []);

  

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppointmentProvider>
          <ThemeProvider value={colorScheme === 'dark' ? {
            ...DarkTheme,
            colors: {
              ...DarkTheme.colors,
              primary: Colors.dark.primary,
              background: Colors.dark.background,
              card: Colors.dark.card,
              text: Colors.dark.text,
              border: Colors.dark.border,
            }
          } : {
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              primary: Colors.light.primary,
              background: Colors.light.background,
              card: Colors.light.card,
              text: Colors.light.text,
              border: Colors.light.border,
            }
          }}>
            <CustomStack />
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </ThemeProvider>
        </AppointmentProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}