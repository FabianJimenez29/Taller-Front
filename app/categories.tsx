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
import { categories } from "../constants/Categories";




const Categories = () => {
  const router = useRouter();

  const handleCategoryPress = (category: any) => {
    alert(`Categoría seleccionada: ${category.name}`);
  };

  return (
    <View style={styles.container}>

      <View style={styles.logoRow}>

        <TouchableOpacity
          style={styles.languageIcon}
          onPress={() => router.push({
            pathname: "/language",
            params: { previousScreen: "/categories" }
          })}
        >
          <Ionicons name="language-outline" size={36} color="#000000" />
        </TouchableOpacity>


        <TouchableOpacity style={styles.logoContainer} onPress={() => router.push("/main")}>
          <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        </TouchableOpacity>
      </View>


      <Text style={styles.title}>Top Categorías</Text>


      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.8}
            >

              <View style={styles.imageContainer}>
                <Image source={category.image} style={styles.image} />
              </View>


              <Text style={styles.categoryName}>{category.name}</Text>


              <Text style={styles.categoryDescription}>{category.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>


      <MenuBar activeTab="categories" />
    </View>
  );
};

export default Categories;

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
  imageContainer: {
    width: 80,
    height: 80,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", 
  },
  categoryCard: {
    width: "30%",
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
  
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 8,
  },
  categoryName: {
    fontSize: 14,
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
