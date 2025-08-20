import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const reviews = [
  { id: 1, text: "Excelente servicio, muy rápido y confiable." },
  { id: 2, text: "Me solucionaron el problema en menos de un día." },
  { id: 3, text: "Muy recomendado, atención al cliente de 10." },
  { id: 4, text: "Precios justos y trato amable." },
  { id: 5, text: "Volveré sin duda si tengo otro problema." },
  { id: 6, text: "Volveré sin duda si tengo otro problema." },
  { id: 7, text: "Volveré sin duda si tengo otro problema." },
  { id: 8, text: "Volveré sin duda si tengo otro problema." },

];

export default function App(): React.ReactElement {
  return (
    <View style={styles.container}>
      {/* LOGO Y ICONO DE LENGUAJE */}
      <View style={styles.logoRow}>
        <TouchableOpacity style={styles.languageIcon} onPress={() => alert("Cambiar idioma")}>
          <Ionicons name="language-outline" size={36} color="#000000ff" />
        </TouchableOpacity>
        <View style={styles.logoCenter}>
          <TouchableOpacity style={styles.logoContainer} onPress={() => alert("Volver al inicio")}>
            <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.profileCircle} onPress={() => alert("Perfil de usuario")}>
          {/* Si tienes una imagen de usuario, reemplaza el Ionicons por <Image ... /> */}
          <Image
            source={require("../../assets/images/user.png")}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Fabian Jimenez</Text>
      </View>

      {/* BANNER DE PUBLICIDAD */}
      <Image
        source={require("../../assets/images/banner.png")}
        style={styles.banner}
      />

      {/* BOTONES PRINCIPALES */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => alert("Agendar reparación")}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Schedule Repair</Text>
            <Image source={require("../../assets/images/ScheduleRepairIcon.png")} style={styles.buttonIconSchedule} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => alert("Ver estado de reparación")}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Repair Status</Text>
            <Image source={require("../../assets/images/RepairStatusIcon.png")} style={styles.buttonIconRepair} />
          </View>
        </TouchableOpacity>
      </View>

      {/* RESEÑAS */}
      <ScrollView style={styles.reviews}>
        <View style={styles.reviewsContent}>
          <Text style={styles.reviewsTitle}>Reseñas</Text>
          {reviews.map((review) => (
            <Text key={review.id} style={styles.reviewText}>
              {`"${review.text}"`}
            </Text>
          ))}
        </View>
      </ScrollView>

      {/* MENÚ INFERIOR */}
      <View style={styles.menuBar}>
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={() => alert("Home")}>
            <Ionicons name="home-outline" size={32} color="#E51514" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert("Shop")}>
            <Ionicons name="cart-outline" size={32} color="#E51514" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert("Profile")}>
            <Ionicons name="person-outline" size={32} color="#E51514" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert("Store Location")}>
            <Ionicons name="location-outline" size={32} color="#E51514" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert("Contact")}>
            <Ionicons name="call-outline" size={32} color="#E51514" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
    color: "#E51514",
  },
  subtitle: {
    fontSize: 24,
    color: "#76B414",
    fontWeight: "bold",
  },
  banner: {
    width: "150%",
    height: 180,
    resizeMode: "contain",
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    height: 150,
    marginVertical: 15,
  },
  button: {
    backgroundColor: "#E51514",
    padding: 20,
    borderRadius: 15,
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    alignItems: "center",
    justifyContent: "flex-start",
    height: 140,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  buttonIconSchedule: {
    width: 110,
    height: 100,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonIconRepair: {
    marginTop: 10,
    width: 75,
    height: 75,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  reviews: {
    width: "100%",
    paddingHorizontal: 22,


  },
  reviewsContent: {
    backgroundColor: "#E51514",
    padding: 15,
    width: 385,
    borderRadius: 15,
    gap: 15,
    minHeight: 160,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
    textAlign: "center",
  },
  reviewText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#fff",
  },
  menuBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 17,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 15,
  },
  profileCircle: {
    position: "absolute",
    right: 20,
    zIndex: 2,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

