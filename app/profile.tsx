import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import MenuBar from "../components/MenuBar";

const ProfileScreen = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleEditProfile = () => {
    // Aquí iría la lógica para editar el perfil
    alert("Editar perfil");
  };

  const handleLogout = () => {
    // Aquí iría la lógica para cerrar sesión
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      {/* Botón de regreso */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      {/* Foto de perfil y nombre */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={60} color="#000" />
        </View>
        <Text style={styles.userName}>Fabian J</Text>
      </View>

      {/* Tarjeta de información */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nombre:</Text>
          <Text style={styles.infoValue}>Fabian Jimenez Sandoval</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>N° Cédula:</Text>
          <Text style={styles.infoValue}>1-2345-6789</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>N° Teléfono:</Text>
          <Text style={styles.infoValue}>+506 1234-5678</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Correo Electrónico:</Text>
          <Text style={styles.infoValue}>abcdef@gmail.com</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Provincia:</Text>
          <Text style={styles.infoValue}>Guanacaste</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Cantón:</Text>
          <Text style={styles.infoValue}>Santa Cruz</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Distrito:</Text>
          <Text style={styles.infoValue}>Cartagena</Text>
        </View>
      </View>

      {/* Botón para editar información */}
      <View style={styles.editSection}>
        <Text style={styles.editText}>Necesitás Modificar Tu Información?</Text>
        <TouchableOpacity onPress={handleEditProfile}>
          <Text style={styles.editLink}>Hace Click Aquí</Text>
        </TouchableOpacity>
      </View>

      {/* Botón para cerrar sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* MENÚ INFERIOR */}
      <MenuBar activeTab="profile" />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 65, // Espacio reservado para el MenuBar
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: 30,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  infoCard: {
    backgroundColor: "#E51514",
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#fff",
  },
  editSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  editText: {
    fontSize: 16,
    color: "#000",
  },
  editLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#76B414",
    marginLeft: 5,
  },
  logoutButton: {
    backgroundColor: "#E51514",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});