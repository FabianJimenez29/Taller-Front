import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { useFocusEffect, useRouter } from "expo-router";

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
};

const QuotesAdmin = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "No especificada";
    try {
      const parts = dateString.split("-");
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
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
      const res = await fetch(`${BACKEND_URL}/quotes?date=${todayStr}`);
      const data = await res.json();
      setQuotes(data.quotes || []);
    } catch (err) {
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

  const QuoteItem = React.memo(({ item, onProcesar }: { item: Quote, onProcesar: (id: number | string) => void }) => {
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
          <Text style={styles.quoteDetail}><Text style={styles.bold}>Vehículo:</Text> {item.tipo_placa} - {item.numero_placa}</Text>
          <Text style={styles.quoteDetail}><Text style={styles.bold}>Marca:</Text> {item.marca}</Text>
          <Text style={styles.quoteDetail}><Text style={styles.bold}>Modelo:</Text> {item.modelo}</Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={[styles.status, getStatusStyle(item.status)]}>
            {item.status || "Pendiente"}
          </Text>
          
          {item.tecnico && (
            <Text style={styles.tecnicoText}>Técnico: {item.tecnico}</Text>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.procesarButton}
          onPress={() => onProcesar(item.id)}
        >
          <Text style={styles.procesarButtonText}>
            {item.status === "Completado" ? "Ver detalles" : "Procesar cita"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  });

  const handleProcesarCita = (id: number | string) => {
    // En Expo Router, usamos un objeto con los parámetros
    router.push({
      pathname: "/admin/procesarCita",
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
    <Text style={styles.emptyText}>No hay citas agendadas para hoy.</Text>
  ), []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📅 Citas agendadas para hoy ({todayStr})</Text>
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
  procesarButton: {
    backgroundColor: "#76B414",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  procesarButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#95a5a6",
    textAlign: "center",
    marginTop: 40,
  },
});