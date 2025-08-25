// Configuraciones de animación para navegación entre pantallas
export const NavigationAnimations = {
  // Animación principal de swipe (slide_from_right)
  slideFromRight: {
    animation: 'slide_from_right',
    animationDuration: 300,
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    cardStyleInterpolator: ({ current, layouts }: any) => ({
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
        opacity: current.progress,
        shadowOpacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.3],
        }),
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    }),
  },
  
  // Animación de fade para modales o transiciones suaves
  fade: {
    animation: 'fade',
    animationDuration: 350,
    cardStyleInterpolator: ({ current }: any) => ({
      cardStyle: {
        opacity: current.progress,
      },
    }),
  },
  
  // Animación de slide desde abajo (para modales)
  slideFromBottom: {
    animation: 'slide_from_bottom',
    animationDuration: 350,
    gestureEnabled: true,
    gestureDirection: 'vertical',
    cardStyleInterpolator: ({ current, layouts }: any) => ({
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
        shadowOpacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.3],
        }),
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    }),
  },
  
  // Animación de slide desde arriba
  slideFromTop: {
    animation: 'slide_from_top',
    animationDuration: 350,
    gestureEnabled: true,
    gestureDirection: 'vertical',
    cardStyleInterpolator: ({ current, layouts }: any) => ({
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-layouts.screen.height, 0],
            }),
          },
        ],
        shadowOpacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.3],
        }),
      },
    }),
  },
  
  // Animación de slide desde la izquierda
  slideFromLeft: {
    animation: 'slide_from_left',
    animationDuration: 300,
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    cardStyleInterpolator: ({ current, layouts }: any) => ({
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-layouts.screen.width, 0],
            }),
          },
        ],
        shadowOpacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.3],
        }),
      },
    }),
  },
  
  // Animación de zoom/scale
  zoom: {
    animation: 'default',
    animationDuration: 350,
    cardStyleInterpolator: ({ current }: any) => ({
      cardStyle: {
        transform: [
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          },
        ],
        opacity: current.progress,
      },
    }),
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
