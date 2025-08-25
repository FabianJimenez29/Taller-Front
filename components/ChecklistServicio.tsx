import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProcesoPaso, ProcesoServicio, getProcesosServicio, mapServicioIdToProcesosId, serviciosProcesos } from '../constants/ServiciosProcesos';

interface ChecklistServicioProps {
  citaId?: number | string;
  servicioId?: string;
  onComplete?: () => void;
  onCancel?: () => void;
  procesos?: ProcesoPaso[];
  onToggleStep?: (id: string, completed: boolean) => void;
  completedSteps?: string[];
}

const ChecklistServicio = ({ citaId, servicioId, onComplete, onCancel }: ChecklistServicioProps) => {
  const router = useRouter();
  const [pasos, setPasos] = useState<ProcesoPaso[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [nombreServicio, setNombreServicio] = useState('');
  const [nombreTecnico, setNombreTecnico] = useState('');
  const [observacionesGenerales, setObservacionesGenerales] = useState('');
  
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Mapear el ID del servicio al ID en ServiciosProcesos
        if (!servicioId) {
          Alert.alert('Error', 'No se proporcionó el ID del servicio');
          onCancel && onCancel();
          setLoading(false);
          return;
        }
        const procesoId = mapServicioIdToProcesosId(servicioId);

        // Obtener los procesos del servicio
        const servicio = getProcesosServicio(procesoId);
        if (servicio) {
          setNombreServicio(servicio.nombre);
          setPasos(servicio.pasos);
        } else {
          Alert.alert('Error', 'No se encontró la información del servicio');
          onCancel && onCancel();
        }

        // Intentar cargar datos guardados previamente
        const datosGuardados = await AsyncStorage.getItem(`checklist-${citaId}`);
        if (datosGuardados) {
          const datos = JSON.parse(datosGuardados);
          setPasos(datos.pasos);
          setNombreTecnico(datos.nombreTecnico || '');
          setObservacionesGenerales(datos.observacionesGenerales || '');
        }

        // Obtener nombre del técnico de AsyncStorage si existe
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.fullName && !nombreTecnico) {
            setNombreTecnico(user.fullName);
          }
        }
      } catch (error) {
        console.error('Error al cargar los datos del checklist:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos del checklist');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [citaId, servicioId]);

  const actualizarPaso = (id: string, cambios: Partial<ProcesoPaso>) => {
    setPasos(pasosActuales => 
      pasosActuales.map(paso => 
        paso.id === id ? { ...paso, ...cambios } : paso
      )
    );
  };

  const guardarChecklist = async () => {
    if (!nombreTecnico.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingrese el nombre del técnico');
      return;
    }

    try {
      setGuardando(true);
      
      // Guardar datos del checklist
      const datosGuardar = {
        citaId,
        servicioId,
        nombreServicio,
        nombreTecnico,
        observacionesGenerales,
        pasos,
        fechaActualizacion: new Date().toISOString(),
        completado: pasos.every(paso => paso.completado)
      };
      
      await AsyncStorage.setItem(`checklist-${citaId}`, JSON.stringify(datosGuardar));
      
      // Actualizar estado de la cita en el backend
      const estadoCompletado = pasos.every(paso => paso.completado);
      
      try {
        // Preparar los datos en formato reparaciones_list para el nuevo formato
        const reparaciones_list = pasos.map(paso => ({
          id: paso.id,
          descripcion: paso.descripcion,
          completado: paso.completado,
          servicio_id: servicioId,
          observaciones: paso.observaciones || null,
          requiere_autorizacion: paso.requiereAutorizacion || false,
          autorizacion_recibida: paso.autorizacionRecibida || false
        }));
        
        // Construir observaciones consolidadas para mayor compatibilidad
        let observacionesConsolidadas = observacionesGenerales || "";
        
        // Añadir observaciones específicas de cada paso a las observaciones generales
        const observacionesPasos = pasos
            .filter(paso => paso.observaciones && paso.observaciones.trim() !== "")
            .map(paso => `[${paso.descripcion}]: ${paso.observaciones}`);
        
        if (observacionesPasos.length > 0) {
          if (observacionesConsolidadas) {
            observacionesConsolidadas += "\n\n=== Observaciones específicas ===\n";
          }
          observacionesConsolidadas += observacionesPasos.join("\n");
        }
        
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/quotes/${citaId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: estadoCompletado ? 'Completado' : 'En proceso',
            tecnico: nombreTecnico,
            observaciones: observacionesConsolidadas, // Enviamos observaciones consolidadas
            checklist_data: {
              ...datosGuardar,
              observaciones: observacionesConsolidadas  // También las incluimos aquí
            },
            reparaciones_list: reparaciones_list, // Enviamos TODOS los pasos del checklist en el nuevo formato
            servicio_id: servicioId // Aseguramos que el servicio_id esté guardado
          }),
        });
        
        if (!response.ok) {
          throw new Error('Error al actualizar la cita en el servidor');
        }
      } catch (error) {
        console.error('Error al guardar en el servidor:', error);
        Alert.alert(
          'Advertencia', 
          'Los datos se han guardado localmente, pero no se pudieron sincronizar con el servidor.'
        );
      }
      
      Alert.alert(
        'Éxito', 
        'Checklist guardado correctamente',
        [{ text: 'OK', onPress: onComplete }]
      );
    } catch (error) {
      console.error('Error al guardar el checklist:', error);
      Alert.alert('Error', 'No se pudo guardar el checklist');
    } finally {
      setGuardando(false);
    }
  };

  const confirmarFinalizacion = () => {
    const pasosIncompletos = pasos.filter(paso => !paso.completado);
    
    if (pasosIncompletos.length > 0) {
      Alert.alert(
        'Pasos incompletos',
        `Hay ${pasosIncompletos.length} pasos sin completar. ¿Desea finalizar de todas formas?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Finalizar', onPress: guardarChecklist }
        ]
      );
    } else {
      guardarChecklist();
    }
  };

  const renderPasoItem = ({ item }: { item: ProcesoPaso }) => {
    return (
      <View style={styles.pasoContainer}>
        <View style={styles.pasoHeader}>
          <Switch
            value={item.completado}
            onValueChange={(value) => actualizarPaso(item.id, { completado: value })}
            trackColor={{ false: '#d1d1d1', true: '#81b0ff' }}
            thumbColor={item.completado ? '#2196F3' : '#f4f3f4'}
          />
          <Text style={[
            styles.pasoTexto, 
            item.completado ? styles.pasoCompletado : {}
          ]}>
            {item.descripcion}
          </Text>
        </View>
        
        {item.requiereAutorizacion && (
          <View style={styles.autorizacionContainer}>
            <Text style={styles.autorizacionLabel}>¿Autorizado por cliente?</Text>
            <Switch
              value={item.autorizacionRecibida}
              onValueChange={(value) => actualizarPaso(item.id, { autorizacionRecibida: value })}
              trackColor={{ false: '#d1d1d1', true: '#81b0ff' }}
              thumbColor={item.autorizacionRecibida ? '#2196F3' : '#f4f3f4'}
            />
          </View>
        )}
        
        <TextInput
          style={styles.observacionesInput}
          placeholder="Observaciones (opcional)"
          multiline
          value={item.observaciones}
          onChangeText={(text) => actualizarPaso(item.id, { observaciones: text })}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#76B414" />
        <Text style={styles.loadingText}>Cargando checklist...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{nombreServicio}</Text>
        <Text style={styles.headerSubtitle}>Checklist de servicio</Text>
      </View>
      
      <View style={styles.tecnicoContainer}>
        <Text style={styles.tecnicoLabel}>Técnico responsable:</Text>
        <TextInput
          style={styles.tecnicoInput}
          placeholder="Ingrese su nombre completo"
          value={nombreTecnico}
          onChangeText={setNombreTecnico}
        />
      </View>
      
      <Text style={styles.instrucciones}>
        Complete cada paso del checklist y marque las casillas correspondientes
      </Text>
      
      <FlatList
        data={pasos}
        renderItem={renderPasoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
      <View style={styles.observacionesGeneralesContainer}>
        <Text style={styles.observacionesGeneralesLabel}>Observaciones generales:</Text>
        <TextInput
          style={styles.observacionesGeneralesInput}
          placeholder="Ingrese observaciones generales del servicio"
          multiline
          value={observacionesGenerales}
          onChangeText={setObservacionesGenerales}
        />
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={onCancel}
          disabled={guardando}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]}
          onPress={confirmarFinalizacion}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Guardar y finalizar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  centeredContainer: {
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  tecnicoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tecnicoLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    color: '#333',
  },
  tecnicoInput: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 16,
  },
  instrucciones: {
    fontSize: 15,
    marginBottom: 15,
    color: '#666',
    fontStyle: 'italic',
  },
  listContainer: {
    paddingBottom: 20,
  },
  pasoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pasoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pasoTexto: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
    color: '#333',
  },
  pasoCompletado: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  autorizacionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  autorizacionLabel: {
    fontSize: 14,
    color: '#333',
  },
  observacionesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    minHeight: 40,
  },
  observacionesGeneralesContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  observacionesGeneralesLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  observacionesGeneralesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 15,
    minHeight: 80,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#E51514',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#76B414',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChecklistServicio;
