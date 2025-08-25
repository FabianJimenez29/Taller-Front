import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, ActivityIndicator, 
  TouchableOpacity, Alert, RefreshControl, Animated, Image
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Constants from 'expo-constants';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function RepairStatusScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; placa: string }>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cita, setCita] = useState<RepairCita | null>(null);
  const [autorizacionAdicional, setAutorizacionAdicional] = useState(false);
  const [historialCitas, setHistorialCitas] = useState<RepairCita[]>([]);
  const [userInfo, setUserInfo] = useState<{
    id?: string;
    email?: string;
    full_name?: string;
    phone?: string;
  } | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [showUpdatedToast, setShowUpdatedToast] = useState(false);
  
  // Animación para el toast de actualización
  const toastAnimation = useRef(new Animated.Value(0)).current;
  
  // Animación para el punto de "en vivo"
  const liveDotAnimation = useRef(new Animated.Value(1)).current;
  
  // Referencia al intervalo de actualización
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Configuración de la actualización automática
  useEffect(() => {
    // Configurar el intervalo de actualización automática
    if (autoRefresh && cita && cita.status === 'En proceso') {
      console.log('Iniciando actualización automática de datos...');
      
      // Limpiar cualquier intervalo anterior
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      
      // Crear un nuevo intervalo que actualiza cada 8 segundos para mayor fluidez
      refreshIntervalRef.current = setInterval(() => {
        console.log('Actualizando datos en tiempo real...');
        
        // Si tenemos un ID específico, actualizamos esa cita
        if (params.id) {
          loadRepairStatus(params.id);
        } 
        // Si no, refrescamos las citas del usuario actual
        else if (userInfo) {
          loadUserAppointments(userInfo);
        }
      }, 8000); // 8 segundos para una actualización más frecuente
      
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
  }, [autoRefresh, cita, userInfo, params.id]);

  // Cargar la información del usuario y sus citas al iniciar
  useEffect(() => {
    // Ya no cargamos cita individual en esta pantalla, solo el resumen de citas
    loadUserInfo();
    
    // Crear una animación pulsante para el punto "en vivo"
    Animated.loop(
      Animated.sequence([
        Animated.timing(liveDotAnimation, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(liveDotAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);
  
  // Función para hacer una actualización manual
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Si tenemos un ID específico, actualizamos esa cita
    if (params.id) {
      loadRepairStatus(params.id);
    } 
    // Si no, refrescamos las citas del usuario actual
    else if (userInfo) {
      loadUserAppointments(userInfo);
    } else {
      // Si no hay usuario, intentamos cargar la info de usuario
      loadUserInfo();
    }
    
    // Actualizamos la hora de la última actualización
    setLastUpdate(new Date());
  }, [params.id, userInfo]);
  
  // Función para cargar la información del usuario desde AsyncStorage
  const loadUserInfo = async () => {
    try {
      setLoading(true);
      
      // Obtener información del usuario de AsyncStorage
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        console.log('Usuario cargado:', user);
        setUserInfo(user);
        
        // Si tenemos el usuario, cargar sus citas
        loadUserAppointments(user);
      } else {
        console.log('No se encontró información del usuario');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al cargar información del usuario:', error);
      setLoading(false);
    }
  };
  
  // Función para cargar las citas del usuario
  const loadUserAppointments = async (user: any) => {
    try {
      // Intentamos usar el correo electrónico para identificar al usuario
      const userEmail = user.email;
      const userName = user.full_name || user.name;
      
      if (!userEmail && !userName) {
        console.log('No se encontró email o nombre para buscar citas');
        setLoading(false);
        return;
      }
      
      console.log('===== DEPURACIÓN DE CARGA DE CITAS =====');
      console.log('BACKEND_URL:', BACKEND_URL);
      console.log('Intentando cargar citas para:', userEmail || userName);
      console.log('Datos de usuario completos:', user);
      
      // Usamos el endpoint de /quotes para obtener todas las citas y filtrar localmente
      const response = await fetch(`${BACKEND_URL}/quotes`);
      console.log('Estado de respuesta:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta de citas:', data);
        
        // Las citas pueden venir en data.quotes o directamente en data como array
        const allQuotes = Array.isArray(data) ? data : (data.quotes || []);
        
        // Filtramos por email o nombre según lo que tengamos
        const citasUsuario = allQuotes.filter((cita: RepairCita) => {
          if (userEmail && cita.client_email) {
            return cita.client_email.toLowerCase() === userEmail.toLowerCase();
          }
          if (userName && cita.client_name) {
            return cita.client_name.toLowerCase().includes(userName.toLowerCase());
          }
          return false;
        });
        
        console.log('Citas filtradas para el usuario:', citasUsuario.length);
        
        if (citasUsuario.length > 0) {
          // Ordenar citas por fecha más reciente
          const citasOrdenadas = citasUsuario.sort((a: RepairCita, b: RepairCita) => {
            // Convertimos las fechas a objetos Date para comparación
            const dateA = a.fecha ? new Date(a.fecha.split('-').reverse().join('-')) : new Date(0);
            const dateB = b.fecha ? new Date(b.fecha.split('-').reverse().join('-')) : new Date(0);
            return dateB.getTime() - dateA.getTime();
          });
          
          // Guardar en historial y mostrar la más reciente
          setHistorialCitas(citasOrdenadas);
          setCita(citasOrdenadas[0]);
          
          // Actualizar la hora de la última actualización
          setLastUpdate(new Date());
        } else {
          console.log('No se encontraron citas para este usuario');
        }
      } else {
        const errorText = await response.text();
        console.error('Error en la respuesta del API:', errorText);
      }
    } catch (error) {
      console.error('Error al cargar citas del usuario:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Ya no necesitamos guardar un historial de búsquedas

  // Ya no necesitamos una función de búsqueda manual, todo se carga automáticamente

  const loadRepairStatus = async (citaId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/quotes/${citaId}`);
      if (response.ok) {
        const data = await response.json();
        const citaData = data.quote || data;
        
        // Verificar si hay cambios en el checklist o las observaciones
        let hasNewChanges = false;
        
        if (cita) {
          // Verificar cambios en reparaciones_list primero
          if (cita.reparaciones_list && citaData.reparaciones_list) {
            const oldCompletedCount = cita.reparaciones_list.filter((p: ReparacionItem) => p.completado).length;
            const newCompletedCount = citaData.reparaciones_list.filter((p: ReparacionItem) => p.completado).length;
            
            if (newCompletedCount > oldCompletedCount) {
              hasNewChanges = true;
              console.log(`Se completaron ${newCompletedCount - oldCompletedCount} nuevos pasos en reparaciones_list`);
            }
          }
          // Si no hay cambios en reparaciones_list o no existe, verificamos el checklist antiguo
          else if (cita.checklist_data?.pasos && citaData.checklist_data?.pasos) {
            const oldCompletedCount = cita.checklist_data.pasos.filter((p: any) => p.completado).length;
            const newCompletedCount = citaData.checklist_data.pasos.filter((p: any) => p.completado).length;
            
            if (newCompletedCount > oldCompletedCount) {
              hasNewChanges = true;
              console.log(`Se completaron ${newCompletedCount - oldCompletedCount} nuevos pasos en checklist_data`);
            }
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
        
        // Añadimos la cita al historial local si no existe
        setHistorialCitas(prev => {
          const exists = prev.some(c => c.id === citaData.id);
          if (!exists) {
            return [citaData, ...prev];
          } else {
            // Actualizar la cita existente en el historial
            return prev.map(c => c.id === citaData.id ? citaData : c);
          }
        });
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

  const renderCitaDetail = () => {
    if (!cita) return null;
    
    // Calcular el progreso
    let progresoPorcentaje = 0;
    let completados = 0;
    let total = 0;
    
    if (cita.checklist_data?.pasos) {
      total = cita.checklist_data.pasos.length;
      completados = cita.checklist_data.pasos.filter(p => p.completado).length;
      if (total > 0) {
        progresoPorcentaje = Math.round((completados / total) * 100);
      }
    }
    
    return (
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

        {cita.status !== 'Pendiente' && cita.checklist_data?.pasos && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Progreso del servicio</Text>
              {cita.status === 'En proceso' && (
                <View style={styles.realTimeTag}>
                  <MaterialIcons name="autorenew" size={14} color="#fff" />
                  <Text style={styles.realTimeTagText}>En tiempo real</Text>
                </View>
              )}
            </View>
            
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
              {cita.checklist_data.pasos.map((paso) => (
                <View key={paso.id} style={styles.checklistItem}>
                  <View style={[
                    styles.checkbox, 
                    paso.completado && styles.checkboxCompleted
                  ]}>
                    {paso.completado && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </View>
                  <Text style={[
                    styles.checklistText, 
                    paso.completado && styles.checklistTextCompleted
                  ]}>
                    {paso.descripcion}
                  </Text>
                </View>
              ))}
            </View>
            
            {cita.observaciones && (
              <View style={styles.observacionesContainer}>
                <Text style={styles.observacionesTitle}>
                  <MaterialIcons name="comment" size={16} color="#3498db" /> Observaciones del técnico:
                </Text>
                <View style={styles.observacionesContent}>
                  <Text style={styles.observacionesText}>{cita.observaciones}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderHistorialItem = (citaHistorial: RepairCita) => {
    // Calcular progreso si está disponible
    let progreso = "No iniciado";
    let porcentaje = 0;
    let totalPasos = 0;
    let completadosPasos = 0;
    let servicioId = "";
    
    // Primero revisamos si hay reparaciones_list
    if (citaHistorial.reparaciones_list && citaHistorial.reparaciones_list.length > 0) {
      totalPasos = citaHistorial.reparaciones_list.length;
      completadosPasos = citaHistorial.reparaciones_list.filter((p: ReparacionItem) => p.completado).length;
      if (totalPasos > 0) {
        porcentaje = Math.round((completadosPasos / totalPasos) * 100);
        progreso = `${porcentaje}% completado`;
        // Guardar el servicio_id si existe
        if (citaHistorial.reparaciones_list[0].servicio_id) {
          servicioId = citaHistorial.reparaciones_list[0].servicio_id;
        }
      }
    } 
    // Si no hay reparaciones_list, usamos el formato anterior
    else if (citaHistorial.checklist_data?.pasos) {
      totalPasos = citaHistorial.checklist_data.pasos.length;
      completadosPasos = citaHistorial.checklist_data.pasos.filter(p => p.completado).length;
      if (totalPasos > 0) {
        porcentaje = Math.round((completadosPasos / totalPasos) * 100);
        progreso = `${porcentaje}% completado`;
      }
    }
    
    // Icono según el estado
    let iconName: any = "time-outline";
    if (citaHistorial.status === 'Completado') {
      iconName = "checkmark-circle";
    } else if (citaHistorial.status === 'En proceso') {
      iconName = "construct";
    }
    
    // Obtener un resumen de las observaciones (si existen)
    let observacionesResumen = "";
    if (citaHistorial.observaciones && citaHistorial.observaciones !== "My y") {
      observacionesResumen = citaHistorial.observaciones.length > 80 
        ? citaHistorial.observaciones.substring(0, 80) + '...' 
        : citaHistorial.observaciones;
    }
    
    return (
      <TouchableOpacity 
        key={citaHistorial.id} 
        style={[
          styles.historialItem,
          citaHistorial.status === 'En proceso' && styles.historialItemActive
        ]}
        onPress={() => {
          // Para todas las citas, ir a pantalla detallada
          router.push(`/repairDetail?id=${citaHistorial.id.toString()}`);
        }}
      >
        <View style={styles.historialItemLeft}>
          <View style={[
            styles.historialIcon,
            citaHistorial.status === 'Completado' ? styles.historialIconCompleto :
            citaHistorial.status === 'En proceso' ? styles.historialIconProceso : styles.historialIconPendiente
          ]}>
            <Ionicons name={iconName} size={18} color="#fff" />
          </View>
        </View>
        
        <View style={styles.historialItemCenter}>
          <Text style={styles.historialTitle}>
            {citaHistorial.servicio || "Servicio"}
          </Text>
          <Text style={styles.historialSubtitle}>
            {citaHistorial.tipo_placa} {citaHistorial.numero_placa} • {formatDate(citaHistorial.fecha)}
          </Text>
          
          {citaHistorial.status === 'En proceso' && (
            <View style={styles.progresoContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.progresoText}>{progreso}</Text>
                {servicioId && (
                  <View style={{
                    backgroundColor: '#e8f4fd',
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 10,
                    marginLeft: 6
                  }}>
                    <Text style={{fontSize: 10, color: '#0277bd'}}>
                      Ref: {servicioId}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
                <View style={{
                  flex: 1,
                  height: 4,
                  backgroundColor: '#e0e0e0',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}>
                  <View style={{
                    width: `${porcentaje}%`,
                    height: '100%',
                    backgroundColor: porcentaje >= 100 ? '#43a047' : '#fb8c00',
                    borderRadius: 2
                  }} />
                </View>
                {citaHistorial.observaciones && citaHistorial.observaciones !== "My y" && (
                  <View style={styles.observacionBadge}>
                    <MaterialIcons name="comment" size={12} color="#fff" />
                    <Text style={styles.observacionBadgeText}>Nuevas notas</Text>
                  </View>
                )}
              </View>
            </View>
          )}
          
          {/* Mostrar resumen de observaciones para citas completadas */}
          {citaHistorial.status === 'Completado' && observacionesResumen && (
            <View style={styles.observacionesResumen}>
              <Text style={styles.observacionesResumenText} numberOfLines={2}>
                "{observacionesResumen}"
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.historialItemRight}>
          <View style={[
            styles.historialStatus,
            citaHistorial.status === 'Completado' ? styles.historialCompleto :
            citaHistorial.status === 'En proceso' ? styles.historialProceso : styles.historialPendiente
          ]}>
            <Text style={styles.historialStatusText}>
              {citaHistorial.status || "Pendiente"}
            </Text>
          </View>
          <MaterialIcons 
            name="chevron-right" 
            size={22} 
            color="#bdc3c7"
            style={{marginTop: 5}} 
          />
        </View>
      </TouchableOpacity>
    );
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

  return (
    <View style={styles.container}>
      {/* HEADER PERSONALIZADO CON LOGO Y BOTONES */}
      <View style={styles.logoRow}>
        <TouchableOpacity 
          style={styles.languageIcon} 
          onPress={() => router.push({
            pathname: "/language",
            params: { previousScreen: "/repairStatus" }
          })}
        >
          <Ionicons name="language-outline" size={36} color="#000000ff" />
        </TouchableOpacity>
        <View style={styles.logoCenter}>
          <TouchableOpacity style={styles.logoContainer} onPress={() => router.push("/main")}>
            <Image source={require("../assets/images/logo.png")} style={styles.logo} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={32} color="#E51514" />
        </TouchableOpacity>
      </View>
      
      {/* Ocultamos el header por defecto */}
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />

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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Cargando sus citas...</Text>
          </View>
        ) : historialCitas.length > 0 ? (
          <View style={styles.citasContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderTitle}>Mis reparaciones</Text>
              <Text style={styles.sectionHeaderSubtitle}>
                {historialCitas.length} {historialCitas.length === 1 ? 'cita' : 'citas'} encontradas
              </Text>
            </View>
            
            {/* Panel informativo para citas en proceso */}
            {historialCitas.some(c => c.status === 'En proceso') && (
              <View style={styles.infoPanel}>
                <Animated.View style={[
                  styles.liveDot, 
                  { opacity: liveDotAnimation }
                ]}></Animated.View>
                <MaterialIcons name="info-outline" size={20} color="#3498db" />
                <Text style={styles.infoPanelText}>
                  Tienes reparaciones en proceso. Toca para ver detalles en tiempo real.
                </Text>
              </View>
            )}
            
            {/* Listado de todas las citas */}
            {historialCitas.map(renderHistorialItem)}
            
            {/* Botón para agendar nueva cita */}
            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={() => router.push('/scheduleRepair')}
            >
              <Text style={styles.scheduleButtonText}>
                Agendar nueva cita
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="car" size={60} color="#bdc3c7" />
            {userInfo ? (
              <>
                <Text style={styles.noDataText}>
                  No se encontraron citas asociadas a su cuenta
                </Text>
                <Text style={styles.noDataSubText}>
                  Usuario: {userInfo.full_name || userInfo.email || 'Usuario no identificado'}
                </Text>
              </>
            ) : (
              <Text style={styles.noDataText}>
                Por favor inicie sesión para ver sus citas
              </Text>
            )}
            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={() => router.push('/scheduleRepair')}
            >
              <Text style={styles.scheduleButtonText}>
                Agendar una cita
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/register')}
            >
              <Text style={styles.loginButtonText}>
                {userInfo ? 'Actualizar datos' : 'Iniciar sesión'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
  logoRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: 15,
    position: "relative",
  },
  languageIcon: {
    position: "absolute",
    left: 20,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  logoCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  logoutButton: {
    position: "absolute",
    right: 20,
    zIndex: 2,
  },
  headerUserInfo: {
    paddingHorizontal: 10,
  },
  headerUserText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#7f8c8d',
  },
  noDataContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    marginTop: 20,
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 10,
  },
  noDataSubText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  scheduleButton: {
    backgroundColor: '#76B414',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginTop: 15,
    alignItems: 'center',
    width: '80%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    width: '80%',
  },
  loginButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 16,
  },
  citaContainer: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
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
    backgroundColor: '#76B414',
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
  historialContainer: {
    margin: 15,
    marginTop: 5,
  },
  historialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  historialItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historialSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  historialStatus: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  historialStatusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  historialCompleto: {
    backgroundColor: '#2ecc71',
  },
  historialProceso: {
    backgroundColor: '#f39c12',
  },
  historialPendiente: {
    backgroundColor: '#95a5a6',
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
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#E51514',
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
  citasContainer: {
    padding: 15,
  },
  sectionHeader: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    paddingBottom: 10,
  },
  sectionHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E51514',
  },
  sectionHeaderSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  infoPanel: {
    backgroundColor: '#ffe1e1',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#E51514',
  },
  infoPanelText: {
    color: '#E51514',
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  historialItemActive: {
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  historialItemLeft: {
    marginRight: 12,
  },
  historialItemCenter: {
    flex: 1,
  },
  historialItemRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  historialIcon: {
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historialIconCompleto: {
    backgroundColor: '#2ecc71',
  },
  historialIconProceso: {
    backgroundColor: '#f39c12',
  },
  historialIconPendiente: {
    backgroundColor: '#95a5a6',
  },
  progresoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  progresoText: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '500',
  },
  observacionBadge: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginLeft: 8,
  },
  observacionBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  observacionesResumen: {
    marginTop: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  observacionesResumenText: {
    fontSize: 12,
    color: '#34495e',
    fontStyle: 'italic',
  },
  liveDot: {
    width: 8,
    height: 8,
    backgroundColor: '#e74c3c',
    borderRadius: 4,
    marginRight: 8,
    position: 'relative',
  },
});
