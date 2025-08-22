import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MenuBar from "../../components/MenuBar";

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

const bannerImages = [
  require("../../assets/images/banner.png"),
  require("../../assets/images/banner2.png"),
  require("../../assets/images/banner3.png"),
  require("../../assets/images/banner4.png"),
  require("../../assets/images/banner5.png"),
  // Agrega más imágenes aquí
];

export default function App(): React.ReactElement {
  const router = useRouter(); // <--- Agrega esta línea
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const bannerWidth = 385;

  // Auto-scroll effect: solo avanza a la derecha y vuelve al inicio
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % bannerImages.length;
        scrollRef.current?.scrollTo({ x: nextIndex * bannerWidth, animated: true });
        return nextIndex;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []); // Solo se crea una vez

  // Actualiza el índice al hacer scroll manual
  const onScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / bannerWidth);
    setCurrentIndex(index);
  };

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
        <TouchableOpacity style={styles.logoutButton} onPress={() => router.push("/login")}>
          <Ionicons name="log-out-outline" size={32} color="#E51514" />
        </TouchableOpacity>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Fabian Jimenez</Text>
      </View>

      {/* BANNER DE PUBLICIDAD - Carrusel con marco redondeado y sombra externa */}
      <View style={styles.bannerShadow}>
        <View style={styles.bannerFrame}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.bannerCarousel}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {bannerImages.map((img, idx) => (
              <Image
                key={idx}
                source={img}
                style={styles.banner}
              />
            ))}
          </ScrollView>
          {/* Indicadores de página */}
          <View style={styles.carouselDots}>
            {bannerImages.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  currentIndex === idx && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* BOTONES PRINCIPALES */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/scheduleRepair")} // <--- Cambia aquí
        >
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
      <MenuBar activeTab="home" />
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
  bannerShadow: {
    alignSelf: "center",
    borderRadius: 28,
    // Sombra externa
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 18,
  },
  bannerFrame: {
    width: 385,
    height: 180,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#22222222",
  },
  bannerCarousel: {
    width: 385,
    height: 180,
  },
  banner: {
    width: 385,
    height: 180,
    resizeMode: "cover",
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
    borderRadius: 20,
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
  carouselDots: {
    position: "absolute",
    bottom: 0, // más abajo del carrusel
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#76B414",
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: "transparent", // Agrega esto
  },
  dotActive: {
    backgroundColor: "#E51514",
    borderWidth: 2,
    width: 15,
    borderColor: "transparent", // Agrega esto
  },
  logoutButton: {
    position: "absolute",
    right: 20,
    zIndex: 2,
  },
});

