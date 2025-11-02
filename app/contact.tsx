import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MenuBar from "../components/MenuBar";

const ContactScreen = () => {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [provincia, setProvincia] = useState("");
  const [comentario, setComentario] = useState("");

  const handleCallCenter = () => {
    Linking.openURL("tel:+5062222-5544");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:ventas@superservicio.com");
  };

  const handleSubmit = () => {

    alert("Formulario enviado");
  };

  return (
    <View style={styles.container}>

      <View style={styles.logoRow}>

        <TouchableOpacity 
          style={styles.languageIcon} 
          onPress={() => router.push({
            pathname: "/language",
            params: { previousScreen: "/contact" }
          })}
        >
          <Ionicons name="language-outline" size={36} color="#000000" />
        </TouchableOpacity>


        <TouchableOpacity style={styles.logoContainer} onPress={() => router.push("/main")}>
          <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        </TouchableOpacity>
      </View>


      <Text style={styles.title}>Contacto</Text>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <TouchableOpacity style={styles.contactCard} onPress={handleCallCenter}>
          <Text style={styles.contactLabel}>Call Center</Text>
          <Text style={styles.contactInfo}>+506 2222-5544</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
          <Text style={styles.contactLabel}>Correo</Text>
          <Text style={styles.contactInfo}>ventas@superservicio.com</Text>
        </TouchableOpacity>


        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nombre Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese Texto Acá"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese Texto Acá"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Número De Teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese Texto Acá"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Provincia</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese Texto Acá"
              value={provincia}
              onChangeText={setProvincia}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Comentario</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ingrese Texto Acá"
              value={comentario}
              onChangeText={setComentario}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>


      <MenuBar activeTab="contact" />
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 65, 
  },
  logoRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: 5,
    position: "relative",
  },
  languageIcon: {
    position: "absolute",
    left: 20,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contactCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  contactLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  contactInfo: {
    fontSize: 18,
    color: "#000",
    fontWeight: "500",
  },
  formContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#76B414",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});