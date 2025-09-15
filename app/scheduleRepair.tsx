import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native";
import { servicios } from "../constants/Servicios";
import { sucursales } from "../constants/Sucursales";
import { useAppointment } from "../contexts/AppointmentContext";

function getFechasCita() {
  const fechas = [];
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const hoy = new Date();
  for (let i = 0; i <= 7; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    const label = `${diasSemana[fecha.getDay()]} ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
    const value = fecha.toISOString().split("T")[0];
    fechas.push({ label, value });
  }
  return fechas;
}

// Lista completa de horarios (ahora solo se usa como referencia)
const todasLasHoras = [
  { label: "08:00 AM", value: "08:00" },
  { label: "09:00 AM", value: "09:00" },
  { label: "10:00 AM", value: "10:00" },
  { label: "11:00 AM", value: "11:00" },
  { label: "12:00 PM", value: "12:00" },
  { label: "01:00 PM", value: "13:00" },
  { label: "02:00 PM", value: "14:00" },
  { label: "03:00 PM", value: "15:00" },
  { label: "04:00 PM", value: "16:00" },
];

const ScheduleRepair = (): React.ReactElement => {
  const router = useRouter();
  const { appointmentData, updateAppointmentData } = useAppointment();
  const [sucursal, setSucursal] = useState(appointmentData.sucursal || "");
  const [servicio, setServicio] = useState(appointmentData.servicio || "");
  const [fecha, setFecha] = useState(appointmentData.fecha || "");
  const [hora, setHora] = useState(appointmentData.hora || "");

  // Estados temporales para cada picker (antes de confirmar)
  const [tempSucursal, setTempSucursal] = useState("");
  const [tempServicio, setTempServicio] = useState("");
  const [tempFecha, setTempFecha] = useState("");
  const [tempHora, setTempHora] = useState("");

  // Control de modals
  const [modalSucursal, setModalSucursal] = useState(false);
  const [modalServicio, setModalServicio] = useState(false);
  const [modalFecha, setModalFecha] = useState(false);
  const [modalHora, setModalHora] = useState(false);
  
  // Estado para las horas disponibles y cargando
  const [horasDisponibles, setHorasDisponibles] = useState(todasLasHoras);
  const [cargandoHoras, setCargandoHoras] = useState(false);

  // Guardar datos en el contexto cuando cambien
  useEffect(() => {
    updateAppointmentData({ sucursal, servicio, fecha, hora });
  }, [sucursal, servicio, fecha, hora]);

  // Limpiar campos si no hay datos en el contexto
  useEffect(() => {
    if (!appointmentData.sucursal && !appointmentData.servicio && !appointmentData.fecha && !appointmentData.hora) {
      setSucursal("");
      setServicio("");
      setFecha("");
      setHora("");
    }
  }, [appointmentData]);
  
  // Efecto para cargar las horas disponibles cuando se selecciona una fecha o una sucursal
  useEffect(() => {
    if (fecha) {
      cargarHorasDisponibles();
    }
  }, [fecha, sucursal]);
  
  // Función para cargar horas disponibles
  const cargarHorasDisponibles = async () => {
    if (!fecha) return;
    
    setCargandoHoras(true);
    setHorasDisponibles([]);
    
    try {
      // Construir la URL para la consulta
      let url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/availability?fecha=${fecha}`;
      if (sucursal) {
        url += `&sucursal=${encodeURIComponent(
          sucursales.find(s => s.id === sucursal)?.nombre || ""
        )}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Error al cargar horas disponibles");
      }
      
      setHorasDisponibles(data.horasDisponibles || []);
      
      // Si la hora seleccionada ya no está disponible, la limpiamos
      if (hora && data.horasOcupadas && data.horasOcupadas.includes(hora)) {
        setHora("");
        Alert.alert(
          "⚠️ Horario no disponible", 
          "La hora que tenías seleccionada ya no está disponible. Por favor, elige otra hora.",
          [{ text: "Entendido" }]
        );
      }
    } catch (error) {
      // Si hay error, mostramos todas las horas
      setHorasDisponibles(todasLasHoras);
      Alert.alert(
        "⚠️ Error", 
        "No se pudo obtener la disponibilidad de horarios. Se mostrarán todos los horarios disponibles.",
        [{ text: "Entendido" }]
      );
    } finally {
      setCargandoHoras(false);
    }
  };

  // Funciones para abrir modals
  const openSucursalModal = () => {
    setTempSucursal(sucursal || "");
    setModalSucursal(true);
  };

  const openServicioModal = () => {
    setTempServicio(servicio || "");
    setModalServicio(true);
  };

  const openFechaModal = () => {
    setTempFecha(fecha || "");
    setModalFecha(true);
  };

  const openHoraModal = () => {
    setTempHora(hora || "");
    
    // Si tenemos fecha, asegurarnos de tener las horas actualizadas
    if (fecha) {
      cargarHorasDisponibles();
    } else {
      // Si no hay fecha, mostrar alerta
      Alert.alert(
        "⚠️ Selecciona una fecha primero", 
        "Debes seleccionar una fecha antes de elegir una hora.",
        [{ text: "Entendido" }]
      );
      return;
    }
    
    setModalHora(true);
  };

  // Funciones para confirmar selección
  const confirmSucursal = () => {
    if (tempSucursal && tempSucursal !== "") {
      setSucursal(tempSucursal);
    }
    setModalSucursal(false);
  };

  const confirmServicio = () => {
    if (tempServicio && tempServicio !== "") {
      setServicio(tempServicio);
    }
    setModalServicio(false);
  };

  const confirmFecha = () => {
    if (tempFecha && tempFecha !== "") {
      setFecha(tempFecha);
    }
    setModalFecha(false);
  };

  const confirmHora = () => {
    if (tempHora && tempHora !== "") {
      setHora(tempHora);
    }
    setModalHora(false);
  };

  return (
    <View style={styles.container}>
      {/* ENCABEZADO */}
      <View style={styles.logoRow}>
        <TouchableOpacity 
          style={styles.languageIcon} 
          onPress={() => router.push({
            pathname: "/language",
            params: { previousScreen: "/scheduleRepair" }
          })}
        >
          <Ionicons name="language-outline" size={36} color="#000000ff" />
        </TouchableOpacity>
        <View style={styles.logoCenter}>
          <TouchableOpacity style={styles.logoContainer} onPress={() => router.push("/main")}>
            <Image source={require("../assets/images/logo.png")} style={styles.logo} />
          </TouchableOpacity>
        </View>
      </View>

      {/* TÍTULO */}
      <Text style={styles.title}>Información General</Text>

      {/* FORMULARIO */}
      <View style={styles.form}>
        {/* Sucursal (Picker en Modal) */}
        <Text style={styles.label}>Sucursal</Text>
        <TouchableOpacity
          style={styles.inputField}
          onPress={openSucursalModal}
        >
          <Text style={{ color: sucursal ? "#222" : "#aaa" }}>
            {sucursal
              ? sucursales.find(s => s.id === sucursal)?.nombre
              : "Seleccione una sucursal"}
          </Text>
        </TouchableOpacity>
        <Modal visible={modalSucursal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Título del modal */}
              <Text style={styles.modalTitle}>Seleccione una sucursal</Text>
              
              {/* Picker con estilos mejorados */}
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tempSucursal}
                  onValueChange={(value) => setTempSucursal(value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem} // Solo funciona en iOS
                >
                  <Picker.Item 
                    label="-- Seleccione una opción --" 
                    value="" 
                    color="#999" 
                  />
                  {sucursales.map((s) => (
                    <Picker.Item 
                      key={s.id} 
                      label={s.nombre} 
                      value={s.id}
                      color="#000"
                    />
                  ))}
                </Picker>
              </View>
              
              {/* Botones */}
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.cancelBtn}
                  onPress={() => setModalSucursal(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.confirmBtn, (!tempSucursal || tempSucursal === "") && styles.disabledBtn]}
                  onPress={confirmSucursal}
                  disabled={!tempSucursal || tempSucursal === ""}
                >
                  <Text style={styles.confirmBtnText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Servicio (Picker en Modal) */}
        <Text style={styles.label}>Servicio</Text>
        <TouchableOpacity
          style={styles.inputField}
          onPress={openServicioModal}
        >
          <Text style={{ color: servicio ? "#222" : "#aaa" }}>
            {servicio
              ? servicios.find(s => s.id === servicio)?.nombre
              : "Seleccione un servicio"}
          </Text>
        </TouchableOpacity>
        <Modal visible={modalServicio} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccione un servicio</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tempServicio}
                  onValueChange={(value) => setTempServicio(value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item 
                    label="-- Seleccione una opción --" 
                    value="" 
                    color="#999" 
                  />
                  {servicios.map((s) => (
                    <Picker.Item 
                      key={s.id} 
                      label={s.nombre} 
                      value={s.id}
                      color="#000"
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.cancelBtn}
                  onPress={() => setModalServicio(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.confirmBtn, (!tempServicio || tempServicio === "") && styles.disabledBtn]}
                  onPress={confirmServicio}
                  disabled={!tempServicio || tempServicio === ""}
                >
                  <Text style={styles.confirmBtnText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Fecha (Picker en Modal) */}
        <Text style={styles.label}>Fecha De La Cita</Text>
        <TouchableOpacity
          style={styles.inputField}
          onPress={openFechaModal}
        >
          <Text style={{ color: fecha ? "#222" : "#aaa" }}>
            {fecha
              ? getFechasCita().find(f => f.value === fecha)?.label
              : "Seleccione una fecha"}
          </Text>
        </TouchableOpacity>
        <Modal visible={modalFecha} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccione una fecha</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tempFecha}
                  onValueChange={(value) => setTempFecha(value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item 
                    label="-- Seleccione una opción --" 
                    value="" 
                    color="#999" 
                  />
                  {getFechasCita().map((f) => (
                    <Picker.Item 
                      key={f.value} 
                      label={f.label} 
                      value={f.value}
                      color="#000"
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.cancelBtn}
                  onPress={() => setModalFecha(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.confirmBtn, (!tempFecha || tempFecha === "") && styles.disabledBtn]}
                  onPress={confirmFecha}
                  disabled={!tempFecha || tempFecha === ""}
                >
                  <Text style={styles.confirmBtnText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Hora (Picker en Modal) */}
        <Text style={styles.label}>Hora De La Cita</Text>
        <TouchableOpacity
          style={styles.inputField}
          onPress={openHoraModal}
        >
          <Text style={{ color: hora ? "#222" : "#aaa" }}>
            {hora
              ? todasLasHoras.find(h => h.value === hora)?.label
              : "Seleccione una hora"}
          </Text>
        </TouchableOpacity>
        <Modal visible={modalHora} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccione una hora</Text>
              
              {cargandoHoras ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#76B414" />
                  <Text style={styles.loadingText}>Cargando horarios disponibles...</Text>
                </View>
              ) : horasDisponibles.length === 0 ? (
                <View style={styles.noHoursContainer}>
                  <Text style={styles.noHoursText}>
                    No hay horas disponibles para esta fecha y sucursal.
                  </Text>
                  <Text style={styles.noHoursSubtext}>
                    Intenta seleccionar otra fecha o sucursal.
                  </Text>
                </View>
              ) : (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={tempHora}
                    onValueChange={(value) => setTempHora(value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item 
                      label="-- Seleccione una opción --" 
                      value="" 
                      color="#999" 
                    />
                    {horasDisponibles.map((h) => (
                      <Picker.Item 
                        key={h.value} 
                        label={h.label} 
                        value={h.value}
                        color="#000"
                      />
                    ))}
                  </Picker>
                </View>
              )}
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.cancelBtn}
                  onPress={() => setModalHora(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.confirmBtn, 
                    (cargandoHoras || horasDisponibles.length === 0 || !tempHora || tempHora === "") && styles.disabledBtn
                  ]}
                  onPress={confirmHora}
                  disabled={cargandoHoras || horasDisponibles.length === 0 || !tempHora || tempHora === ""}
                >
                  <Text style={styles.confirmBtnText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {/* BOTONES INFERIORES */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setSucursal("");
            setServicio("");
            setFecha("");
            setHora("");
            setTempSucursal("");
            setTempServicio("");
            setTempFecha("");
            setTempHora("");
            router.back();
          }}
        >
          <Text style={styles.buttonTextBottom}>Volver</Text>
        </TouchableOpacity>
        {sucursal && servicio && fecha && hora && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push("/scheduleRepairV2")}
          >
            <Text style={styles.buttonTextBottom}>Siguiente</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ScheduleRepair;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logoRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 5,
    position: "relative",
  },
  languageIcon: {
    position: "absolute",
    left: 0,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#E51514",
  },
  form: {
    marginTop: 20,
    width: "80%",
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
    justifyContent: "center",
    textAlign: "center",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '60%',
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  pickerContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 20,
    width: "95%",
    alignSelf: "center",
    ...Platform.select({
      ios: {
        height: 180, // Altura específica para iOS
      },
      android: {
        height: 50,
      },
    }),
  },
  picker: {
    width: "100%",
    ...Platform.select({
      ios: {
        height: 180,
      },
      android: {
        height: 50,
        color: "#000",
      },
    }),
  },
  pickerItem: {
    // Solo funciona en iOS
    fontSize: 16,
    height: 180,
    color: "#000",
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelBtn: {
    backgroundColor: '#E51514',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    flex: 0.45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cancelBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmBtn: {
    backgroundColor: '#76B414',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    flex: 0.45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledBtn: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
    width: "100%",
  },
  backButton: {
    backgroundColor: "#E51514",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButton: {
    backgroundColor: "#76B414",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonTextBottom: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  // Nuevos estilos para estados de carga
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    height: 180,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  noHoursContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    height: 180,
    backgroundColor: "#fff4f4",
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ffcaca",
  },
  noHoursText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 8,
  },
  noHoursSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});