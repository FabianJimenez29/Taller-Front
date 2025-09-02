import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import MenuBar from "../components/MenuBar";
import { getBannerImages, BannerImage } from "../lib/bannerImages";

const reviews = [
  { id: 1, text: "Excelente servicio, muy rápido y confiable." },
  { id: 2, text: "Me solucionaron el problema en menos de un día." },
  { id: 3, text: "Muy recomendado, atención al cliente de 10." },
  { id: 4, text: "Precios justos y trato amable." },
  { id: 5, text: "Volveré sin duda si tengo otro problema." },
];

// Imágenes de respaldo en caso de error o mientras se cargan las de Supabase
const fallbackBannerImages = [
  require("../assets/images/banner.png"),
  require("../assets/images/banner2.png"),
  require("../assets/images/banner3.png"),
  require("../assets/images/banner4.png"),
  require("../assets/images/banner5.png"),
];

const handleLogout = () => {
  Alert.alert(
    "Cerrar sesión",
    "¿Está seguro que desea cerrar sesión?",
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sí, cerrar sesión",
        onPress: () => {
          // Aquí puedes limpiar AsyncStorage o tokens si lo deseas
          router.push("/");
        },
      },
    ],
    { cancelable: true }
  );
};

export default function App(): React.ReactElement {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState<boolean>(true);

  const bannerWidth = 385;
  
  // Cargar imágenes del banner desde el backend o usar estáticas si hay error
  useEffect(() => {
    async function loadBannerImages() {
      setIsLoadingImages(true);
      try {
        // getBannerImages maneja internamente la lógica de fallback
        const images = await getBannerImages();
        setBannerImages(images);
      } catch (error) {
        // En caso de error extremo, usar las imágenes locales como último recurso
        setBannerImages(fallbackBannerImages.map((img, idx) => ({
          name: `banner${idx + 1}`,
          url: Image.resolveAssetSource(img).uri
        })));
      } finally {
        setIsLoadingImages(false);
      }
    }
    
    loadBannerImages();
  }, []);

  // Auto-scroll effect: solo avanza a la derecha y vuelve al inicio
  useEffect(() => {
    if (bannerImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % bannerImages.length;
        scrollRef.current?.scrollTo({ x: nextIndex * bannerWidth, animated: true });
        return nextIndex;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [bannerImages]); // Se ejecuta cuando cambia bannerImages

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
          <TouchableOpacity style={styles.logoContainer} onPress={() => router.push("/main")}> 
            <Image source={require("../assets/images/logo.png")} style={styles.logo} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}> 
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
          {isLoadingImages ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#E51514" />
              <Text style={styles.loadingText}>Cargando promociones...</Text>
            </View>
          ) : (
            <>
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
                    source={{ uri: img.url }}
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
            </>
          )}
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
            <Image source={require("../assets/images/ScheduleRepairIcon.png")} style={styles.buttonIconSchedule} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/repairStatus")}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Repair Status</Text>
            <Image source={require("../assets/images/RepairStatusIcon.png")} style={styles.buttonIconRepair} />
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
    paddingBottom: 65, // Espacio reservado para el MenuBar
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
    width: 415,
    alignSelf: "center",
    height: 150,
    gap: 20,
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
    paddingHorizontal: 20,
    marginBottom: 20, // Espacio adicional antes del MenuBar
  },
  reviewsContent: {
    backgroundColor: "#E51514",
    padding: 15,
    borderRadius: 20,
    gap: 15,
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
    width: 385,
    alignSelf: "center",
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 385,
    height: 180,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

