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

  // Función para determinar si estamos navegando hacia adelante o hacia atrás
  const isNavigatingForward = (currentTab: string, targetTab: string): boolean => {
    const tabOrder = ['home', 'categories', 'profile', 'location', 'contact'];
    const currentIndex = tabOrder.indexOf(currentTab);
    const targetIndex = tabOrder.indexOf(targetTab);
    return targetIndex > currentIndex;
  };

  const handleTabPress = (tab: string) => {
    if (onTabPress) {
      onTabPress(tab);
    } else {
      // Si estamos en la misma pestaña, no hacemos nada
      if (activeTab === tab) return;
      
      const forward = isNavigatingForward(activeTab, tab);
      const direction = forward ? "right" : "left";
      
      // Navegación con transiciones direccionales
      switch (tab) {
          case 'home':
            router.push({
              pathname: "/main",
              params: { direction }
            });
            break;
            
          case 'categories':
            router.push({
              pathname: "/categories",
              params: { direction }
            });
            break;
            
          case 'profile':
            router.push({
              pathname: "/profile",
              params: { direction }
            });
            break;
            
          case 'location':
            router.push({
              pathname: "/location",
              params: { direction }
            });
            break;
            
          case 'contact':
            router.push({
              pathname: "/contact",
              params: { direction }
            });
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
    paddingVertical: 10,
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
