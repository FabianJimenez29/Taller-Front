import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        headerShown: false,
        tabBarStyle: {
          display: "none",
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home'
        }}
      />
      
    </Tabs>
  );
}
