import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

type Quote = {
  id: number | string;
  title?: string;
  servicio?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientProvincia?: string;
  clientCanton?: string;
  clientDistrito?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  client_provincia?: string;
  client_canton?: string;
  client_distrito?: string;
  sucursal?: string;
  fecha?: string;
  hora?: string;
  tipo_placa?: string;
  numero_placa?: string;
  marca?: string;
  modelo?: string;
  problema?: string;
  status?: string;
  tecnico?: string;
  procesoCompletado?: boolean;
  observaciones?: string;
};

const QuotesAdmin = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingQuote, setUpdatingQuote] = useState<string | number | null>(null);
  const router = useRouter();

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "No especificada";
    try {

      if (dateString.includes('/')) return dateString;
      

      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    } catch {
      return dateString;
    }
  };

  const formatUbicacion = (item: Quote) => {
    const provincia = item.client_provincia || item.clientProvincia;
    const canton = item.client_canton || item.clientCanton;
    const distrito = item.client_distrito || item.clientDistrito;
    if (!provincia && !canton && !distrito) {
      return "No especificada";
    }
    return [provincia, canton, distrito].filter(Boolean).join(", ");
  };

  const fetchQuotes = async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
    try {
      const fullUrl = `${BACKEND_URL}/quotes`;
      
      const response = await fetch(fullUrl);
      const responseData = await response.json();
      

      const filteredQuotes = responseData.quotes?.filter((quote: Quote) => 
        quote.fecha === todayStr
      ) || [];
      
      setQuotes(filteredQuotes);
      
    } catch (err) {
      console.error('Error fetching quotes:', err);
      if (isInitialLoad) setQuotes([]);
    }
    if (isInitialLoad) setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchQuotes(true);
    const interval = setInterval(() => fetchQuotes(false), 10000);
    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (!loading) {
        fetchQuotes(false);
      }
    }, [loading])
  );

  const getStatusStyle = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "completado":
        return { color: "#2ecc71" };
      case "cancelado":
        return { color: "#e74c3c" };
      default:
        return { color: "#f39c12" };
    }
  };

  const QuoteItem = React.memo(({ item, onProcesar }: { item: Quote, onProcesar: (id: number | string, status?: string) => void }) => {
    return (
      <View style={styles.quoteCard}>
        <Text style={styles.quoteTitle}>{item.servicio || item.title || "Cita"}</Text>
        
        <View style={styles.section}>
          <Text style={styles.quoteDetail}><Text style={styles.bold}>Cliente:</Text> {item.client_name || item.clientName || "No especificado"}</Text>
          <Text style={styles.quoteDetail}><Text style={styles.bold}>Correo:</Text> {item.client_email || item.clientEmail || "No especificado"}</Text>
          <Text style={styles.quoteDetail}><Text style={styles.bold}>Teléfono:</Text> {item.client_phone || item.clientPhone || "No especificado"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.quoteDetail}><Text style={styles.bold}>Ubicación:</Text> {formatUbicacion(item)}</Text>
          <Text style={styles.quoteDetail}><Text style={styles.bold}>Sucursal:</Text> {item.sucursal || "No especificada"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.quoteDetail}><Text style={styles.bold}>Fecha:</Text> {formatDate(item.fecha)}</Text>
          <Text style={styles.quoteDetail}><Text style={styles.bold}>Hora:</Text> {item.hora || "No especificada"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.quoteDetail}><Text style={styles.bold}>Placa:</Text> {item.tipo_placa} - {item.numero_placa}</Text>
          <Text style={styles.quoteDetail}><Text style={styles.bold}>Vehículo:</Text> {item.marca} {item.modelo}</Text>
          {item.problema && (
            <Text style={styles.quoteDetail}>
              <Text style={styles.bold}>Problema Reportado:</Text> {item.problema}
            </Text>
          )}
        </View>

        <View style={styles.statusRow}>
          <Text style={[styles.status, getStatusStyle(item.status)]}>
            {item.status || "Pendiente"}
          </Text>
          
          {item.tecnico && (
            <Text style={styles.tecnicoText}>Técnico: {item.tecnico}</Text>
          )}
        </View>
        
        {item.observaciones && (
          <View style={styles.observacionesContainer}>
            <Text style={styles.observacionesLabel}>Observaciones:</Text>
            <Text style={styles.observacionesText}>{item.observaciones}</Text>
          </View>
        )}
        
        <TouchableOpacity
          style={[
            styles.procesarButton,
            item.status === "Completado" ? styles.detallesButton : 
            item.status === "En proceso" ? styles.enProcesoButton : {}
          ]}
          onPress={() => onProcesar(item.id, item.status)}
          disabled={updatingQuote === item.id}
        >
          <Text style={styles.procesarButtonText}>
            {updatingQuote === item.id ? "Actualizando..." :
             item.status === "Completado" ? "Ver detalles" :
             item.status === "En proceso" ? "Finalizar" :
             "Procesar cita"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  });

  const updateQuoteStatus = async (id: number | string, newStatus: string) => {
    try {
      setUpdatingQuote(id);
      const fullUrl = `${BACKEND_URL}/quotes/${id}`;
      

      const userDataString = await AsyncStorage.getItem("user");
      let tecnicoName = 'Técnico';
      
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          tecnicoName = userData.fullName || userData.nombre || userData.email || 'Técnico';
        } catch (error) {
          console.log('Error parsing user data:', error);
        }
      }
      
      const response = await fetch(fullUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          tecnico: tecnicoName
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la cita');
      }

      await fetchQuotes(false);
    } catch (error) {
      console.error('Error updating quote:', error);
    } finally {
      setUpdatingQuote(null);
    }
  };

  const handleProcesarCita = async (id: number | string, currentStatus?: string) => {
    if (currentStatus === "Completado") {
      router.push({
        pathname: '/admin/procesarCita/[id]',
        params: { id: id.toString() }
      });
      return;
    }

    if (!currentStatus || currentStatus === "Pendiente") {
      await updateQuoteStatus(id, "En proceso");
    } 
    else if (currentStatus === "En proceso") {
      await updateQuoteStatus(id, "Completado");
    }

    router.push({
      pathname: '/admin/procesarCita/[id]',
      params: { id: id.toString() }
    });
  };
  
  const renderItem = ({ item }: { item: Quote }) => (
    <QuoteItem item={item} onProcesar={handleProcesarCita} />
  );

  function onRefresh(): void {
    setRefreshing(true);
    fetchQuotes(false);
  }

  const keyExtractor = React.useCallback((item: Quote) => item.id?.toString() || Math.random().toString(), []);

  const EmptyListComponent = React.useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay citas agendadas para hoy.</Text>
      <Text style={styles.emptySubtext}>
        Las citas aparecerán aquí cuando los clientes las programen para la fecha actual.
      </Text>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📅 Citas agendadas para hoy ({new Date(todayStr).toLocaleDateString('es-ES')})</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#76B414" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={quotes}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={EmptyListComponent}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
};

export default QuotesAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    paddingTop: Constants.statusBarHeight + 20,
    paddingHorizontal: 20,
  },
  enProcesoButton: {
    backgroundColor: "#f39c12",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
  },
  quoteCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  quoteTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#76B414",
    marginBottom: 12,
  },
  section: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  quoteDetail: {
    fontSize: 15,
    color: "#34495e",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  status: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  tecnicoText: {
    fontSize: 14,
    color: "#34495e",
    fontStyle: "italic",
  },
  observacionesContainer: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#76B414",
  },
  observacionesLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  observacionesText: {
    fontSize: 14,
    color: "#34495e",
    fontStyle: "italic",
  },
  procesarButton: {
    backgroundColor: "#76B414",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  detallesButton: {
    backgroundColor: "#3498db",
  },
  procesarButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#95a5a6",
    textAlign: "center",
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bdc3c7",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});