# 🎭 Guía de Animaciones de Navegación - Adelante y Atrás

Esta guía explica cómo implementar animaciones de swipe en ambas direcciones: **hacia adelante** y **hacia atrás**.

## ✨ **Animaciones Implementadas**

### **🚀 Hacia Adelante (slide_from_right)**
- **Efecto**: Nueva pantalla se desliza desde la derecha
- **Uso**: `router.push("/nuevaPantalla")`
- **Animación**: Swipe hacia la izquierda

### **⬅️ Hacia Atrás (slide_from_left)**
- **Efecto**: Pantalla anterior se desliza desde la izquierda
- **Uso**: `router.back()`
- **Animación**: Swipe hacia la derecha

## 🔧 **Configuración Actual**

```tsx
// app/_layout.tsx
<Stack
  screenOptions={{
    headerShown: false,
    animation: 'slide_from_right',        // 👈 Animación hacia adelante
    animationDuration: 300,               // 👈 Duración de 300ms
    gestureEnabled: true,                 // 👈 Gestos habilitados
    gestureDirection: 'horizontal',       // 👈 Dirección horizontal
  }}
>
```

## 📱 **Ejemplos de Uso**

### **1. Navegación Hacia Adelante (swipe izquierda)**
```tsx
// En index.tsx
<TouchableOpacity onPress={() => router.push("/scheduleRepair")}>
  <Text>Schedule Repair</Text>
</TouchableOpacity>

// En scheduleRepair.tsx
<TouchableOpacity onPress={() => router.push("/scheduleRepairV2")}>
  <Text>Siguiente</Text>
</TouchableOpacity>

// En scheduleRepairV2.tsx
<TouchableOpacity onPress={() => router.push("/resume")}>
  <Text>Siguiente</Text>
</TouchableOpacity>
```

### **2. Navegación Hacia Atrás (swipe derecha)**
```tsx
// En scheduleRepair.tsx
<TouchableOpacity onPress={() => router.back()}>
  <Text>Volver</Text>
</TouchableOpacity>

// En scheduleRepairV2.tsx
<TouchableOpacity onPress={() => router.back()}>
  <Text>Volver</Text>
</TouchableOpacity>

// En resume.tsx (botón Editar)
const handleEditAppointment = () => {
  Alert.alert("¿Qué sección quieres editar?", [
    {
      text: "Información General",
      onPress: () => router.back()  // 👈 Vuelve a la pantalla anterior
    },
    {
      text: "Información Vehicular", 
      onPress: () => router.back()  // 👈 Vuelve a la pantalla anterior
    }
  ]);
};
```

## 🎯 **Flujo de Navegación Completo**

```
Index → ScheduleRepair → ScheduleRepairV2 → Resume
  ↑         ↑                ↑           ↑
  └─── router.back() ───────┘           │
                                        │
                                    router.back()
```

### **Detalles del Flujo:**

1. **Index** → **ScheduleRepair** 
   - `router.push("/scheduleRepair")` → Swipe izquierda

2. **ScheduleRepair** → **ScheduleRepairV2**
   - `router.push("/scheduleRepairV2")` → Swipe izquierda

3. **ScheduleRepairV2** → **Resume**
   - `router.push("/resume")` → Swipe izquierda

4. **Resume** → **ScheduleRepairV2** (al editar)
   - `router.back()` → Swipe derecha

5. **ScheduleRepairV2** → **ScheduleRepair** (al volver)
   - `router.back()` → Swipe derecha

6. **ScheduleRepair** → **Index** (al volver)
   - `router.back()` → Swipe derecha

## 🎨 **Tipos de Animaciones Disponibles**

### **Para Navegación Hacia Adelante:**
- **`slide_from_right`** ← La que ya tienes (swipe izquierda)
- **`slide_from_bottom`** ← Desliza desde abajo
- **`slide_from_top`** ← Desliza desde arriba
- **`fade`** ← Aparece gradualmente

### **Para Navegación Hacia Atrás:**
- **Automático**: `router.back()` siempre usa la animación inversa
- **Personalizado**: Puedes usar `router.push()` con animación específica

## 🔄 **Gestos del Usuario**

### **Swipe Hacia Atrás (iOS/Android):**
- Los usuarios pueden hacer swipe desde el borde izquierdo
- Esto activa automáticamente `router.back()`
- La animación es suave y natural

### **Swipe Hacia Adelante:**
- Solo se activa con `router.push()`
- No hay gesto nativo para esto

## 📋 **Mejores Prácticas**

### **1. Consistencia en la Navegación:**
- **Botones "Siguiente"**: Usa `router.push()` → Swipe izquierda
- **Botones "Volver"**: Usa `router.back()` → Swipe derecha
- **Logo/Home**: Usa `router.push("/")` → Swipe izquierda

### **2. Experiencia del Usuario:**
- Los usuarios esperan que "Volver" vaya hacia atrás
- Los usuarios esperan que "Siguiente" vaya hacia adelante
- Mantén la consistencia en toda la app

### **3. Gestos Intuitivos:**
- Swipe izquierda = Ir hacia adelante
- Swipe derecha = Ir hacia atrás
- Esto es estándar en iOS y Android

## 🚨 **Solución de Problemas**

### **Animación no funciona:**
1. Verifica que esté en `app/_layout.tsx`
2. Asegúrate de usar `router.push()` o `router.back()`
3. Revisa que no haya conflictos con otras librerías

### **Animación en dirección incorrecta:**
1. **Para ir hacia adelante**: Usa `router.push("/pantalla")`
2. **Para ir hacia atrás**: Usa `router.back()`
3. **Para ir al inicio**: Usa `router.push("/")`

## 🎉 **Resumen**

✅ **Hacia Adelante**: `router.push()` → Swipe izquierda  
✅ **Hacia Atrás**: `router.back()` → Swipe derecha  
✅ **Gestos nativos**: Swipe desde borde izquierdo  
✅ **Consistencia**: Mantén el patrón en toda la app  

¡Ahora tienes animaciones de swipe en ambas direcciones funcionando perfectamente! 🚀✨
