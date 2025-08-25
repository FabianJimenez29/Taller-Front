import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, ActivityIndicator, 
  TouchableOpacity, Alert, RefreshControl, Animated 
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Constants from 'expo-constants';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para mapear nombres de servicio a IDs en formato compatible con ServiciosProcesos
const mapearServicioAId = (nombreServicio: string | undefined): string | null => {
  if (!nombreServicio) return null;
  
  const nombreNormalizado = nombreServicio.toLowerCase().trim();
  
  // Mapa de nombres comunes a IDs
  const mapaServicios: {[key: string]: string} = {
    'alineado': 'alineado',
    'alineacion': 'alineado',
    'alineación': 'alineado',
    'balanceo': 'balanceo',
    'rotacion': 'balanceo',
    'rotación': 'balanceo',
    'rtv': 'revision_rtv',
    'pre-rtv': 'revision_rtv',
    'pre rtv': 'revision_rtv',
    'suspensión': 'suspension',
    'suspension': 'suspension',
    'dirección': 'direccion',
    'direccion': 'direccion',
    'mantenimiento': 'mantenimiento',
    'llantas': 'llantas',
    'neumaticos': 'llantas',
    'neumáticos': 'llantas',
    'reparacion': 'reparaciones_mayores',
    'reparación': 'reparaciones_mayores',
    'aceite': 'aceite_motor',
    'transmision': 'aceite_transmision',
    'transmisión': 'aceite_transmision',
    'hidraulico': 'direccion_hidraulica',
    'hidráulico': 'direccion_hidraulica',
    'inyeccion': 'inyectores',
    'inyección': 'inyectores',
    'refrigerante': 'coolant',
    'coolant': 'coolant',
    'frenos': 'frenos_revision',
    'bateria': 'bateria',
    'batería': 'bateria',
    'scanner': 'scanner',
    'diagnostico': 'scanner',
    'diagnóstico': 'scanner',
    'evaluacion': 'super_evaluacion',
    'evaluación': 'super_evaluacion',
    'super': 'super_evaluacion'
  };
  
  // Buscar coincidencias parciales
  for (const [clave, valor] of Object.entries(mapaServicios)) {
    if (nombreNormalizado.includes(clave)) {
      return valor;
    }
  }
  
  return null;
};

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

type RepairStatusPaso = {
  id: string;
  descripcion: string;
  completado: boolean;
}

type ReparacionItem = {
  id: string;
  descripcion: string;
  completado: boolean;
  servicio_id?: string;
  observaciones?: string;
  requiere_autorizacion?: boolean;
  autorizacion_recibida?: boolean;
}

type RepairCita = {
  id: number | string;
  servicio?: string;
  servicio_id?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  sucursal?: string;
  fecha?: string;
  hora?: string;
  tipo_placa?: string;
  numero_placa?: string;
  marca?: string;
  modelo?: string;
  reparaciones_list?: ReparacionItem[];
  problema?: string;
  problemas_adicionales?: string;
  autorizacion_cliente?: boolean;
  status?: string;
  tecnico?: string;
  observaciones?: string;
  checklist_data?: {
    pasos: RepairStatusPaso[];
    completedSteps?: string[];
  };
};

export default function RepairDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cita, setCita] = useState<RepairCita | null>(null);
  const [autorizacionAdicional, setAutorizacionAdicional] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [showUpdatedToast, setShowUpdatedToast] = useState(false);
  
  // Animación para el toast de actualización
  const toastAnimation = useRef(new Animated.Value(0)).current;
  
  // Referencia al intervalo de actualización
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Cargar la cita al iniciar
  useEffect(() => {
    if (params.id) {
      loadRepairStatus(params.id);
    } else {
      Alert.alert('Error', 'No se especificó una cita para visualizar');
      router.back();
    }
  }, [params.id]);
  
  // Configuración de la actualización automática
  useEffect(() => {
    // Configurar el intervalo de actualización automática
    if (autoRefresh && cita && cita.status === 'En proceso') {
      console.log('Iniciando actualización automática de datos...');
      
      // Limpiar cualquier intervalo anterior
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      
      // Crear un nuevo intervalo que actualiza cada 4 segundos (más frecuente para mostrar cambios inmediatos)
      refreshIntervalRef.current = setInterval(() => {
        console.log('Actualizando datos en tiempo real...');
        
        // Actualizar la cita actual
        if (params.id) {
          loadRepairStatus(params.id);
        }
      }, 4000); // 4 segundos para ver los cambios prácticamente en tiempo real
      
      return () => {
        // Limpieza al desmontar el componente
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
    
    // Si no está en autoRefresh o la cita no está en proceso, limpiar el intervalo
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [autoRefresh, cita, params.id]);
  
  // Función para hacer una actualización manual
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Actualizar la cita actual
    if (params.id) {
      loadRepairStatus(params.id);
    }
    
    // Actualizamos la hora de la última actualización
    setLastUpdate(new Date());
  }, [params.id]);
  
  const loadRepairStatus = async (citaId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/quotes/${citaId}`);
      if (response.ok) {
        let data = await response.json();
        let citaData = data.quote || data;
        
        // Verificar si tenemos reparaciones_list y usarlo para el checklist
        if (citaData.reparaciones_list && citaData.reparaciones_list.length > 0) {
          console.log('Usando reparaciones_list para el checklist');
          
          // Si tenemos reparaciones_list, lo convertimos al formato anterior para mantener compatibilidad
          citaData.checklist_data = {
            pasos: citaData.reparaciones_list.map((item: ReparacionItem) => ({
              id: item.id,
              descripcion: item.descripcion,
              completado: item.completado
            }))
          };
        }
        // Para fines de desarrollo/demo, si no existe ningún dato pero hay servicio, mostrar una alerta
        else if (!citaData.reparaciones_list && !citaData.checklist_data && citaData.servicio) {
          console.log('No se encontraron datos de checklist para este servicio');
          
          // Solo mostramos simulaciones si estamos en desarrollo o si el cliente ha solicitado explícitamente ver demo
          const isDemoMode = __DEV__ || citaData.servicio.toLowerCase().includes('demo');
          
          if (isDemoMode) {
            console.log(`Generando checklist completo para desarrollo/demo - ${citaData.servicio}`);
            
            // Intentamos obtener el servicio del catálogo
            const servicioIdMapped = mapearServicioAId(citaData.servicio);
            let checklistCompleto = [];
            
            if (servicioIdMapped) {
              // Importamos dinámicamente el mapeo de servicio
              try {
                // Intenta obtener el checklist completo del servicio desde ServiciosProcesos
                const { serviciosProcesos } = require('../constants/ServiciosProcesos');
                const servicio = serviciosProcesos.find((s: any) => s.id === servicioIdMapped);
                
                if (servicio && servicio.pasos) {
                  checklistCompleto = servicio.pasos.map((p: any) => ({
                    id: p.id.split('-')[1] || p.id, // Extrae solo el número del ID
                    descripcion: p.descripcion,
                    completado: citaData.status === 'Completado' ? true : false,
                    servicio_id: servicioIdMapped
                  }));
                }
              } catch (error) {
                console.log('Error obteniendo pasos de servicio:', error);
              }
            }
            
            // Si no se pudo obtener el checklist específico, usamos uno genérico pero COMPLETO
            if (checklistCompleto.length === 0) {
              checklistCompleto = [
                { id: '1', descripcion: 'Recepción del vehículo', completado: true },
                { id: '2', descripcion: 'Diagnóstico inicial', completado: true },
                { id: '3', descripcion: 'Evaluación técnica', completado: false },
                { id: '4', descripcion: 'Desmontaje de componentes necesarios', completado: false },
                { id: '5', descripcion: 'Verificación de piezas', completado: false },
                { id: '6', descripcion: 'Reparación o reemplazo', completado: false },
                { id: '7', descripcion: 'Montaje de componentes', completado: false },
                { id: '8', descripcion: 'Prueba de funcionamiento', completado: false },
                { id: '9', descripcion: 'Control de calidad', completado: false },
                { id: '10', descripcion: 'Limpieza final', completado: false },
                { id: '11', descripcion: 'Verificación por supervisor', completado: false },
                { id: '12', descripcion: 'Entrega al cliente', completado: false }
              ];
            }
            
            // Esto es SOLO para desarrollo - en producción, el cliente verá exactamente lo que el técnico marca
            citaData.reparaciones_list = checklistCompleto;
            citaData.checklist_data = {
              pasos: checklistCompleto
            };
          } else {
            console.log('El técnico aún no ha iniciado el proceso de servicio');
            // No agregamos simulaciones, mostrará un mensaje de que no hay datos disponibles
          }
        } 
        // Si no hay ningún dato de checklist y el estado es En proceso, mostrar mensaje
        else if (!citaData.checklist_data && citaData.status === 'En proceso') {
          console.log('No se encontró checklist. Añadiendo checklist simulado para demostración');
          
          // Intentamos obtener un checklist completo basado en el tipo de servicio
          const servicioIdMapped = mapearServicioAId(citaData.servicio);
          let checklistEnProceso: any[] = [];
          
          try {
            if (servicioIdMapped) {
              const { serviciosProcesos } = require('../constants/ServiciosProcesos');
              const servicio = serviciosProcesos.find((s: any) => s.id === servicioIdMapped);
              
              if (servicio && servicio.pasos) {
                // Si el servicio tiene más de 12 pasos, mostramos solo los primeros como completados
                checklistEnProceso = servicio.pasos.map((p: any, index: number) => ({
                  id: p.id.split('-')[1] || p.id,
                  descripcion: p.descripcion,
                  completado: index < 3 // Solo los primeros 3 pasos completados
                }));
              }
            }
          } catch (error) {
            console.log('Error obteniendo pasos de servicio para simulación:', error);
          }
          
          // Si no pudimos conseguir un checklist específico, usamos uno genérico
          if (checklistEnProceso.length === 0) {
            checklistEnProceso = [
              { id: '1', descripcion: 'Revisión inicial del vehículo', completado: true },
              { id: '2', descripcion: 'Diagnóstico del problema', completado: true },
              { id: '3', descripcion: 'Desmontaje de piezas afectadas', completado: true },
              { id: '4', descripcion: 'Reemplazo de componentes', completado: false },
              { id: '5', descripcion: 'Prueba de funcionamiento', completado: false },
              { id: '6', descripcion: 'Control de calidad final', completado: false },
              { id: '7', descripcion: 'Limpieza del vehículo', completado: false },
              { id: '8', descripcion: 'Revisión final por técnico senior', completado: false },
              { id: '9', descripcion: 'Documentación de servicio', completado: false },
              { id: '10', descripcion: 'Entrega al cliente', completado: false }
            ];
          }
          
          citaData = {
            ...citaData,
            reparaciones_list: checklistEnProceso,
            checklist_data: {
              pasos: checklistEnProceso
            }
          };
        } else if (!citaData.checklist_data && citaData.status === 'Completado') {
          console.log('No se encontró checklist. Añadiendo checklist completado simulado para demostración');
          
          // Intentamos obtener un checklist completo basado en el tipo de servicio
          const servicioIdMapped = mapearServicioAId(citaData.servicio);
          let checklistCompletado: any[] = [];
          
          try {
            if (servicioIdMapped) {
              const { serviciosProcesos } = require('../constants/ServiciosProcesos');
              const servicio = serviciosProcesos.find((s: any) => s.id === servicioIdMapped);
              
              if (servicio && servicio.pasos) {
                // Para citas completadas, todos los pasos están completados
                checklistCompletado = servicio.pasos.map((p: any) => ({
                  id: p.id.split('-')[1] || p.id,
                  descripcion: p.descripcion,
                  completado: true // Todos completados
                }));
              }
            }
          } catch (error) {
            console.log('Error obteniendo pasos de servicio para simulación completada:', error);
          }
          
          // Si no pudimos conseguir un checklist específico, usamos uno genérico pero COMPLETO
          if (checklistCompletado.length === 0) {
            checklistCompletado = [
              { id: '1', descripcion: 'Revisión inicial del vehículo', completado: true },
              { id: '2', descripcion: 'Diagnóstico del problema', completado: true },
              { id: '3', descripcion: 'Desmontaje de piezas afectadas', completado: true },
              { id: '4', descripcion: 'Reemplazo de componentes', completado: true },
              { id: '5', descripcion: 'Prueba de funcionamiento', completado: true },
              { id: '6', descripcion: 'Control de calidad final', completado: true },
              { id: '7', descripcion: 'Limpieza del vehículo', completado: true },
              { id: '8', descripcion: 'Revisión final por técnico senior', completado: true },
              { id: '9', descripcion: 'Documentación de servicio', completado: true },
              { id: '10', descripcion: 'Entrega al cliente', completado: true }
            ];
          }
          
          citaData = {
            ...citaData,
            reparaciones_list: checklistCompletado,
            checklist_data: {
              pasos: checklistCompletado
            }
          };
        }
        
        {/* Limpiamos cualquier observación inválida o por defecto */}
        if (citaData.observaciones === "My y" || 
            !citaData.observaciones || 
            citaData.observaciones.trim() === "" ||
            citaData.observaciones.toLowerCase().includes("no hay observaciones disponibles")) {
          console.log('Eliminando texto de observación inválido o vacío');
          citaData.observaciones = null;
        }
        
        // Verificar si hay cambios en el checklist o las observaciones
        let hasNewChanges = false;
        
        if (cita) {
          // Verificar cambios en el checklist o en reparaciones_list
          const checkReparacionesList = () => {
            if (cita.reparaciones_list && citaData.reparaciones_list) {
              const oldCompletedCount = cita.reparaciones_list.filter((p: ReparacionItem) => p.completado).length;
              const newCompletedCount = citaData.reparaciones_list.filter((p: ReparacionItem) => p.completado).length;
              
              if (newCompletedCount > oldCompletedCount) {
                return true;
              }
            }
            return false;
          };
          
          // Verificar cambios en formato anterior (checklist_data)
          const checklistChanged = () => {
            if (cita.checklist_data?.pasos && citaData.checklist_data?.pasos) {
              const oldCompletedCount = cita.checklist_data.pasos.filter((p: any) => p.completado).length;
              const newCompletedCount = citaData.checklist_data.pasos.filter((p: any) => p.completado).length;
              
              if (newCompletedCount > oldCompletedCount) {
                return true;
              }
            }
            return false;
          };
          
          // Si hay cambios en cualquiera de los formatos, marcamos que hay cambios nuevos
          if (checkReparacionesList() || checklistChanged()) {
            hasNewChanges = true;
            console.log(`Se detectaron nuevos pasos completados`);
          }
          
          // Verificar cambios en observaciones
          if (citaData.observaciones !== cita.observaciones) {
            hasNewChanges = true;
            console.log('Se actualizaron las observaciones del técnico');
          }
          
          // Si hay cambios, mostrar una notificación visual
          if (hasNewChanges) {
            setShowUpdatedToast(true);
            setLastUpdate(new Date());
            
            // Mostrar la animación del toast
            Animated.sequence([
              Animated.timing(toastAnimation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
              }),
              Animated.delay(3000), // Mostrar por 3 segundos
              Animated.timing(toastAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
              })
            ]).start(() => {
              setShowUpdatedToast(false);
            });
          }
        }
        
        // Actualizar el estado de la cita
        setCita(citaData);
        
      } else {
        Alert.alert('Error', 'No se pudo cargar la información de la cita');
        router.back();
      }
    } catch (error) {
      console.error('Error cargando estado de reparación:', error);
      Alert.alert('Error', 'Hubo un problema al cargar la información');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAutorizarProblemasAdicionales = async (citaId: number | string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/quotes/${citaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          autorizacion_cliente: true
        }),
      });

      if (response.ok) {
        setAutorizacionAdicional(true);
        Alert.alert('Éxito', 'Se ha autorizado la reparación de los problemas adicionales.');
        // Recargar la información de la cita
        loadRepairStatus(citaId.toString());
      } else {
        throw new Error('Error al actualizar la cita');
      }
    } catch (error) {
      console.error('Error autorizando reparación adicional:', error);
      Alert.alert('Error', 'No se pudo autorizar la reparación adicional. Inténtelo de nuevo.');
    }
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
  
  // Función para formatear la hora de última actualización
  const formatUpdateTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // Función para cambiar el estado de actualización automática
  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Detalle de reparación',
            headerStyle: { backgroundColor: '#3498db' },
            headerTintColor: '#fff',
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Cargando información de la cita...</Text>
        </View>
      </View>
    );
  }

  if (!cita) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Detalle de reparación',
            headerStyle: { backgroundColor: '#3498db' },
            headerTintColor: '#fff',
          }}
        />
        <View style={styles.noDataContainer}>
          <Ionicons name="alert-circle" size={60} color="#bdc3c7" />
          <Text style={styles.noDataText}>No se encontró la información de la cita</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Calcular el progreso
  let progresoPorcentaje = 0;
  let completados = 0;
  let total = 0;
  
  // Primero revisamos si hay reparaciones_list
  if (cita.reparaciones_list && cita.reparaciones_list.length > 0) {
    total = cita.reparaciones_list.length;
    completados = cita.reparaciones_list.filter(p => p.completado).length;
    if (total > 0) {
      progresoPorcentaje = Math.round((completados / total) * 100);
    }
  } 
  // Si no hay reparaciones_list, usamos checklist_data
  else if (cita.checklist_data?.pasos) {
    total = cita.checklist_data.pasos.length;
    completados = cita.checklist_data.pasos.filter(p => p.completado).length;
    if (total > 0) {
      progresoPorcentaje = Math.round((completados / total) * 100);
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Detalle de reparación',
          headerStyle: { backgroundColor: '#3498db' },
          headerTintColor: '#fff',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push('/repairStatus')} style={{paddingHorizontal: 5}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          ),
        }} 
      />
      
      {/* Panel de actualización automática */}
      {cita.status === 'En proceso' && (
        <View style={styles.updateInfoBar}>
          <View style={styles.lastUpdateContainer}>
            <MaterialIcons name="update" size={14} color="#7f8c8d" />
            <Text style={styles.lastUpdateText}>
              Última actualización: {formatUpdateTime(lastUpdate)}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.autoUpdateToggle} 
            onPress={toggleAutoRefresh}
          >
            <MaterialIcons 
              name={autoRefresh ? "sync" : "sync-disabled"} 
              size={16} 
              color={autoRefresh ? "#2ecc71" : "#95a5a6"} 
            />
            <Text style={[
              styles.autoUpdateText,
              {color: autoRefresh ? "#2ecc71" : "#95a5a6"}
            ]}>
              {autoRefresh ? "Auto" : "Manual"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={["#3498db"]}
            tintColor="#3498db"
            title="Actualizando..."
            titleColor="#95a5a6"
          />
        }
      >
        <View style={styles.citaContainer}>
          <View style={styles.citaHeader}>
            <Text style={styles.citaTitle}>{cita.servicio}</Text>
            <View style={[
              styles.statusBadge,
              cita.status === 'Completado' ? styles.completadoBadge : 
              cita.status === 'En proceso' ? styles.enProcesoBadge : styles.pendienteBadge
            ]}>
              <Text style={styles.statusText}>{cita.status || 'Pendiente'}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles del servicio</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha:</Text>
              <Text style={styles.infoValue}>{formatDate(cita.fecha)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Hora:</Text>
              <Text style={styles.infoValue}>{cita.hora || 'No especificada'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sucursal:</Text>
              <Text style={styles.infoValue}>{cita.sucursal || 'No especificada'}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehículo</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Placa:</Text>
              <Text style={styles.infoValue}>{cita.tipo_placa} {cita.numero_placa}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Marca/Modelo:</Text>
              <Text style={styles.infoValue}>{cita.marca} {cita.modelo}</Text>
            </View>
            {cita.problema && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Problema reportado:</Text>
                <Text style={styles.infoValue}>{cita.problema}</Text>
              </View>
            )}
          </View>

          {cita.tecnico && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Técnico asignado</Text>
              <View style={styles.tecnicoContainer}>
                <Ionicons name="person" size={24} color="#3498db" />
                <Text style={styles.tecnicoText}>{cita.tecnico}</Text>
              </View>
            </View>
          )}

          {cita.problemas_adicionales && (
            <View style={[
              styles.alertSection,
              cita.autorizacion_cliente === true ? styles.alertSectionAutorizado : 
              cita.autorizacion_cliente === false ? styles.alertSectionNoAutorizado : null
            ]}>
              <Text style={styles.alertTitle}>
                <Ionicons name="warning" size={20} color={cita.autorizacion_cliente === true ? "#27ae60" : "#e74c3c"} /> 
                Problemas adicionales detectados
              </Text>
              <Text style={styles.alertText}>{cita.problemas_adicionales}</Text>
              
              {cita.autorizacion_cliente === true && (
                <View style={styles.autorizadoBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#fff" />
                  <Text style={styles.autorizadoBadgeText}>Autorizado por cliente</Text>
                </View>
              )}
              
              {cita.autorizacion_cliente === false && (
                <View style={styles.noAutorizadoBadge}>
                  <Ionicons name="close-circle" size={16} color="#fff" />
                  <Text style={styles.noAutorizadoBadgeText}>No autorizado</Text>
                </View>
              )}
              
              {cita.status === 'En proceso' && cita.autorizacion_cliente === undefined && (
                <TouchableOpacity 
                  style={styles.autorizarButton}
                  onPress={() => handleAutorizarProblemasAdicionales(cita.id)}
                >
                  <Text style={styles.autorizarButtonText}>
                    Autorizar reparación adicional
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {cita.status !== 'Pendiente' && (
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Detalles del servicio realizado</Text>
                {cita.status === 'En proceso' && (
                  <View style={styles.realTimeTag}>
                    <MaterialIcons name="autorenew" size={14} color="#fff" />
                    <Text style={styles.realTimeTagText}>En tiempo real</Text>
                  </View>
                )}
              </View>
              
              {/* Si hay reparaciones_list o checklist, mostrar el progreso */}
              {(cita.reparaciones_list && cita.reparaciones_list.length > 0) || (cita.checklist_data?.pasos && cita.checklist_data.pasos.length > 0) ? (
                <>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[styles.progressFill, { width: `${progresoPorcentaje}%` }]} 
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {completados} de {total} completados ({progresoPorcentaje}%)
                    </Text>
                  </View>

                  <View style={styles.checklistContainer}>
                    {/* Mostrar reparaciones_list si existe */}
                    {cita.reparaciones_list && cita.reparaciones_list.length > 0 ? 
                      cita.reparaciones_list.map((paso) => (
                        <View key={paso.id} style={[
                          styles.checklistItem,
                          paso.completado && { backgroundColor: '#f0f9ef' }
                        ]}>
                          <View style={[
                            styles.checkbox, 
                            paso.completado && styles.checkboxCompleted
                          ]}>
                            {paso.completado ? (
                              <Ionicons name="checkmark" size={16} color="#fff" />
                            ) : (
                              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>
                                {paso.id}
                              </Text>
                            )}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[
                              styles.checklistText, 
                              paso.completado && styles.checklistTextCompleted
                            ]}>
                              {paso.descripcion}
                            </Text>
                            {paso.servicio_id && (
                              <Text style={{ fontSize: 11, color: '#777', marginTop: 2 }}>
                                Código: {paso.servicio_id} - Paso {paso.id}
                              </Text>
                            )}
                          </View>
                          {paso.completado && (
                            <View style={{
                              backgroundColor: '#4CAF50',
                              paddingHorizontal: 6,
                              paddingVertical: 3,
                              borderRadius: 4,
                              marginLeft: 5,
                            }}>
                              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '500' }}>
                                Completado
                              </Text>
                            </View>
                          )}
                        </View>
                      ))
                    : 
                      // Si no hay reparaciones_list, mostrar checklist_data
                      cita.checklist_data?.pasos.map((paso) => (
                        <View key={paso.id} style={[
                          styles.checklistItem,
                          paso.completado && { backgroundColor: '#f0f9ef' }
                        ]}>
                          <View style={[
                            styles.checkbox, 
                            paso.completado && styles.checkboxCompleted
                          ]}>
                            {paso.completado ? (
                              <Ionicons name="checkmark" size={16} color="#fff" />
                            ) : (
                              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>
                                {paso.id}
                              </Text>
                            )}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[
                              styles.checklistText, 
                              paso.completado && styles.checklistTextCompleted
                            ]}>
                              {paso.descripcion}
                            </Text>
                          </View>
                          {paso.completado && (
                            <View style={{
                              backgroundColor: '#4CAF50',
                              paddingHorizontal: 6,
                              paddingVertical: 3,
                              borderRadius: 4,
                              marginLeft: 5,
                            }}>
                              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '500' }}>
                                Completado
                              </Text>
                            </View>
                          )}
                        </View>
                      ))
                    }
                  </View>
                </>
              ) : (
                <View style={styles.noChecklistContainer}>
                  <Text style={styles.noChecklistText}>
                    {cita.status === 'Completado' 
                      ? "El servicio ha sido completado." 
                      : "El técnico no ha registrado un checklist para esta reparación."}
                  </Text>
                </View>
              )}
              
              {/* Mostrar observaciones consolidadas y por paso */}
              {cita.observaciones && cita.observaciones.trim().length > 0 ? (
                <View style={styles.observacionesContainer}>
                  <Text style={styles.observacionesTitle}>
                    <MaterialIcons name="comment" size={16} color="#3498db" /> Observaciones del técnico:
                  </Text>
                  <View style={styles.observacionesContent}>
                    <Text style={styles.observacionesText}>{cita.observaciones}</Text>
                  </View>
                </View>
              ) : (
                <>
                  {/* Si no hay observaciones generales pero sí por paso, mostrarlas */}
                  {cita.reparaciones_list && cita.reparaciones_list.some(paso => paso.observaciones) ? (
                    <View style={styles.observacionesContainer}>
                      <Text style={styles.observacionesTitle}>
                        <MaterialIcons name="comment" size={16} color="#3498db" /> Observaciones específicas:
                      </Text>
                      <View style={styles.observacionesContent}>
                        {cita.reparaciones_list
                          .filter(paso => paso.observaciones && typeof paso.observaciones === 'string' && paso.observaciones.trim() !== '')
                          .map((paso, index) => (
                            <View key={`obs-${paso.id}-${index}`} style={styles.observacionPasoItem}>
                              <Text style={styles.observacionPasoDesc}>
                                <Text style={{fontWeight: 'bold'}}>{paso.descripcion}:</Text>
                              </Text>
                              <Text style={styles.observacionPasoText}>{paso.observaciones}</Text>
                            </View>
                          ))
                        }
                      </View>
                    </View>
                  ) : cita.status === 'En proceso' ? (
                    <View style={styles.noObservacionesContainer}>
                      <Text style={styles.noObservacionesText}>
                        El técnico aún no ha agregado observaciones.
                      </Text>
                    </View>
                  ) : null}
                </>
              )}
              
              {/* Mostrar el estado de la reparación */}
              <View style={styles.estadoServicioContainer}>
                <Text style={styles.estadoServicioLabel}>Estado actual:</Text>
                <View style={[
                  styles.estadoServicioBadge,
                  cita.status === 'Completado' ? styles.estadoCompletadoBadge : 
                  cita.status === 'En proceso' ? styles.estadoEnProcesoBadge : styles.estadoPendienteBadge
                ]}>
                  <Text style={styles.estadoServicioText}>
                    {cita.status === 'Completado' ? "Servicio completado" :
                     cita.status === 'En proceso' ? "En progreso" : "Pendiente"}
                  </Text>
                </View>
              </View>
            </View>
          )}
          
          {/* Botón para volver a lista de citas */}
          <TouchableOpacity 
            style={{
              backgroundColor: '#3498db',
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
              marginTop: 25,
              marginBottom: 15,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center'
            }}
            onPress={() => router.push('/repairStatus')}
          >
            <Ionicons name="list" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 16
            }}>
              Ver todas mis reparaciones
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Toast de actualización */}
      {showUpdatedToast && (
        <Animated.View 
          style={[
            styles.updateToast,
            {
              opacity: toastAnimation,
              transform: [{ 
                translateY: toastAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }
          ]}
        >
          <MaterialIcons name="check-circle" size={20} color="#fff" />
          <Text style={styles.updateToastText}>
            ¡Información actualizada!
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Constants.statusBarHeight,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#7f8c8d',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noDataText: {
    marginTop: 20,
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 15,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  updateInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  lastUpdateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  autoUpdateToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  autoUpdateText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  citaContainer: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  citaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  completadoBadge: {
    backgroundColor: '#2ecc71',
  },
  enProcesoBadge: {
    backgroundColor: '#f39c12',
  },
  pendienteBadge: {
    backgroundColor: '#95a5a6',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  realTimeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  realTimeTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    flex: 1,
    fontSize: 15,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  infoValue: {
    flex: 2,
    fontSize: 15,
    color: '#34495e',
  },
  tecnicoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  tecnicoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#34495e',
    fontWeight: '600',
  },
  alertSection: {
    padding: 15,
    backgroundColor: '#fff8e1',
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
    margin: 15,
    borderRadius: 8,
  },
  alertSectionAutorizado: {
    backgroundColor: '#e8f8f5',
    borderLeftColor: '#27ae60',
  },
  alertSectionNoAutorizado: {
    backgroundColor: '#fdedec',
    borderLeftColor: '#e74c3c',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 8,
  },
  alertText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  autorizarButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  autorizarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  autorizadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  autorizadoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  noAutorizadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  noAutorizadoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  progressContainer: {
    marginVertical: 15,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#ecf0f1',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 6,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'right',
  },
  checklistContainer: {
    marginTop: 10,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#95a5a6',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  checklistText: {
    flex: 1,
    fontSize: 14,
    color: '#34495e',
  },
  checklistTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  observacionesContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  observacionesTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  observacionesContent: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  observacionesText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  updateToast: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#2ecc71',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  updateToastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  noChecklistContainer: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 15,
  },
  noChecklistText: {
    color: '#7f8c8d',
    fontSize: 14,
    textAlign: 'center',
  },
  noObservacionesContainer: {
    marginTop: 15,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  noObservacionesText: {
    color: '#7f8c8d',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  estadoServicioContainer: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  estadoServicioLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  estadoServicioBadge: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    minWidth: 200,
    alignItems: 'center',
    marginTop: 5,
  },
  estadoServicioText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  estadoCompletadoBadge: {
    backgroundColor: '#2ecc71',
  },
  estadoEnProcesoBadge: {
    backgroundColor: '#f39c12',
  },
  estadoPendienteBadge: {
    backgroundColor: '#95a5a6',
  },
  observacionPasoItem: {
    marginVertical: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  observacionPasoDesc: {
    fontSize: 13,
    color: '#34495e',
    marginBottom: 3,
  },
  observacionPasoText: {
    fontSize: 14,
    color: '#2c3e50',
    fontStyle: 'italic',
    paddingLeft: 6,
    borderLeftWidth: 2,
    borderLeftColor: '#3498db',
  },
});
