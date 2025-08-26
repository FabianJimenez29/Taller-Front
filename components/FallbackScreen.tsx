import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function FallbackScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E51514" style={styles.spinner} />
      <Text style={styles.title}>Cargando aplicación</Text>
      <Text style={styles.subtitle}>Por favor espere...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  spinner: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
