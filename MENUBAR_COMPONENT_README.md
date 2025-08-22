# 🎯 Componente MenuBar Reutilizable

Este componente proporciona un menú de navegación inferior que puedes usar en cualquier pantalla de tu aplicación.

## ✨ **Características:**

### **🎨 Diseño Visual:**
- **5 iconos de navegación**: Home, Categorías, Perfil, Ubicación, Contacto
- **Colores dinámicos**: Rojo activo (`#E51514`), Verde inactivo (`#76B414`)
- **Iconos adaptativos**: Outline cuando no está activo, sólido cuando está activo
- **Posicionamiento absoluto**: Siempre en la parte inferior de la pantalla

### **🔧 Funcionalidad:**
- **Navegación automática**: Usa `router.push()` para navegar entre pantallas
- **Callbacks personalizables**: Puedes sobrescribir la navegación por defecto
- **Tabs configurables**: Puedes mostrar/ocultar cualquier tab
- **Estado activo**: Indica visualmente qué pantalla está activa

## 📱 **Uso Básico:**

### **1. Importar el Componente:**
```tsx
import MenuBar from "../components/MenuBar";
```

### **2. Usar en tu Pantalla:**
```tsx
// Pantalla de inicio
<MenuBar activeTab="home" />

// Pantalla de categorías
<MenuBar activeTab="categories" />

// Pantalla de perfil
<MenuBar activeTab="profile" />
```

## 🎛️ **Props Disponibles:**

### **activeTab** (opcional)
- **Tipo**: `'home' | 'categories' | 'profile' | 'location' | 'contact'`
- **Default**: `'home'`
- **Descripción**: Define qué tab está activo (rojo)

```tsx
<MenuBar activeTab="categories" />
```

### **onTabPress** (opcional)
- **Tipo**: `(tab: string) => void`
- **Descripción**: Callback personalizado para manejar los clicks

```tsx
<MenuBar 
  activeTab="home"
  onTabPress={(tab) => {
    console.log(`Tab presionado: ${tab}`);
    // Tu lógica personalizada aquí
  }}
/>
```

### **showHome, showCategories, showProfile, showLocation, showContact** (opcional)
- **Tipo**: `boolean`
- **Default**: `true` (todos visibles)
- **Descripción**: Controla qué tabs se muestran

```tsx
// Solo mostrar home y categorías
<MenuBar 
  activeTab="home"
  showProfile={false}
  showLocation={false}
  showContact={false}
/>
```

## 🚀 **Ejemplos de Uso:**

### **Ejemplo 1: Uso Básico**
```tsx
import MenuBar from "../components/MenuBar";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Tu contenido aquí */}
      
      <MenuBar activeTab="home" />
    </View>
  );
};
```

### **Ejemplo 2: Con Navegación Personalizada**
```tsx
const ProfileScreen = () => {
  const handleTabPress = (tab: string) => {
    switch (tab) {
      case 'home':
        router.push("/");
        break;
      case 'categories':
        router.push("/categories");
        break;
      case 'profile':
        // Ya estamos en perfil, no hacer nada
        break;
      case 'location':
        router.push("/location");
        break;
      case 'contact':
        router.push("/contact");
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tu contenido aquí */}
      
      <MenuBar 
        activeTab="profile"
        onTabPress={handleTabPress}
      />
    </View>
  );
};
```

### **Ejemplo 3: Menú Mínimo**
```tsx
const SimpleScreen = () => {
  return (
    <View style={styles.container}>
      {/* Tu contenido aquí */}
      
      <MenuBar 
        activeTab="home"
        showCategories={false}
        showProfile={false}
        showLocation={false}
        showContact={false}
      />
    </View>
  );
};
```

## 🎨 **Personalización de Estilos:**

### **Colores:**
```tsx
// En components/MenuBar.tsx, cambiar:
const getIconColor = (tab: string) => {
  return activeTab === tab ? "#tuColorActivo" : "#tuColorInactivo";
};
```

### **Tamaños:**
```tsx
// En styles, modificar:
tabButton: {
  padding: 12,        // Más padding
  minWidth: 50,       // Más ancho
  borderRadius: 12,   // Bordes más redondeados
},
```

### **Posición:**
```tsx
menuBar: {
  position: "absolute",
  bottom: 20,         // Más separado del borde
  left: 20,           // Con márgenes laterales
  right: 20,
  borderRadius: 20,   // Bordes redondeados
},
```

## 🔗 **Navegación por Defecto:**

Si no proporcionas `onTabPress`, el componente usa esta navegación:

- **Home** → `router.push("/")`
- **Categories** → `router.push("/categories")`
- **Profile** → `alert("Perfil")`
- **Location** → `alert("Ubicación de la tienda")`
- **Contact** → `alert("Contacto")`

## 📱 **Pantallas donde se Usa:**

### **✅ Ya Implementado:**
- **`/` (Home)**: `activeTab="home"`
- **`/categories`**: `activeTab="categories"`

### **🚀 Para Implementar:**
- **`/profile`**: `activeTab="profile"`
- **`/location`**: `activeTab="location"`
- **`/contact`**: `activeTab="contact"`

## 🎯 **Ventajas del Componente:**

✅ **Reutilizable**: Úsalo en cualquier pantalla  
✅ **Consistente**: Mismo diseño en toda la app  
✅ **Configurable**: Muestra/oculta tabs según necesites  
✅ **Navegación automática**: Funciona sin configuración  
✅ **Personalizable**: Sobrescribe comportamientos por defecto  
✅ **Mantenible**: Un solo lugar para cambios de diseño  

## 🔧 **Estructura de Archivos:**

```
components/
└── MenuBar.tsx          # Componente reutilizable

app/
├── (tabs)/
│   └── index.tsx        # Usa MenuBar con activeTab="home"
├── categories.tsx        # Usa MenuBar con activeTab="categories"
└── ...
```

¡El componente MenuBar está listo para usar en cualquier pantalla de tu aplicación! 🎯✨
