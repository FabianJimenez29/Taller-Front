import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const languages = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

export default function LanguageScreen() {
  const router = useRouter();
  const { previousScreen } = useLocalSearchParams<{ previousScreen?: string }>();
  const [selectedLanguage, setSelectedLanguage] = useState("es");

  const handleContinue = () => {
    if (previousScreen) {
      router.push({ pathname: previousScreen as any });
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Selecciona un idioma</Text>
      </View>


      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.languageOption,
              selectedLanguage === item.code && styles.languageOptionSelected,
            ]}
            onPress={() => setSelectedLanguage(item.code)}
          >
            <Text
              style={[
                styles.languageText,
                selectedLanguage === item.code && styles.languageTextSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />


      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  languageOption: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  languageOptionSelected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  languageText: {
    fontSize: 16,
    color: "#000",
  },
  languageTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});