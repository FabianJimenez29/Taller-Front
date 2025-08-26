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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated,
{
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

const Login = (): React.ReactElement => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animaciones
  const logoScale = useSharedValue(0.8);
  const logoRotation = useSharedValue(0);
  const formSlide = useSharedValue(50);
  const buttonScale = useSharedValue(1);

  // Add debug logging for environment variables
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  console.log("🔍 Debug - BACKEND_URL:", BACKEND_URL);
  console.log("🔍 Debug - All ENV:", process.env);
  
  // Fallback if environment variable is missing
  const apiBaseUrl = BACKEND_URL || "https://backend-login-one.vercel.app/api";
  console.log("🔍 Using API URL:", apiBaseUrl);

  useEffect(() => {
    // Handle animations
    try {
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
    } catch (err) {
      console.error("🔴 Animation error:", err);
    }
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }, { rotate: `${logoRotation.value}deg` }],
  }));
  const formAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: formSlide.value }] }));
  const buttonAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: buttonScale.value }] }));

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    setIsLoading(true);

    try {
      console.log("🔍 Attempting login with API URL:", apiBaseUrl);
      
      // Use the fallback URL if needed
      const loginUrl = `${apiBaseUrl}/login`;
      console.log("🔍 Full login URL:", loginUrl);
      
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      console.log("🔍 Login response status:", res.status);
      
      const data = await res.json();
      console.log("🔍 Login response data:", JSON.stringify(data).substring(0, 200) + "...");

      setIsLoading(false);

      if (res.ok) {
        console.log("✅ Login successful");
        // Guardar token y datos del usuario completos
        await AsyncStorage.setItem("token", data.token);
        
        // Asegurarse de que todos los datos del usuario estén almacenados correctamente
        const userData = {
          id: data.user.id,
          fullName: data.user.fullName,
          email: data.user.email,
          phone: data.user.phone,
          provincia: data.user.provincia,
          canton: data.user.canton,
          distrito: data.user.distrito,
          rol: data.user.rol || data.user.role
        };
        
        console.log("🔍 Saving user data:", JSON.stringify(userData).substring(0, 200));
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        // Verificar el rol del usuario directamente desde la respuesta
        const userRole = data.user?.rol || data.user?.role;
        console.log("🔍 User role:", userRole);
        
        if (userRole === "admin") {
          Alert.alert("✅ Bienvenido Administrador", "Accediendo al panel de administración", [
            { text: "Continuar", onPress: () => router.push("/admin/mainAdmin") }
          ]);
        } else {
          Alert.alert("✅ Bienvenido", "Inicio de sesión exitoso", [
            { text: "Continuar", onPress: () => router.push("/main") }
          ]);
        }
      } else {
        console.log("❌ Login failed:", data.error || data.message);
        Alert.alert("❌ Error", data.error || data.message || "Credenciales incorrectas");
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error("🔴 Error en login:", err);
      Alert.alert(
        "❌ Error", 
        "No se pudo conectar con el servidor. Detalles: " + (err.message || String(err))
      );
    }
  };

  const handleButtonPress = () => {
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    handleLogin();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
          <Text style={styles.welcomeText}>¡Bienvenido de vuelta!</Text>
          <Text style={styles.subtitleText}>Inicia sesión para continuar</Text>
        </Animated.View>

        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          <Animated.View entering={FadeInDown.delay(300).duration(800)}>
            <Text style={styles.formTitle}>Iniciar Sesión</Text>
          </Animated.View>

          <Animated.View entering={SlideInRight.delay(400).duration(600)}>
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

          <Animated.View entering={SlideInLeft.delay(500).duration(600)}>
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
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600).duration(800)}>
            <TouchableOpacity
              style={[styles.loginButton, { opacity: isLoading ? 0.7 : 1 }]}
              onPress={handleButtonPress}
              disabled={isLoading}
            >
              <Animated.View style={buttonAnimatedStyle}>
                <Text style={styles.loginButtonText}>{isLoading ? "⏳ Iniciando..." : "🚀 Iniciar Sesión"}</Text>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(700).duration(800)}>
            <View style={styles.linksContainer}>
              <TouchableOpacity onPress={() => alert("Recuperar contraseña")}>
                <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(800).duration(800)}>
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tienes cuenta?</Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.registerLink}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

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
  loginButton: {
    backgroundColor: "#E51514",
    borderRadius: 15,
    paddingVertical: 18,
    marginBottom: 20,
    shadowColor: "#E51514",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  linksContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  linkText: {
    color: "#76B414",
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  registerText: {
    color: "#666",
    fontSize: 16,
  },
  registerLink: {
    color: "#76B414",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  testCredentials: {
    backgroundColor: "#e3f2fd",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  testTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 10,
  },
  testText: {
    fontSize: 14,
    color: "#1976d2",
    marginBottom: 5,
  },
});