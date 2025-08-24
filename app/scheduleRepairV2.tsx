import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { PLACA_API_URL, PLACA_API_USERNAME } from "../constants/PlacaApi";
import { useAppointment } from "../contexts/AppointmentContext";

const tiposPlaca = [
    { label: "Particular", value: "particular" },
    { label: "Comercial", value: "comercial" },
    { label: "Transporte Público", value: "publico" },
]; 

const VehicleInfo = (): React.ReactElement => {
    const router = useRouter();
    const { appointmentData, updateAppointmentData } = useAppointment();

    const [tipoPlaca, setTipoPlaca] = useState(appointmentData.tipoPlaca || "");
    const [numeroPlaca, setNumeroPlaca] = useState(appointmentData.numeroPlaca || "");
    const [marca, setMarca] = useState(appointmentData.marca || "");
    const [modelo, setModelo] = useState(appointmentData.modelo || "");
    const [problema, setProblema] = useState(appointmentData.problema || "");
    const [modalPlaca, setModalPlaca] = useState(false);
    const [tempTipoPlaca, setTempTipoPlaca] = useState(""); // Estado temporal para el picker

    // Guardar datos en el contexto cuando cambien
    useEffect(() => {
        updateAppointmentData({ tipoPlaca, numeroPlaca, marca, modelo, problema });
    }, [tipoPlaca, numeroPlaca, marca, modelo, problema]);

    // Limpiar campos si no hay datos en el contexto
    useEffect(() => {
        if (!appointmentData.tipoPlaca && !appointmentData.numeroPlaca && !appointmentData.marca && !appointmentData.modelo && !appointmentData.problema) {
            setTipoPlaca("");
            setNumeroPlaca("");
            setMarca("");
            setModelo("");
            setProblema("");
        }
    }, [appointmentData]);

    // Función para abrir el modal y establecer el valor temporal
    const openModalPlaca = () => {
        setTempTipoPlaca(tipoPlaca || "");
        setModalPlaca(true);
    };

    // Función para confirmar la selección
    const confirmarSeleccion = () => {
        if (tempTipoPlaca && tempTipoPlaca !== "") {
            setTipoPlaca(tempTipoPlaca);
            setModalPlaca(false);
        } else {
            Alert.alert("Atención", "Por favor seleccione una opción válida");
        }
    };

    // Función para cancelar la selección
    const cancelarSeleccion = () => {
        setTempTipoPlaca("");
        setModalPlaca(false);
    };

    const fetchVehicleInfo = async () => {
        if (!numeroPlaca) {
            Alert.alert("Error", "Ingrese un número de placa");
            return;
        }

        try {
            const username = PLACA_API_USERNAME;
            const baseUrl = PLACA_API_URL;
            const url = `${baseUrl}?RegistrationNumber=${numeroPlaca}&username=${username}`;

            console.log("🔍 Buscando placa:", numeroPlaca);
            console.log("📡 URL:", url);

            const response = await fetch(url);
            const textResponse = await response.text();

            console.log("📥 Respuesta completa:", textResponse);

            // Extraer el bloque <vehicleJson>
            const match = textResponse.match(/<vehicleJson>(.*?)<\/vehicleJson>/s);

            if (!match || !match[1]) {
                Alert.alert("❌ No encontrado", `No se encontró información para la placa ${numeroPlaca}`);
                return;
            }

            // Limpiar y parsear el JSON embebido
            const vehicleJson = match[1]
                .replace(/&quot;/g, '"') // convertir entidades XML
                .replace(/\\\//g, "/")   // limpiar escapes
                .trim();

            console.log("✅ JSON limpio:", vehicleJson);

            const vehicleData = JSON.parse(vehicleJson);
            console.log("🚗 Datos del vehículo:", vehicleData);

            // Detectar marca/modelo
            const marcaEncontrada =
                vehicleData?.CarMake?.CurrentTextValue ||
                vehicleData?.MakeDescription?.CurrentTextValue ||
                vehicleData?.Marca ||
                "";

            const modeloEncontrado =
                vehicleData?.CarModel?.CurrentTextValue ||
                vehicleData?.ModelDescription?.CurrentTextValue ||
                vehicleData?.Modelo ||
                "";

            setMarca(marcaEncontrada);
            setModelo(modeloEncontrado);

            if (marcaEncontrada || modeloEncontrado) {
                Alert.alert(
                    "✅ Éxito",
                    `Vehículo encontrado:\nMarca: ${marcaEncontrada}\nModelo: ${modeloEncontrado}`
                );
            } else {
                Alert.alert("⚠️ Incompleto", "Se encontró el vehículo, pero faltan datos de marca o modelo");
            }
        } catch (error) {
            console.error("❌ Error en fetch:", error);
            Alert.alert("Error", "No se pudo conectar con el servicio. Verifica tu conexión a internet.");
        }
    };

    return (
        <View style={styles.container}>
            {/* ENCABEZADO */}
            <View style={styles.logoRow}>
                <TouchableOpacity
                    style={styles.languageIcon}
                    onPress={() => router.push({
                        pathname: "/language",
                        params: { previousScreen: "/scheduleRepairV2" }
                    })}
                >
                    <Ionicons name="language-outline" size={36} color="#000000ff" />
                </TouchableOpacity>
                <View style={styles.logoCenter}>
                    <TouchableOpacity
                        style={styles.logoContainer}
                        onPress={() => router.push("/main")}
                    >
                        <Image
                            source={require("../assets/images/logo.png")}
                            style={styles.logo}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* TÍTULO */}
            <Text style={styles.title}>Información Vehicular</Text>

            {/* FORMULARIO */}
            <View style={styles.form}>
                {/* Tipo de Placa */}
                <Text style={styles.label}>Tipo De Placa</Text>
                <TouchableOpacity
                    style={styles.inputField}
                    onPress={openModalPlaca}
                >
                    <Text style={{ color: tipoPlaca ? "#222" : "#aaa" }}>
                        {tipoPlaca
                            ? tiposPlaca.find((t) => t.value === tipoPlaca)?.label
                            : "Seleccione una opción"}
                    </Text>
                </TouchableOpacity>

                {/* Modal mejorado para Tipo de Placa */}
                <Modal visible={modalPlaca} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {/* Título del modal */}
                            <Text style={styles.modalTitle}>Seleccione el tipo de placa</Text>
                            
                            {/* Picker con estilos mejorados */}
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={tempTipoPlaca}
                                    onValueChange={(value) => setTempTipoPlaca(value)}
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem} // Solo funciona en iOS
                                >
                                    <Picker.Item 
                                        label="-- Seleccione una opción --" 
                                        value="" 
                                        color="#999" 
                                    />
                                    {tiposPlaca.map((t) => (
                                        <Picker.Item 
                                            key={t.value} 
                                            label={t.label} 
                                            value={t.value}
                                            color="#000"
                                        />
                                    ))}
                                </Picker>
                            </View>
                            
                            {/* Botones de acción */}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity 
                                    style={styles.cancelBtn}
                                    onPress={cancelarSeleccion}
                                >
                                    <Text style={styles.cancelBtnText}>Cancelar</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={styles.confirmBtn}
                                    onPress={confirmarSeleccion}
                                >
                                    <Text style={styles.confirmBtnText}>Confirmar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Número de Placa */}
                <Text style={styles.label}>Numero De Placa</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Ingrese El Número Acá"
                    value={numeroPlaca}
                    onChangeText={setNumeroPlaca}
                    onBlur={fetchVehicleInfo} // 👈 busca cuando terminas de escribir
                />

                {/* Marca */}
                <Text style={styles.label}>Marca Del Vehiculo</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Ingrese Texto Acá"
                    value={marca}
                    onChangeText={setMarca}
                />

                {/* Modelo */}
                <Text style={styles.label}>Modelo Del Vehiculo</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Ingrese Texto Acá"
                    value={modelo}
                    onChangeText={setModelo}
                />

                {/* Problema */}
                <Text style={styles.label}>Indique El Problema</Text>
                <TextInput
                    style={[styles.textInput, { height: 100, textAlignVertical: "top" }]}
                    placeholder="Ingrese Texto Acá"
                    multiline
                    value={problema}
                    onChangeText={setProblema}
                />
            </View>

            {/* BOTONES INFERIORES */}
            <View style={styles.bottomButtons}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        setTipoPlaca("");
                        setNumeroPlaca("");
                        setMarca("");
                        setModelo("");
                        setProblema("");
                        setTempTipoPlaca("");
                        router.back();
                    }}
                >
                    <Text style={styles.buttonTextBottom}>Volver</Text>
                </TouchableOpacity>

                {tipoPlaca && numeroPlaca && marca && modelo && problema && (
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => router.push("/resume")}
                    >
                        <Text style={styles.buttonTextBottom}>Ver Resumen</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default VehicleInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    logoRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 5,
        position: "relative",
    },
    languageIcon: {
        position: "absolute",
        left: 0,
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
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
    },
    form: {
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: "500",
        justifyContent: "center",
        textAlign: "center",
    },
    inputField: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        marginBottom: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        width: "80%",
        alignSelf: "center",
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        marginBottom: 20,
        backgroundColor: "#fff",
        width: "80%",
        alignSelf: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        maxHeight: '50%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    pickerContainer: {
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        marginBottom: 20,
        ...Platform.select({
            ios: {
                height: 180, // Altura específica para iOS
            },
            android: {
                height: 50,
            },
        }),
    },
    picker: {
        width: "100%",
        ...Platform.select({
            ios: {
                height: 180,
            },
            android: {
                height: 50,
                color: "#000",
            },
        }),
    },
    pickerItem: {
        // Solo funciona en iOS
        fontSize: 16,
        height: 180,
        color: "#000",
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    cancelBtn: {
        backgroundColor: '#E51514',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        flex: 1,
    },
    cancelBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    confirmBtn: {
        backgroundColor: '#76B414',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        flex: 1,
    },
    confirmBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bottomButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 30,
        marginBottom: 10,
        width: "100%",
    },
    backButton: {
        backgroundColor: "#E51514",
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 10,
    },
    nextButton: {
        backgroundColor: "#76B414",
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 10,
    },
    buttonTextBottom: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
});