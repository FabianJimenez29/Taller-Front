import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

type CitaCompletada = {
  id: number | string;
  servicio?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  sucursal?: string;
  fecha?: string;
  hora?: string;
  tipo_placa?: string;
  numero_placa?: string;
  marca?: string;
  modelo?: string;
  problema?: string;
  problemas_adicionales?: string;
  status?: string;
  tecnico?: string;
  observaciones?: string;
  autorizacion_cliente?: boolean;
};

interface ResumenCitaProps {
  cita: CitaCompletada;
}

const ResumenCita = ({ cita }: ResumenCitaProps) => {
  const router = useRouter();

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    try {
      const parts = dateString.split('-');
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    } catch {
      return dateString;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Servicio Completado</Text>
      </View>


      <View style={styles.card}>
        <View style={styles.statusBanner}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.statusText}>Completado</Text>
        </View>

        <Text style={styles.servicioTitle}>{cita.servicio}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles del servicio</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>{formatDate(cita.fecha)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hora:</Text>
            <Text style={styles.infoValue}>{cita.hora}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sucursal:</Text>
            <Text style={styles.infoValue}>{cita.sucursal}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehículo</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Placa:</Text>
            <Text style={styles.infoValue}>{cita.tipo_placa} {cita.numero_placa}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Marca/Modelo:</Text>
            <Text style={styles.infoValue}>{cita.marca} {cita.modelo}</Text>
          </View>
          {cita.problema && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Problema reportado:</Text>
              <Text style={styles.infoValue}>{cita.problema}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>{cita.client_name}</Text>
          </View>
          {cita.client_phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Teléfono:</Text>
              <Text style={styles.infoValue}>{cita.client_phone}</Text>
            </View>
          )}
          {cita.client_email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{cita.client_email}</Text>
            </View>
          )}
        </View>

        <View style={styles.techSection}>
          <Text style={styles.sectionTitle}>Técnico responsable</Text>
          <View style={styles.techInfo}>
            <Ionicons name="person" size={20} color="#3498db" style={styles.techIcon} />
            <Text style={styles.techName}>{cita.tecnico}</Text>
          </View>
        </View>

        {cita.problemas_adicionales && (
          <View style={styles.problemasSection}>
            <Text style={styles.sectionTitle}>Problemas adicionales detectados</Text>
            <View style={[styles.problemasContainer, cita.autorizacion_cliente === false ? styles.noAutorizadoContainer : null]}>
              <Text style={styles.problemasText}>{cita.problemas_adicionales}</Text>
              {cita.autorizacion_cliente === true && (
                <View style={styles.autorizadoTag}>
                  <Ionicons name="checkmark-circle" size={16} color="#fff" />
                  <Text style={styles.autorizadoText}>Autorizado por cliente</Text>
                </View>
              )}
              {cita.autorizacion_cliente === false && (
                <View style={styles.noAutorizadoTag}>
                  <Ionicons name="close-circle" size={16} color="#fff" />
                  <Text style={styles.noAutorizadoText}>No autorizado por cliente</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {cita.observaciones && (
          <View style={styles.observacionesSection}>
            <Text style={styles.sectionTitle}>Observaciones</Text>
            <Text style={styles.observacionesText}>{cita.observaciones}</Text>
          </View>
        )}
      </View>
      

      <TouchableOpacity
        style={styles.volverButton}
        onPress={() => router.back()}
      >
        <Text style={styles.volverButtonText}>Volver a la lista</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    paddingTop: Constants.statusBarHeight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f9',
    paddingTop: Constants.statusBarHeight,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  backIcon: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  statusBanner: {
    backgroundColor: '#2ecc71',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  servicioTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    flex: 1,
    fontSize: 15,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  infoValue: {
    flex: 2,
    fontSize: 15,
    color: '#34495e',
  },
  techSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  techInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
  },
  techIcon: {
    marginRight: 10,
  },
  techName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
  },
  problemasSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  problemasContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  noAutorizadoContainer: {
    borderLeftColor: '#e74c3c',
  },
  problemasText: {
    fontSize: 15,
    color: '#34495e',
    marginBottom: 10,
  },
  autorizadoTag: {
    backgroundColor: '#27ae60',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  autorizadoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  noAutorizadoTag: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  noAutorizadoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  observacionesSection: {
    padding: 15,
  },
  observacionesText: {
    fontSize: 15,
    color: '#34495e',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  volverButton: {
    backgroundColor: '#95a5a6',
    marginHorizontal: 15,
    marginBottom: 30,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  volverButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResumenCita;
