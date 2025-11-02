import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

type UserData = {
  id: string | number;
  full_name?: string;
  email?: string;
  phone?: string;
  provincia?: string;
  canton?: string;
  distrito?: string;
};

const EditProfileScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);


  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [provincia, setProvincia] = useState("");
  const [canton, setCanton] = useState("");
  const [distrito, setDistrito] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      console.log('Usuario en AsyncStorage:', userStr);
      
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('Datos de usuario parseados:', user);
        
        setUserData(user);
        setFullName(user.fullName || user.full_name || "");
        setEmail(user.email || "");
        setPhone(user.phone || user.telefono || "");
        setProvincia(user.provincia || "");
        setCanton(user.canton || "");
        setDistrito(user.distrito || "");

        // Log para verificar el ID
        console.log('ID de usuario:', user.id);
        
        if (!user.id) {
          Alert.alert("Error", "No se encontró ID de usuario");
          router.back();
          return;
        }
      } else {
        Alert.alert("Error", "No se encontraron datos de usuario");
        router.back();
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      Alert.alert("Error", "No se pudo cargar la información del usuario");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userData?.id) {
      Alert.alert("Error", "No se encontró ID de usuario");
      return;
    }

    setSaving(true);
    try {
      if (!userData?.id) {
        throw new Error("ID de usuario no encontrado");
      }

      const fullUrl = `${BACKEND_URL}/user/${userData.id}`;
      console.log('Actualizando usuario:', {
        url: fullUrl,
        id: userData.id,
        fullName,
        email
      });

      const response = await fetch(fullUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          nombre: fullName,
          email,
          telefono: phone,
          provincia,
          canton,
          distrito
        }),
      });

      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Error al actualizar perfil");
      }

      if (!responseData.success || !responseData.user) {
        throw new Error("Respuesta del servidor inválida");
      }

      const updatedUser = {
        ...userData,
        ...responseData.user
      };

      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      Alert.alert("Éxito", "Perfil actualizado correctamente", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#76B414" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Editar Perfil</Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Ingrese su nombre completo"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Ingrese su correo electrónico"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Ingrese su número de teléfono"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Provincia</Text>
          <TextInput
            style={styles.input}
            value={provincia}
            onChangeText={setProvincia}
            placeholder="Ingrese su provincia"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cantón</Text>
          <TextInput
            style={styles.input}
            value={canton}
            onChangeText={setCanton}
            placeholder="Ingrese su cantón"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Distrito</Text>
          <TextInput
            style={styles.input}
            value={distrito}
            onChangeText={setDistrito}
            placeholder="Ingrese su distrito"
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.savingButton]} 
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: 100,
    marginBottom: 30,
  },
  form: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#76B414",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  savingButton: {
    backgroundColor: "#a3a3a3",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
