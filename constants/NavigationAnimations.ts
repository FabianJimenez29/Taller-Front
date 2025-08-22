// Configuraciones de animación para navegación entre pantallas
export const NavigationAnimations = {
  // Animación principal de swipe (slide_from_right)
  slideFromRight: {
    animation: 'slide_from_right',
    animationDuration: 300,
    gestureEnabled: true,
    gestureDirection: 'horizontal',
  },
  
  // Animación de fade para modales o transiciones suaves
  fade: {
    animation: 'fade',
    animationDuration: 300,
  },
  
  // Animación de slide desde abajo (para modales)
  slideFromBottom: {
    animation: 'slide_from_bottom',
    animationDuration: 300,
  },
  
  // Animación de slide desde arriba
  slideFromTop: {
    animation: 'slide_from_top',
    animationDuration: 300,
  },
  
  // Animación de slide desde la izquierda
  slideFromLeft: {
    animation: 'slide_from_left',
    animationDuration: 300,
  },
};

// Configuraciones específicas por tipo de pantalla
export const ScreenAnimations = {
  // Para pantallas principales (login, register, index)
  main: NavigationAnimations.slideFromRight,
  
  // Para modales o popups
  modal: NavigationAnimations.fade,
  
  // Para pantallas de configuración o perfil
  settings: NavigationAnimations.slideFromBottom,
  
  // Para pantallas de formularios
  form: NavigationAnimations.slideFromRight,
};

// Función helper para obtener animación según el tipo de pantalla
export const getScreenAnimation = (screenType: keyof typeof ScreenAnimations = 'main') => {
  return ScreenAnimations[screenType];
};
