/**
 * Estilos comunes para toda la aplicación
 * Estos estilos ayudan a mantener una apariencia consistente en todas las pantallas
 */
import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const CommonStyles = StyleSheet.create({
  // Contenedores
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },

  // Encabezado con logo
  logoRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: 15,
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
  logoutButton: {
    position: "absolute",
    right: 20,
    zIndex: 2,
  },

  // Texto
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.light.secondary,
    fontWeight: "bold",
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
  },
  textSmall: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
    color: Colors.light.text,
  },

  // Botones
  primaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: Colors.light.secondary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },

  // Campos de entrada
  inputField: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 15,
    padding: 12,
    marginBottom: 20,
    backgroundColor: Colors.light.background,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.light.text,
    fontWeight: '500',
  },
  
  // Tarjetas y sombras
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  
  // Banner con marco redondeado
  bannerShadow: {
    alignSelf: "center",
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 18,
  },
  bannerFrame: {
    width: 385,
    height: 180,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#22222222",
  },
  
  // Indicadores de carrusel
  carouselDots: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.secondary,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: "transparent",
  },
  dotActive: {
    backgroundColor: Colors.light.primary,
    borderWidth: 2,
    width: 15,
    borderColor: "transparent",
  },
  
  // Estados y badges
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  successBadge: {
    backgroundColor: Colors.light.success,
  },
  warningBadge: {
    backgroundColor: Colors.light.warning,
  },
  errorBadge: {
    backgroundColor: Colors.light.error,
  },
  pendingBadge: {
    backgroundColor: Colors.light.pending,
  },
  
  // Componentes de información
  infoPanel: {
    backgroundColor: '#ffe1e1',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.primary,
  },
  infoPanelText: {
    color: Colors.light.primary,
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  
  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '60%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.light.text,
  },
});
