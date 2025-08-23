import MenuBar from '@/components/MenuBar';
import { sucursales } from '@/constants/Sucursales';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LocationScreen() {
  const router = useRouter();


  const handleGoBack = () => {
    router.back();
  };

  const openMaps = (ubicacion: string) => {
    // Abre la ubicación en Google Maps
    Linking.openURL(ubicacion).catch(err => console.error('Error al abrir Google Maps:', err));
  };

  const openWaze = (ubicacion: string) => {
    // Extrae las coordenadas de la URL de Google Maps
    const coordMatch = ubicacion.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch && coordMatch.length >= 3) {
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
      Linking.openURL(wazeUrl).catch(err => console.error('Error al abrir Waze:', err));
    } else {
      console.error('No se pudieron extraer coordenadas de la URL');
    }
  };

  

  const callBranch = (telefono: string) => {
    
    const cleanNumber = telefono.replace(/[\s-()]/g, '');

    // Verificar que el dispositivo pueda realizar llamadas
    Linking.canOpenURL(`tel:${cleanNumber}`)
      .then(supported => {
        if (!supported) {
          Alert.alert("Error", "Este dispositivo no puede realizar llamadas");
        } else {
          return Linking.openURL(`tel:${cleanNumber}`);
        }
      })
      .catch(err => console.error("Error al realizar llamada:", err));
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.logoRow}>
        {/* Icono de idioma */}
        <TouchableOpacity
          style={styles.languageIcon}
          onPress={() => router.push({
            pathname: "/language",
            params: { previousScreen: "/location" }
          })}
        >
          <Ionicons name="language-outline" size={36} color="#000000" />
        </TouchableOpacity>

        {/* Logo centrado */}
        <TouchableOpacity style={styles.logoContainer} onPress={() => router.push("/main")}>
          <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        </TouchableOpacity>
      </View>

      {/* TÍTULO */}
      <Text style={styles.title}>Sucursales</Text>

      {/* Sucursales List */}
      <ScrollView style={styles.scrollView}>
        {sucursales.map((sucursal) => (
          <View key={sucursal.id} style={styles.branchCard}>
            <View style={styles.branchInfo}>
              <Ionicons name="location" size={24} color="#FF3B30" />
              <Text style={styles.branchName}>{sucursal.nombre}</Text>
            </View>
            <View style={styles.branchActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openMaps(sucursal.ubicacion)}
              >
                <Image source={require("../assets/images/maps.png")} style={styles.Icons} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openWaze(sucursal.ubicacion)}
              >
                <Image source={require("../assets/images/waze-icon.png")} style={styles.Icons} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => callBranch(sucursal.telefono)}
              >
                <Ionicons name="call" size={24} color="#E51514" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Menu Bar */}
      <MenuBar activeTab="location" />
    </View>
  );
}

const styles = StyleSheet.create({
  Icons: {
    
      width: 24,
      height: 24,
    
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 65, // Espacio reservado para el MenuBar
  },
  logoRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: 5,
    position: "relative",
  },
  languageIcon: {
    position: "absolute",
    left: 20,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 15,
  },
  logo: {
    marginTop: 10,
    width: 150,
    height: 50,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    width: '100%',
  },
  branchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
  },
  branchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  branchName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#000',
    flexShrink: 1,
  },
  branchActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 120,
  },
  actionButton: {
    marginLeft: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 20,
    padding: 8,
  },
});