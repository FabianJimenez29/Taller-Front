/**
 * Colores principales de la aplicación de TallerApp
 * Utilizados en todos los componentes y pantallas para mantener la consistencia visual
 */

// Colores principales de marca
const primaryRed = '#E51514';
const primaryGreen = '#76B414';

// Colores de fondo y texto
const backgroundColor = '#ffffff';
const textDark = '#2c3e50';
const textLight = '#7f8c8d';

export const Colors = {
  // Tema claro
  light: {
    // Colores principales de marca
    primary: primaryRed,
    secondary: primaryGreen,
    
    // Colores de fondo
    background: backgroundColor,
    backgroundAlt: '#f8f9fa',
    card: backgroundColor,
    
    // Colores de texto
    text: textDark,
    textSecondary: textLight,
    textInverse: '#ffffff',
    
    // Colores de iconos y estados
    icon: textDark,
    iconInactive: textLight,
    tabIconDefault: '#687076',
    tabIconSelected: primaryRed,
    tint: primaryRed,
    
    // Estados
    success: '#2ecc71',
    warning: '#f39c12',
    error: primaryRed,
    info: '#3498db',
    pending: '#95a5a6',
    inProgress: '#f39c12',
    completed: '#2ecc71',
    
    // Bordes y divisores
    border: '#ddd',
    borderAlt: '#e6e6e6',
    divider: '#e6e6e6',
    
    // Sombras
    shadow: '#000',
  },
  
  // Tema oscuro (para futura implementación)
  dark: {
    // Colores principales de marca
    primary: primaryRed,
    secondary: primaryGreen,
    
    // Colores de fondo
    background: '#151718',
    backgroundAlt: '#1e2022',
    card: '#1e2022',
    
    // Colores de texto
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    textInverse: '#151718',
    
    // Colores de iconos y estados
    icon: '#ECEDEE',
    iconInactive: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryRed,
    tint: primaryRed,
    
    // Estados
    success: '#2ecc71',
    warning: '#f39c12',
    error: primaryRed,
    info: '#3498db',
    pending: '#95a5a6',
    inProgress: '#f39c12',
    completed: '#2ecc71',
    
    // Bordes y divisores
    border: '#2a2d2f',
    borderAlt: '#2a2d2f',
    divider: '#2a2d2f',
    
    // Sombras
    shadow: '#000',
  },
};
