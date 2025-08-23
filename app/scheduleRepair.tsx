import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { servicios } from "../constants/Servicios";
import { sucursales } from "../constants/Sucursales";
import { useAppointment } from "../contexts/AppointmentContext";

function getFechasCita() {
  const fechas = [];
  const diasSemana = [, "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const hoy = new Date();
  for (let i = 0; i <= 7; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    if (fecha.getDay() !== 0) {
      // Excluye domingos
      const label = `${diasSemana[fecha.getDay()]} ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
      const value = fecha.toISOString().split("T")[0];
      fechas.push({ label, value });
    }
  }
  return fechas;
}

const horasCita = [
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
              ? horasCita.find(h => h.value === hora)?.label
              : "Seleccione una hora"}
          </Text>
        </TouchableOpacity>
        <Modal visible={modalHora} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccione una hora</Text>
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
                  {horasCita.map((h) => (
                    <Picker.Item 
                      key={h.value} 
                      label={h.label} 
                      value={h.value}
                      color="#000"
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.cancelBtn}
                  onPress={() => setModalHora(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.confirmBtn, (!tempHora || tempHora === "") && styles.disabledBtn]}
                  onPress={confirmHora}
                  disabled={!tempHora || tempHora === ""}
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
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  form: {
    marginTop: 20,
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
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    width: "80%",
    alignSelf: "center"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '60%',
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
    borderRadius: 10,
    flex: 0.45,
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
    borderRadius: 10,
    flex: 0.45,
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
    borderRadius: 10,
  },
  nextButton: {
    backgroundColor: "#76B414",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  buttonTextBottom: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});