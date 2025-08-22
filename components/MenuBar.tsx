import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface MenuBarProps {
  activeTab?: 'home' | 'categories' | 'profile' | 'location' | 'contact';
  onTabPress?: (tab: string) => void;
  showHome?: boolean;
  showCategories?: boolean;
  showProfile?: boolean;
  showLocation?: boolean;
  showContact?: boolean;
}

const MenuBar: React.FC<MenuBarProps> = ({
  activeTab = 'home',
  onTabPress,
  showHome = true,
  showCategories = true,
  showProfile = true,
  showLocation = true,
  showContact = true,
}) => {
  const router = useRouter();

  const handleTabPress = (tab: string) => {
    if (onTabPress) {
      onTabPress(tab);
    } else {
      // Navegación jerárquica inteligente
      switch (tab) {
        case 'home':
          // Siempre volver al origen (izquierda)
          router.back();
          break;
        case 'categories':
          // Si estamos en home, ir hacia la derecha
          if (activeTab === 'home') {
            router.push("/categories");
          } else {
            // Desde cualquier otra pantalla, volver al origen primero
            router.push("/");
          }
          break;
        case 'profile':
          // Si estamos en home o categories, ir hacia la derecha
          if (activeTab === 'home' || activeTab === 'categories') {
            router.push("/profile");
          } else {
            // Desde location o contact, volver a categories primero
            if (activeTab === 'location' || activeTab === 'contact') {
              router.push("/categories");
            } else {
              router.push("/profile");
            }
          }
          break;
        case 'location':
          // Si estamos en home, categories o profile, ir hacia la derecha
          if (activeTab === 'home' || activeTab === 'categories' || activeTab === 'profile') {
            router.push("/location");
          } else {
            // Desde contact, volver a profile primero
            router.push("/profile");
          }
          break;
        case 'contact':
          // Si estamos en home, categories, profile o location, ir hacia la derecha
          if (activeTab === 'home' || activeTab === 'categories' || activeTab === 'profile' || activeTab === 'location') {
            router.push("/contact");
          } else {
            // Ya estamos en contact
            break;
          }
          break;
      }
    }
  };

  const getIconColor = (tab: string) => {
    return activeTab === tab ? "#E51514" : "#76B414";
  };

  const getIconName = (tab: string, isActive: boolean) => {
    const suffix = isActive ? "" : "-outline";
    
    switch (tab) {
      case 'home':
        return `home${suffix}`;
      case 'categories':
        return `cart${suffix}`;
      case 'profile':
        return `person${suffix}`;
      case 'location':
        return `location${suffix}`;
      case 'contact':
        return `call${suffix}`;
      default:
        return `home${suffix}`;
    }
  };

  return (
    <View style={styles.menuBar}>
      <View style={styles.menuContainer}>
        {showHome && (
          <TouchableOpacity 
            onPress={() => handleTabPress('home')}
            style={styles.tabButton}
          >
            <Ionicons 
              name={getIconName('home', activeTab === 'home') as any} 
              size={32} 
              color={getIconColor('home')} 
            />
          </TouchableOpacity>
        )}

        {showCategories && (
          <TouchableOpacity 
            onPress={() => handleTabPress('categories')}
            style={styles.tabButton}
          >
            <Ionicons 
              name={getIconName('categories', activeTab === 'categories') as any} 
              size={32} 
              color={getIconColor('categories')} 
            />
          </TouchableOpacity>
        )}

        {showProfile && (
          <TouchableOpacity 
            onPress={() => handleTabPress('profile')}
            style={styles.tabButton}
          >
            <Ionicons 
              name={getIconName('profile', activeTab === 'profile') as any} 
              size={32} 
              color={getIconColor('profile')} 
            />
          </TouchableOpacity>
        )}

        {showLocation && (
          <TouchableOpacity 
            onPress={() => handleTabPress('location')}
            style={styles.tabButton}
          >
            <Ionicons 
              name={getIconName('location', activeTab === 'location') as any} 
              size={32} 
              color={getIconColor('location')} 
            />
          </TouchableOpacity>
        )}

        {showContact && (
          <TouchableOpacity 
            onPress={() => handleTabPress('contact')}
            style={styles.tabButton}
          >
            <Ionicons 
              name={getIconName('contact', activeTab === 'contact') as any} 
              size={32} 
              color={getIconColor('contact')} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MenuBar;

const styles = StyleSheet.create({
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
    zIndex: 1000,
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 15,
  },
  tabButton: {
    padding: 8,
    borderRadius: 8,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
