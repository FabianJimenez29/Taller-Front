# 🎭 Guía de Animaciones de Navegación

Esta guía explica cómo implementar la animación de swipe (`slide_from_right`) en todas las pantallas de tu aplicación.

## ✨ **Animación Actual (Ya Funciona)**

Tu app ya tiene configurada la animación de swipe en `app/_layout.tsx`:

```tsx
<Stack
  screenOptions={{
    headerShown: false,
    animation: 'slide_from_right',        // 👈 Animación de swipe
    animationDuration: 300,               // 👈 Duración de 300ms
    gestureEnabled: true,                 // 👈 Gestos habilitados
    gestureDirection: 'horizontal',       // 👈 Dirección horizontal
  }}
>
```

## 🚀 **Cómo Funciona la Animación de Swipe**

- **`slide_from_right`**: La nueva pantalla se desliza desde la derecha
- **Efecto visual**: Como si estuvieras deslizando hacia la izquierda
- **Duración**: 300ms para transiciones suaves
- **Gestos**: Los usuarios pueden hacer swipe con el dedo

## 📱 **Pantallas que YA tienen la Animación**

✅ **Login** → **Register** (swipe)  
✅ **Login** → **Index** (swipe)  
✅ **Register** → **Login** (swipe)  
✅ **Index** → **Login** (swipe)  
✅ **Index** → **ScheduleRepair** (swipe)  
✅ **ScheduleRepair** → **ScheduleRepairV2** (swipe)  
✅ **ScheduleRepairV2** → **Resume** (swipe)  

## 🔧 **Para Pantallas Futuras**

### **1. Pantallas del Stack Principal**
Todas las pantallas que agregues en `app/_layout.tsx` automáticamente tendrán la animación de swipe:

```tsx
<Stack.Screen name="nuevaPantalla" />
<Stack.Screen name="otraPantalla" />
<Stack.Screen name="perfil" />
```

### **2. Navegación desde Cualquier Pantalla**
Usa `router.push()` para navegar con la animación de swipe:

```tsx
import { useRouter } from 'expo-router';

const router = useRouter();

// Navegar con swipe
router.push("/nuevaPantalla");

// Navegar con swipe y parámetros
router.push("/perfil?id=123");

// Navegar hacia atrás (mantiene la animación)
router.back();
```

### **3. Navegación entre Tabs**
Las pantallas dentro de `(tabs)` también usan la animación del stack principal.

## 🎨 **Tipos de Animaciones Disponibles**

### **Animaciones Principales:**
- **`slide_from_right`** ← La que ya tienes (swipe)
- **`slide_from_left`** ← Desliza desde la izquierda
- **`slide_from_bottom`** ← Desliza desde abajo
- **`slide_from_top`** ← Desliza desde arriba
- **`fade`** ← Aparece gradualmente

### **Para Cambiar la Animación de una Pantalla Específica:**

```tsx
<Stack.Screen 
  name="modal" 
  options={{ 
    animation: 'fade',
    animationDuration: 200 
  }} 
/>
```

## 📋 **Ejemplos de Uso**

### **Ejemplo 1: Pantalla de Perfil**
```tsx
// app/perfil.tsx
const Perfil = () => {
  const router = useRouter();
  
  return (
    <View>
      <TouchableOpacity onPress={() => router.push("/")}>
        <Text>Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### **Ejemplo 2: Pantalla de Configuración**
```tsx
// app/configuracion.tsx
const Configuracion = () => {
  const router = useRouter();
  
  return (
    <View>
      <TouchableOpacity onPress={() => router.push("/perfil")}>
        <Text>Ir al perfil</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## 🎯 **Mejores Prácticas**

### **1. Consistencia**
- Usa `slide_from_right` para navegación principal
- Usa `fade` para modales o popups
- Mantén la misma duración (300ms)

### **2. Navegación Intuitiva**
- **Hacia adelante**: `router.push("/nuevaPantalla")`
- **Hacia atrás**: `router.back()` o `router.push("/pantallaAnterior")`
- **Al inicio**: `router.push("/")`

### **3. Gestos del Usuario**
- Los usuarios pueden hacer swipe hacia atrás
- Los gestos funcionan en iOS y Android
- La animación es suave y natural

## 🚨 **Solución de Problemas**

### **Animación no funciona:**
1. Verifica que esté en `app/_layout.tsx`
2. Asegúrate de usar `router.push()` correctamente
3. Revisa que no haya conflictos con otras librerías

### **Animación lenta:**
1. Reduce `animationDuration` a 200ms
2. Verifica el rendimiento del dispositivo
3. Considera usar `fade` para pantallas pesadas

## 🎉 **Resumen**

✅ **Tu app YA tiene la animación de swipe en todas las pantallas**  
✅ **No necesitas hacer nada más**  
✅ **Las pantallas futuras automáticamente tendrán la animación**  
✅ **Usa `router.push()` para navegar con swipe**  

¡La animación de swipe está completamente implementada y funcionando en toda tu aplicación! 🚀
