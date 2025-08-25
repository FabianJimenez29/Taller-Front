import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serviciosProcesos, ProcesoPaso } from '../../../constants/ServiciosProcesos';
import ChecklistServicio from '../../../components/ChecklistServicioSimple';
import ResumenCita from './ResumenCita';
import { fetchCitaFixed } from './fetchCita';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

type ProcesoCita = {
  id: number | string;
  servicio?: string;
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
  problemas_adicionales?: string;
  checklist_data?: {
    pasos: ProcesoPaso[];
  };
};

// Ya no necesitamos este componente, usaremos ChecklistServicio

export default function ProcesarCitaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [cita, setCita] = useState<ProcesoCita | null>(null);
  const [loading, setLoading] = useState(true);
  const [nombreTecnico, setNombreTecnico] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [problemasAdicionales, setProblemasAdicionales] = useState('');
  const [savingData, setSavingData] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [pasosProceso, setPasosProceso] = useState<ProcesoPaso[]>([]);

  useEffect(() => {
    fetchCita();
  }, [id]);

  const fetchCita = async () => {
    try {
      await fetchCitaFixed(
        id.toString(), 
        setCita, 
        setNombreTecnico, 
        setProblemasAdicionales, 
        setObservaciones, 
        setPasosProceso, 
        setCompletedSteps, 
        setLoading, 
        router, 
        BACKEND_URL, 
        serviciosProcesos,
        AsyncStorage
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información de la cita');
    }
  };

  const handleStepToggle = (stepId: string, completed: boolean) => {
    if (completed) {
      setCompletedSteps(prev => [...prev, stepId]);
    } else {
      setCompletedSteps(prev => prev.filter(id => id !== stepId));
    }
    
    // Actualizar el estado de completado en los pasos
    setPasosProceso(prev => 
      prev.map(paso => 
        paso.id === stepId ? { ...paso, completado: completed } : paso
      )
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    try {
      const parts = dateString.split('-');
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    } catch {
      return dateString;
    }
  };

  const handleSaveProgress = async () => {
    // Ya no verificamos si el nombre del técnico está vacío, porque se muestra el que viene del usuario
    // o del sistema, pero no se puede modificar
    if (!nombreTecnico.trim()) {
      setNombreTecnico("Técnico no identificado"); // Asignamos un valor por defecto
    }

    setSavingData(true);
    try {
      // Determinar si todos los pasos están completados
      const todosPasosCompletados = pasosProceso.every(paso => paso.completado);
      
      console.log('Enviando datos al servidor:', {
        url: `${BACKEND_URL}/quotes/${id}`,
        tecnico: nombreTecnico,
        status: todosPasosCompletados ? 'Completado' : 'En proceso'
      });
      
      const response = await fetch(`${BACKEND_URL}/quotes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          tecnico: nombreTecnico,
          status: todosPasosCompletados ? 'Completado' : 'En proceso',
          observaciones: observaciones.trim() || undefined,
          problemas_adicionales: problemasAdicionales.trim() || undefined,
          checklist_data: {
            pasos: pasosProceso,
            completedSteps: completedSteps
          }
        }),
      });
      
      const responseText = await response.text();
      console.log('Respuesta del servidor:', response.status, responseText);
      
      if (response.ok) {
        Alert.alert(
          'Éxito', 
          todosPasosCompletados
            ? 'Servicio completado exitosamente'
            : 'Progreso guardado exitosamente',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        throw new Error(`Error al guardar cambios: ${response.status} - ${responseText}`);
      }
    } catch (error: any) {
      console.error('Error al guardar progreso:', error);
      
      // Mostrar mensaje de error más detallado
      Alert.alert(
        'Error', 
        `No se pudo actualizar el estado de la cita: ${error.message || 'Error desconocido'}. Verifica tu conexión a internet e intenta nuevamente.`
      );
    } finally {
      setSavingData(false);
    }
  };

  const confirmarFinalizacion = () => {
    const pasosIncompletos = pasosProceso.filter(paso => !paso.completado);
    
    if (pasosIncompletos.length > 0) {
      Alert.alert(
        'Pasos incompletos',
        `Hay ${pasosIncompletos.length} pasos sin completar. Si finaliza ahora, la cita se guardará como "En proceso". ¿Desea continuar?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Guardar progreso', onPress: handleSaveProgress }
        ]
      );
    } else {
      Alert.alert(
        'Finalizar servicio',
        '¿Está seguro que desea marcar este servicio como completado?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Completar servicio', onPress: handleSaveProgress }
        ]
      );
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
  
  // Si la cita ya está completada, mostrar el componente de resumen
  if (cita.status === 'Completado') {
    return <ResumenCita cita={cita} />;
  }

  const allStepsCompleted = pasosProceso.length > 0 && 
    pasosProceso.every(paso => paso.completado || completedSteps.includes(paso.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Procesar Servicio #{id}</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {cita.servicio || "Servicio no especificado"}
          </Text>

          {/* Información del cliente */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cliente</Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Nombre:</Text> {cita.client_name || "No especificado"}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Teléfono:</Text> {cita.client_phone || "No especificado"}
            </Text>
          </View>

          {/* Información del vehículo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehículo</Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Placa:</Text> {cita.tipo_placa} {cita.numero_placa}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Marca/Modelo:</Text> {cita.marca} {cita.modelo}
            </Text>
            {cita.problema && (
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Problema Adicional Reportado:</Text> {cita.problema}
              </Text>
            )}
          </View>

          {/* Información de la cita */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles de la cita</Text>
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
        </View>

        {/* Nombre del técnico */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Técnico responsable</Text>
          <View style={styles.tecnicoReadOnly}>
            <Text style={styles.tecnicoText}>
              {nombreTecnico || "No asignado"}
            </Text>
          </View>
          
          <Text style={[styles.sectionTitle, {marginTop: 15}]}>Problemas adicionales detectados</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ingrese aquí problemas adicionales que detecte y requieran autorización del cliente"
            value={problemasAdicionales}
            onChangeText={setProblemasAdicionales}
            multiline={true}
            numberOfLines={3}
          />
          <Text style={styles.infoText}>
            Este campo será visible para el cliente y podrá autorizar estos trabajos adicionales
          </Text>
          
          <Text style={[styles.sectionTitle, {marginTop: 15}]}>Observaciones internas</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ingrese observaciones técnicas sobre el servicio (opcional)"
            value={observaciones}
            onChangeText={setObservaciones}
            multiline={true}
            numberOfLines={3}
          />
        </View>

        {/* Checklist de pasos del servicio */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pasos del servicio</Text>
          {pasosProceso.length > 0 ? (
            <ChecklistServicio
              procesos={pasosProceso}
              onToggleStep={handleStepToggle}
              completedSteps={completedSteps}
            />
          ) : (
            <Text style={styles.noProcessText}>No hay pasos definidos para este servicio</Text>
          )}
        </View>
      </ScrollView>

      {/* Botones de acción */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={savingData}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.saveButton,
            allStepsCompleted ? styles.completeButton : {},
            savingData ? styles.disabledButton : {}
          ]}
          onPress={confirmarFinalizacion}
          disabled={savingData}
        >
          {savingData ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {allStepsCompleted ? 'Completar servicio' : 'Guardar progreso'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Constants.statusBarHeight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backIcon: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#76B414',
    marginBottom: 15,
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  checklistContainer: {
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#95a5a6',
    padding: 15,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#76B414',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 50,
  },
  backButton: {
    backgroundColor: '#E51514',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 40,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noProcessText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  tecnicoReadOnly: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  tecnicoText: {
    fontSize: 16,
    color: '#333',
  },
  infoText: {
    fontSize: 12,
    color: '#3498db',
    fontStyle: 'italic',
    marginTop: 5,
    marginBottom: 10,
  },
});
