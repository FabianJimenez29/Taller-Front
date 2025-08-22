import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { servicios } from "../constants/Servicios";
import { sucursales } from "../constants/Sucursales";
import { useAppointment } from "../contexts/AppointmentContext";

const Resume = (): React.ReactElement => {
  const router = useRouter();
  const { appointmentData, clearAppointmentData } = useAppointment();

  const handleConfirmAppointment = () => {
    Alert.alert(
      "✅ Confirmar Cita",
      "¿Estás seguro de que quieres confirmar esta cita de reparación?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Confirmar",
          onPress: () => {
            Alert.alert(
              "🎉 ¡Cita Confirmada!",
              "Tu cita ha sido confirmada exitosamente. Recibirás una notificación con los detalles.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    clearAppointmentData();
                    router.push("/");
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleEditAppointment = () => {
    Alert.alert(
      "✏️ Editar Cita",
      "¿Qué sección quieres editar?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Información General",
          onPress: () => router.back()
        },
        {
          text: "Información Vehicular",
          onPress: () => router.back()
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificada";
    
    try {
      const date = new Date(dateString);
      const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      
      return `${days[date.getDay()]} ${date.getDate()} de ${months[date.getMonth()]} del ${date.getFullYear()}`;
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "No especificada";
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const getSucursalName = (id: string) => {
    return sucursales.find(s => s.id === id)?.nombre || id;
  };

  const getServicioName = (id: string) => {
    return servicios.find(s => s.id === id)?.nombre || id;
  };

  const getTipoPlacaName = (value: string) => {
    const tipos = {
      "particular": "Particular",
      "comercial": "Comercial",
      "publico": "Transporte Público"
    };
    return tipos[value as keyof typeof tipos] || value;
  };

  return (
    <View style={styles.container}>
      {/* ENCABEZADO */}
      <View style={styles.logoRow}>
        <TouchableOpacity 
          style={styles.languageIcon} 
          onPress={() => router.push({
            pathname: "/language",
            params: { previousScreen: "/resume" }
          })}
        >
          <Ionicons name="language-outline" size={36} color="#000000ff" />
        </TouchableOpacity>
        <View style={styles.logoCenter}>
          <TouchableOpacity style={styles.logoContainer} onPress={() => router.push("/")}>
                                <Image
                        source={require("../assets/images/logo.png")}
                        style={styles.logo}
                    />
          </TouchableOpacity>
        </View>
      </View>

      {/* TÍTULO */}
      <Text style={styles.title}>Resumen de la Cita</Text>
      <Text style={styles.subtitle}>Revisa los detalles antes de confirmar</Text>

      {/* CONTENIDO */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* INFORMACIÓN GENERAL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Información General</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🏢 Sucursal:</Text>
            <Text style={styles.infoValue}>
              {appointmentData.sucursal ? getSucursalName(appointmentData.sucursal) : "No especificada"}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🔧 Servicio:</Text>
            <Text style={styles.infoValue}>
              {appointmentData.servicio ? getServicioName(appointmentData.servicio) : "No especificado"}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📅 Fecha:</Text>
            <Text style={styles.infoValue}>
              {formatDate(appointmentData.fecha || "")}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>⏰ Hora:</Text>
            <Text style={styles.infoValue}>
              {formatTime(appointmentData.hora || "")}
            </Text>
          </View>
        </View>

        {/* INFORMACIÓN VEHICULAR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚗 Información Vehicular</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🏷️ Tipo de Placa:</Text>
            <Text style={styles.infoValue}>
              {appointmentData.tipoPlaca ? getTipoPlacaName(appointmentData.tipoPlaca) : "No especificado"}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🔢 Número de Placa:</Text>
            <Text style={styles.infoValue}>
              {appointmentData.numeroPlaca || "No especificada"}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🏭 Marca:</Text>
            <Text style={styles.infoValue}>
              {appointmentData.marca || "No especificada"}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🚙 Modelo:</Text>
            <Text style={styles.infoValue}>
              {appointmentData.modelo || "No especificado"}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>⚠️ Problema:</Text>
            <Text style={styles.infoValue}>
              {appointmentData.problema || "No especificado"}
            </Text>
          </View>
        </View>

        {/* ESTADO DE COMPLETITUD */}
        <View style={styles.completionStatus}>
          <Text style={styles.completionTitle}>Estado de Completitud</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(Object.values(appointmentData).filter(Boolean).length / 9) * 100}%` 
                }
              ]} 
            />
          </View>
          <Text style={styles.completionText}>
            {Object.values(appointmentData).filter(Boolean).length} de 9 campos completados
          </Text>
        </View>
      </ScrollView>

      {/* BOTONES INFERIORES */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={handleEditAppointment}
        >
          <Text style={styles.editButtonText}>✏️ Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.confirmButton, 
            { opacity: Object.values(appointmentData).filter(Boolean).length === 9 ? 1 : 0.5 }
          ]} 
          onPress={handleConfirmAppointment}
          disabled={Object.values(appointmentData).filter(Boolean).length !== 9}
        >
          <Text style={styles.confirmButtonText}>✅ Confirmar Cita</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Resume;

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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#E51514",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#76B414",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: "#212529",
    flex: 2,
    textAlign: "right",
    fontWeight: "500",
  },
  completionStatus: {
    backgroundColor: "#e3f2fd",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1976d2",
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 4,
  },
  completionText: {
    fontSize: 14,
    color: "#1976d2",
    fontWeight: "500",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
  },
  editButton: {
    backgroundColor: "#ffc107",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  editButtonText: {
    color: "#212529",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
