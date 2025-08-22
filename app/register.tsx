import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

  // Animaciones
  const logoScale = useSharedValue(0.8);
  const logoRotation = useSharedValue(0);
  const formSlide = useSharedValue(50);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    // Animación de entrada del logo
    logoScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    logoRotation.value = withSequence(
      withTiming(10, { duration: 1000 }),
      withTiming(-10, { duration: 1000 }),
      withTiming(0, { duration: 1000 })
    );

    // Animación del formulario
    formSlide.value = withSpring(0, { damping: 15, stiffness: 100 });

    // Animación continua del logo
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
    if (!fullName || !email || !phone || !password || !confirmPassword) {
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

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simular proceso de registro
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("✅ ¡Registro Exitoso!", "Tu cuenta ha sido creada correctamente", [
        {
          text: "Iniciar Sesión",
          onPress: () => router.push("/login"),
        },
      ]);
    }, 2000);
  };

  const handleButtonPress = () => {
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    handleRegister();
  };

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
              <TouchableOpacity onPress={() => router.push("/login")}>
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
});