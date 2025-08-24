import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import ChecklistServicio from '../../components/ChecklistServicio';

interface Cita {
  id: number;
  servicio?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientProvincia?: string;
  clientCanton?: string;
  clientDistrito?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  client_provincia?: string;
  client_canton?: string;
  client_distrito?: string;
  sucursal?: string;
  fecha?: string;
  hora?: string;
  tipo_placa?: string;
  numero_placa?: string;
  marca?: string;
  modelo?: string;
  problema?: string;
  status?: string;
  tecnico?: string;
  observaciones?: string;
}

const ProcesarCita = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const citaId = typeof params.id === 'string' ? parseInt(params.id) : 0;

  const [cita, setCita] = useState<Cita | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreAdministrador, setNombreAdministrador] = useState('');

  useEffect(() => {
    const cargarCita = async () => {
      if (!citaId) {
        Alert.alert('Error', 'ID de cita inválido');
        router.back();
        return;
      }

      try {
        // Obtener los datos del usuario/administrador
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setNombreAdministrador(user.fullName || user.full_name || '');
        }

        // Cargar los datos de la cita
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/quotes/${citaId}`);
        if (!response.ok) {
          throw new Error('No se pudo obtener la información de la cita');
        }

        const data = await response.json();
        setCita(data.quote);
      } catch (error) {
        console.error('Error al cargar la cita:', error);
        Alert.alert('Error', 'No se pudo cargar la información de la cita');
      } finally {
        setLoading(false);
      }
    };

    cargarCita();
  }, [citaId]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "No especificada";
    try {
      const parts = dateString.split("-");
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    } catch {
      return dateString;
    }
  };

  const formatUbicacion = (item: Cita | null) => {
    if (!item) return "No especificada";
    const provincia = item.client_provincia || item.clientProvincia;
    const canton = item.client_canton || item.clientCanton;
    const distrito = item.client_distrito || item.clientDistrito;
    if (!provincia && !canton && !distrito) {
      return "No especificada";
    }
    return [provincia, canton, distrito].filter(Boolean).join(", ");
  };

  const iniciarProceso = () => {
    if (!cita?.servicio) {
      Alert.alert('Error', 'No se puede iniciar el proceso sin un servicio definido');
      return;
    }
    
    setModalVisible(true);
  };

  const handleCloseChecklist = async () => {
    setModalVisible(false);
    // Recargar la información de la cita para mostrar el estado actualizado
    try {
      setLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/quotes/${citaId}`);
      if (response.ok) {
        const data = await response.json();
        setCita(data.quote);
      }
    } catch (error) {
      console.error('Error al recargar la cita:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "completado":
        return { color: "#2ecc71" };
      case "cancelado":
        return { color: "#e74c3c" };
      case "en progreso":
        return { color: "#3498db" };
      default:
        return { color: "#f39c12" };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#76B414" />
        <Text style={styles.loadingText}>Cargando información de la cita...</Text>
      </View>
    );
  }

  if (!cita) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se pudo cargar la información de la cita</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Procesar Cita #{citaId}</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {cita.servicio || "Servicio no especificado"}
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información del cliente</Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Nombre:</Text> {cita.client_name || cita.clientName || "No especificado"}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Correo:</Text> {cita.client_email || cita.clientEmail || "No especificado"}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Teléfono:</Text> {cita.client_phone || cita.clientPhone || "No especificado"}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Ubicación:</Text> {formatUbicacion(cita)}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información de la cita</Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Fecha:</Text> {formatDate(cita.fecha)}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Hora:</Text> {cita.hora || "No especificada"}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Sucursal:</Text> {cita.sucursal || "No especificada"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información del vehículo</Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Placa:</Text> {cita.tipo_placa} - {cita.numero_placa}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Marca:</Text> {cita.marca || "No especificada"}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Modelo:</Text> {cita.modelo || "No especificado"}
            </Text>
            {cita.problema && (
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Problema reportado:</Text> {cita.problema}
              </Text>
            )}
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Estado:</Text>
            <Text style={[styles.statusValue, getStatusStyle(cita.status)]}>
              {cita.status || "Pendiente"}
            </Text>
          </View>

          {cita.tecnico && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Técnico asignado</Text>
              <Text style={styles.detailText}>{cita.tecnico}</Text>
            </View>
          )}

          {cita.observaciones && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Observaciones</Text>
              <Text style={styles.detailText}>{cita.observaciones}</Text>
            </View>
          )}
        </View>

        <View style={styles.adminInfoContainer}>
          <Text style={styles.adminInfoText}>
            Administrador gestionando: {nombreAdministrador || "No especificado"}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[
            styles.processButton,
            (cita.status === "Completado" || cita.status === "Cancelado") && styles.disabledButton
          ]}
          onPress={iniciarProceso}
          disabled={cita.status === "Completado" || cita.status === "Cancelado"}
        >
          <Ionicons name="construct-outline" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.processButtonText}>
            {cita.status === "En progreso" ? "Continuar proceso" : "Iniciar proceso"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
      >
        <ChecklistServicio 
          citaId={citaId}
          servicioId={cita.servicio || ''}
          onComplete={handleCloseChecklist}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    paddingTop: Constants.statusBarHeight + 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  backIcon: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#76B414',
    marginBottom: 15,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  adminInfoContainer: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 80,
    alignItems: 'center',
  },
  adminInfoText: {
    fontSize: 14,
    color: '#2980b9',
    fontStyle: 'italic',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  processButton: {
    backgroundColor: '#76B414',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#aaa',
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 10,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    margin: 20,
  },
  backButton: {
    backgroundColor: '#E51514',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProcesarCita;
