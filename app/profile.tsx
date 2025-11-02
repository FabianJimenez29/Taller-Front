import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,  View,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MenuBar from "../components/MenuBar";

const ProfileScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    provincia: "",
    canton: "",
    distrito: "",
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserData({
          fullName: user.fullName || user.full_name || "",
          email: user.email || "",
          phone: user.phone || "",
          provincia: user.provincia || "",
          canton: user.canton || "",
          distrito: user.distrito || "",
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleEditProfile = () => {
    router.push('/editProfile');
  };

  const handleLogout = () => {

    router.push("/");
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#76B414" style={styles.loader} />
      ) : (
        <>

          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={60} color="#000" />
            </View>
            <Text style={styles.userName}>{userData.fullName}</Text>
          </View>


          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre:</Text>
              <Text style={styles.infoValue}>{userData.fullName || "No especificado"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>N° Teléfono:</Text>
              <Text style={styles.infoValue}>{userData.phone || "No especificado"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Correo Electrónico:</Text>
              <Text style={styles.infoValue}>{userData.email || "No especificado"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Provincia:</Text>
              <Text style={styles.infoValue}>{userData.provincia || "No especificado"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cantón:</Text>
              <Text style={styles.infoValue}>{userData.canton || "No especificado"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Distrito:</Text>
              <Text style={styles.infoValue}>{userData.distrito || "No especificado"}</Text>
            </View>
          </View>
        </>
      )}


      <View style={styles.editSection}>
        <Text style={styles.editText}>Necesitás Modificar Tu Información?</Text>
        <TouchableOpacity onPress={handleEditProfile}>
          <Text style={styles.editLink}>Hace Click Aquí</Text>
        </TouchableOpacity>
      </View>


      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <MenuBar activeTab="profile" />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 65, 
  },
  loader: {
    marginTop: 100,
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
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginHorizontal: 48,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 1,
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