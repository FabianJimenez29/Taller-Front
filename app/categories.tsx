import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MenuBar from "../components/MenuBar";

// Datos de las categorías (las imágenes las agregarás tú)
const categories = [
  {
    id: 1,
    name: "Baterías",
    icon: "battery-charging-outline",
    description: "Baterías para vehículos"
  },
  {
    id: 2,
    name: "Frenos",
    icon: "disc-outline",
    description: "Discos, pastillas y sistemas de frenado"
  },
  {
    id: 3,
    name: "Llantas",
    icon: "ellipse-outline",
    description: "Neumáticos y ruedas"
  },
  {
    id: 4,
    name: "Lubricantes",
    icon: "water-outline",
    description: "Aceites y fluidos"
  },
  {
    id: 5,
    name: "Limpieza",
    icon: "sparkles-outline",
    description: "Productos de limpieza automotriz"
  },
  {
    id: 6,
    name: "Filtros",
    icon: "funnel-outline",
    description: "Filtros de aceite, aire y combustible"
  },
  {
    id: 7,
    name: "Amortiguadores",
    icon: "resize-outline",
    description: "Suspensión y amortiguación"
  },
  {
    id: 8,
    name: "Refrigerante",
    icon: "thermometer-outline",
    description: "Líquidos refrigerantes"
  },
  {
    id: 9,
    name: "Accesorios",
    icon: "construct-outline",
    description: "Accesorios y repuestos varios"
  }
];

const Categories = () => {
  const router = useRouter();

  const handleCategoryPress = (category: any) => {
    // Aquí puedes navegar a la lista de productos de esa categoría
    // Por ahora solo muestra un alert
    alert(`Categoría seleccionada: ${category.name}`);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.logoRow}>
        {/* Icono de idioma */}
        <TouchableOpacity style={styles.languageIcon} onPress={() => alert("Cambiar idioma")}>
          <Ionicons name="language-outline" size={36} color="#000000" />
        </TouchableOpacity>

        {/* Logo centrado */}
        <View style={styles.logoCenter}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
            />
          </View>
        </View>
      </View>

      {/* TÍTULO */}
      <Text style={styles.title}>Top Categorías</Text>

      {/* GRID DE CATEGORÍAS */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.8}
            >
              {/* Imagen de la categoría */}
                              <View style={styles.imageContainer}>
                  <Ionicons name={category.icon as any} size={40} color="#000000" />
                </View>
              
              {/* Nombre de la categoría */}
              <Text style={styles.categoryName}>{category.name}</Text>
              
              {/* Descripción */}
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* MENÚ INFERIOR */}
      <MenuBar activeTab="categories" />
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
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
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  categoryCard: {
    width: "30%", // 3 columnas con espacio entre ellas
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  imageContainer: {
    width: "100%",
    height: 80,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 6,
  },
  categoryDescription: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    lineHeight: 16,
  },
});
