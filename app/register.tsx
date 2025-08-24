import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import Constants from 'expo-constants';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";
import { provincias } from "../constants/provinciasCantonesDistritos";

const Register = (): React.ReactElement => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [provincia, setProvincia] = useState("");
  const [canton, setCanton] = useState("");
  const [distrito, setDistrito] = useState("");

  // Picker temporales
  const [modalProvincia, setModalProvincia] = useState(false);
  const [modalCanton, setModalCanton] = useState(false);
  const [modalDistrito, setModalDistrito] = useState(false);
  const [tempProvincia, setTempProvincia] = useState("");
  const [tempCanton, setTempCanton] = useState("");
  const [tempDistrito, setTempDistrito] = useState("");

  // Animaciones
  const logoScale = useSharedValue(0.8);
  const logoRotation = useSharedValue(0);
  const formSlide = useSharedValue(50);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    logoRotation.value = withSequence(
      withTiming(10, { duration: 1000 }),
      withTiming(-10, { duration: 1000 }),
      withTiming(0, { duration: 1000 })
    );
    formSlide.value = withSpring(0, { damping: 15, stiffness: 100 });
    logoRotation.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 2000 }),
        withTiming(-5, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotation.value}deg` },
    ],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: formSlide.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const validateForm = () => {
    if (!fullName || !email || !phone || !password || !confirmPassword || !provincia || !canton || !distrito) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Por favor ingresa un email válido");
      return false;
    }
    return true;
  };

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const handleRegister = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, password, provincia, canton, distrito }),
      });

      const data = await res.json();

      setIsLoading(false);

      if (res.ok) {
        await AsyncStorage.setItem("token", data.token);
        Alert.alert("✅ Registro exitoso", "Tu cuenta ha sido creada", [
          { text: "Continuar", onPress: () => router.push("/") }
        ]);
      } else {
        Alert.alert("❌ Error", data.error || data.message || "Algo salió mal");
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert("❌ Error", "No se pudo conectar con el servidor");
    }
  };

  const handleButtonPress = () => {
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    handleRegister();
  };

  // Funciones para obtener cantones y distritos
  const getCantonesFromProvincia = () => {
    const provinciaObj = provincias.find((p) => p.nombre === provincia);
    return provinciaObj ? provinciaObj.cantones : [];
  };

  const getDistritosFromCanton = () => {
    const provinciaObj = provincias.find((p) => p.nombre === provincia);
    if (!provinciaObj) return [];
    const cantonObj = provinciaObj.cantones.find((c) => c.nombre === canton);
    return cantonObj ? cantonObj.distritos : [];
  };

  // Funciones para modales y confirmar
  const openProvinciaModal = () => { setTempProvincia(provincia || ""); setModalProvincia(true); };
  const openCantonModal = () => { if (provincia) { setTempCanton(canton || ""); setModalCanton(true); } };
  const openDistritoModal = () => { if (canton) { setTempDistrito(distrito || ""); setModalDistrito(true); } };
  const confirmProvincia = () => { setProvincia(tempProvincia); setCanton(""); setDistrito(""); setModalProvincia(false); };
  const confirmCanton = () => { setCanton(tempCanton); setDistrito(""); setModalCanton(false); };
  const confirmDistrito = () => { setDistrito(tempDistrito); setModalDistrito(false); };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* LOGO ANIMADO */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.welcomeText}>¡Únete a nosotros!</Text>
          <Text style={styles.subtitleText}>Crea tu cuenta para comenzar</Text>
        </Animated.View>

        {/* FORMULARIO */}
        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          <Animated.View entering={FadeInDown.delay(300).duration(800)}>
            <Text style={styles.formTitle}>Crear Cuenta</Text>
          </Animated.View>

          {/* NOMBRE COMPLETO */}
          <Animated.View entering={SlideInRight.delay(400).duration(600)}>
            <Text style={styles.label}>👤 Nombre Completo</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Tu nombre completo"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
          </Animated.View>

          {/* EMAIL */}
          <Animated.View entering={SlideInLeft.delay(450).duration(600)}>
            <Text style={styles.label}>📧 Correo Electrónico</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="tu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </Animated.View>

          {/* TELÉFONO */}
          <Animated.View entering={SlideInRight.delay(500).duration(600)}>
            <Text style={styles.label}>📱 Teléfono</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Tu número de teléfono"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </Animated.View>

          {/* CONTRASEÑA */}
          <Animated.View entering={SlideInLeft.delay(550).duration(600)}>
            <Text style={styles.label}>🔒 Contraseña</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Tu contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                textContentType="username"
                autoComplete="off"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* CONFIRMAR CONTRASEÑA */}
          <Animated.View entering={SlideInRight.delay(600).duration(600)}>
            <Text style={styles.label}>✅ Confirmar Contraseña</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                textContentType="username"
                autoComplete="off"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* PROVINCIA PICKER */}
          <Animated.View entering={SlideInLeft.delay(580).duration(600)}>
            <Text style={styles.label}>🌎 Provincia</Text>
            <TouchableOpacity
              style={styles.inputField}
              onPress={openProvinciaModal}
            >
              <Text style={{ color: (modalProvincia ? tempProvincia : provincia) ? "#222" : "#aaa" }}>
                {modalProvincia
                  ? tempProvincia || "Seleccione una provincia"
                  : provincia || "Seleccione una provincia"}
              </Text>
            </TouchableOpacity>
            <Modal visible={modalProvincia} transparent animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Seleccione una provincia</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={tempProvincia}
                      onValueChange={setTempProvincia}
                      style={{ width: '100%', height: 180 }}
                    >
                      <Picker.Item label="-- Seleccione una opción --" value="" color="#999" />
                      {provincias.map((p) => (
                        <Picker.Item key={p.nombre} label={p.nombre} value={p.nombre} color="#000" />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => setModalProvincia(false)}
                    >
                      <Text style={styles.cancelBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.confirmBtn, (!tempProvincia || tempProvincia === "") && styles.disabledBtn]}
                      onPress={confirmProvincia}
                      disabled={!tempProvincia || tempProvincia === ""}
                    >
                      <Text style={styles.confirmBtnText}>Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </Animated.View>

          {/* CANTÓN PICKER */}
          <Animated.View entering={SlideInRight.delay(600).duration(600)}>
            <Text style={styles.label}>🏙️ Cantón</Text>
            <TouchableOpacity
              style={[styles.inputField, { opacity: !provincia ? 0.5 : 1 }]}
              onPress={openCantonModal}
              disabled={!provincia}
            >
              <Text style={{ color: (modalCanton ? tempCanton : canton) ? "#222" : "#aaa" }}>
                {modalCanton
                  ? tempCanton || "Seleccione un cantón"
                  : (canton || (provincia ? "Seleccione un cantón" : "Seleccione provincia primero"))}
              </Text>
            </TouchableOpacity>
            <Modal visible={modalCanton} transparent animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Seleccione un cantón</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={tempCanton}
                      onValueChange={setTempCanton}
                      style={{ width: '100%', height: 180 }}
                    >
                      <Picker.Item label="-- Seleccione una opción --" value="" color="#999" />
                      {getCantonesFromProvincia().map((c) => (
                        <Picker.Item key={c.nombre} label={c.nombre} value={c.nombre} color="#000" />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => setModalCanton(false)}
                    >
                      <Text style={styles.cancelBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.confirmBtn, (!tempCanton || tempCanton === "") && styles.disabledBtn]}
                      onPress={confirmCanton}
                      disabled={!tempCanton || tempCanton === ""}
                    >
                      <Text style={styles.confirmBtnText}>Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </Animated.View>

          {/* DISTRITO PICKER */}
          <Animated.View entering={SlideInLeft.delay(620).duration(600)}>
            <Text style={styles.label}>🏡 Distrito</Text>
            <TouchableOpacity
              style={[styles.inputField, { opacity: !canton ? 0.5 : 1 }]}
              onPress={openDistritoModal}
              disabled={!canton}
            >
              <Text style={{ color: (modalDistrito ? tempDistrito : distrito) ? "#222" : "#aaa" }}>
                {modalDistrito
                  ? tempDistrito || "Seleccione un distrito"
                  : (distrito || (canton ? "Seleccione un distrito" : "Seleccione cantón primero"))}
              </Text>
            </TouchableOpacity>
            <Modal visible={modalDistrito} transparent animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Seleccione un distrito</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={tempDistrito}
                      onValueChange={setTempDistrito}
                      style={{ width: '100%', height: 180 }}
                    >
                      <Picker.Item label="-- Seleccione una opción --" value="" color="#999" />
                      {getDistritosFromCanton().map((d) => (
                        <Picker.Item key={d.nombre} label={d.nombre} value={d.nombre} color="#000" />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => setModalDistrito(false)}
                    >
                      <Text style={styles.cancelBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.confirmBtn, (!tempDistrito || tempDistrito === "") && styles.disabledBtn]}
                      onPress={confirmDistrito}
                      disabled={!tempDistrito || tempDistrito === ""}
                    >
                      <Text style={styles.confirmBtnText}>Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </Animated.View>

          {/* BOTÓN REGISTER */}
          <Animated.View entering={FadeInUp.delay(650).duration(800)}>
            <TouchableOpacity
              style={[
                styles.registerButton,
                { opacity: isLoading ? 0.7 : 1 },
              ]}
              onPress={handleButtonPress}
              disabled={isLoading}
            >
              <Animated.View style={buttonAnimatedStyle}>
                <Text style={styles.registerButtonText}>
                  {isLoading ? "⏳ Creando cuenta..." : "🚀 Crear Cuenta"}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>

          {/* BOTÓN LOGIN */}
          <Animated.View entering={FadeInUp.delay(700).duration(800)}>
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
              <TouchableOpacity onPress={() => router.push("/")}>
                <Text style={styles.loginLink}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>

        {/* INFORMACIÓN ADICIONAL */}
        <Animated.View entering={FadeIn.delay(800).duration(800)} style={styles.infoContainer}>
          <Text style={styles.infoTitle}>ℹ️ Información:</Text>
          <Text style={styles.infoText}>• Todos los campos son obligatorios</Text>
          <Text style={styles.infoText}>• La contraseña debe tener al menos 6 caracteres</Text>
          <Text style={styles.infoText}>• Tu información está segura con nosotros</Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 180,
    height: 60,
    resizeMode: "contain",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E51514",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 25,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    minHeight: 55,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 15,
  },
  eyeIcon: {
    padding: 5,
  },
  // Nuevo estilo para los campos picker
  inputField: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 18,
    marginBottom: 20,
    minHeight: 55,
    justifyContent: "center",
  },
  registerButton: {
    backgroundColor: "#76B414",
    borderRadius: 15,
    paddingVertical: 18,
    marginBottom: 20,
    shadowColor: "#76B414",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  loginText: {
    color: "#666",
    fontSize: 16,
  },
  loginLink: {
    color: "#E51514",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  infoContainer: {
    backgroundColor: "#fff3cd",
    borderRadius: 15,
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 10,
    textAlign: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#856404",
    marginBottom: 5,
    textAlign: "center",
  },
  // Estilos del modal actualizados
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 25,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    height: 180,
    position: 'relative',
    overflow: 'hidden',
  },
  scrollPicker: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 68, // Para centrar las opciones
  },
  pickerOption: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  selectedOption: {
    backgroundColor: 'rgba(118, 180, 20, 0.1)',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#333',
    fontWeight: '600',
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  selectionIndicator: {
    width: '90%',
    height: 44,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#76B414',
    backgroundColor: 'rgba(118, 180, 20, 0.05)',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15,
  },
  cancelBtn: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flex: 1,
  },
  cancelBtnText: {
    color: '#6c757d',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  confirmBtn: {
    backgroundColor: '#76B414',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flex: 1,
    shadowColor: '#76B414',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  disabledBtn: {
    backgroundColor: '#c8e6c9',
    shadowOpacity: 0,
    elevation: 0,
  },
});

