import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import MenuBar from "../components/MenuBar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBannerImages, BannerImage } from "../lib/bannerImages";
import { getFeaturedProducts, FeaturedProduct } from "../lib/productsService";

const reviews = [
  { id: 1, text: "Excelente servicio, muy rápido y confiable." },
  { id: 2, text: "Me solucionaron el problema en menos de un día." },
  { id: 3, text: "Muy recomendado, atención al cliente de 10." },
  { id: 4, text: "Precios justos y trato amable." },
  { id: 5, text: "Volveré sin duda si tengo otro problema." },
];


const fallbackBannerImages = [
  require("../assets/images/banner.png"),
  require("../assets/images/banner2.png"),
  require("../assets/images/banner3.png"),
  require("../assets/images/banner4.png"),
  require("../assets/images/banner5.png"),
];

const UserWelcome = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const { fullName } = JSON.parse(userData);
          setUserName(fullName || "");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  return (
    <View style={styles.textContainer}>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>{userName || "Usuario"}</Text>

    </View>
  );
};

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
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  const bannerWidth = 385;
  

  const loadBannerImages = async () => {
    setIsLoadingImages(true);
    try {

      const images = await getBannerImages();
      setBannerImages(images);
      setCurrentIndex(0); 
      scrollRef.current?.scrollTo({ x: 0, animated: true }); 
    } catch (error) {
      setBannerImages(fallbackBannerImages.map((img, idx) => ({
        name: `banner${idx + 1}`,
        url: Image.resolveAssetSource(img).uri
      })));
    } finally {
      setIsLoadingImages(false);
    }
  };

  const loadFeaturedProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const products = await getFeaturedProducts();
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error loading featured products:', error);
      setFeaturedProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };


  useEffect(() => {
    loadBannerImages();
    loadFeaturedProducts();
  }, []);


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
  }, [bannerImages]); 


  const onScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / bannerWidth);
    setCurrentIndex(index);
  };
  

  return (
    <View style={styles.container}>

      <View style={styles.logoRow}>
        <TouchableOpacity style={styles.languageIcon} onPress={() => alert("Cambiar idioma")}> 
          <Ionicons name="language-outline" size={36} color="#000000ff" />
        </TouchableOpacity>
        <View style={styles.logoCenter}>
          <TouchableOpacity 
            style={styles.logoContainer} 
            onPress={() => {

              loadBannerImages();
            }}
          > 
            <Image source={require("../assets/images/logo.png")} style={styles.logo} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}> 
          <Ionicons name="log-out-outline" size={32} color="#E51514" />
        </TouchableOpacity>
      </View>

      <UserWelcome />


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


      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/scheduleRepair")} 
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


      <ScrollView style={styles.products}>
        <View style={styles.productsContent}>
          <Text style={styles.productsTitle}>Productos Destacados</Text>
          {isLoadingProducts ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#E51514" />
              <Text style={styles.loadingText}>Cargando productos...</Text>
            </View>
          ) : featuredProducts.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.productsRow}>
                {featuredProducts.map((product) => (
                  <TouchableOpacity 
                    key={product.id} 
                    style={styles.productCard}
                    onPress={() => {

                      Alert.alert("Producto", `${product.name}\nPrecio: ₡${product.price.toLocaleString()}`);
                    }}
                  >
                    {product.image_url ? (
                      <Image 
                        source={{ uri: product.image_url }} 
                        style={styles.productImage}
                        defaultSource={require("../assets/images/logo.png")}
                      />
                    ) : (
                      <View style={styles.productImagePlaceholder}>
                        <Ionicons name="image-outline" size={40} color="#ccc" />
                      </View>
                    )}
                    <View style={styles.productInfo}>
                      <Text style={styles.productCategory}>{product.category_name}</Text>
                      <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                      <Text style={styles.productPrice}>₡{product.price.toLocaleString()}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          ) : (
            <Text style={styles.noProductsText}>No hay productos disponibles</Text>
          )}
        </View>
      </ScrollView>


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
    marginBottom: 20, 
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
  products: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  productsContent: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 20,
    minHeight: 200,
    width: 385,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#E51514",
    textAlign: "center",
  },
  productsRow: {
    flexDirection: "row",
    gap: 15,
    paddingHorizontal: 5,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    width: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: "cover",
  },
  productImagePlaceholder: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  productInfo: {
    gap: 4,
  },
  productCategory: {
    fontSize: 10,
    color: "#76B414",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E51514",
    marginTop: 4,
  },
  noProductsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
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
    bottom: 0, 
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
    borderColor: "transparent", 
  },
  dotActive: {
    backgroundColor: "#E51514",
    borderWidth: 2,
    width: 15,
    borderColor: "transparent", 
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

