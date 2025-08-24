import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const MainAdmin = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const userStr = await AsyncStorage.getItem("user");
        let name = "";
        if (userStr) {
          const user = JSON.parse(userStr);
          name = user.fullName || user.full_name || user.email || "Administrador";
        }
        setUserName(name);
      } catch {
        setUserName("Administrador");
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/");
  };

  const handleGoToQuotes = () => {
    router.push("/admin/quotes");
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#76B414" style={{ marginTop: 40 }} />
      ) : (
        <>
          <Text style={styles.welcome}>Bienvenido, {userName} 👋</Text>
          <TouchableOpacity style={styles.button} onPress={handleGoToQuotes}>
            <Text style={styles.buttonText}>Ver citas agendadas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default MainAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#76B414",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#76B414",
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 40,
    marginBottom: 20,
    shadowColor: "#76B414",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#e9ecef",
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 40,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: "#E51514",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
