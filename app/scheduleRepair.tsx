import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { servicios } from "../constants/Servicios";
import { sucursales } from "../constants/Sucursales";
import { useAppointment } from "../contexts/AppointmentContext";

function getFechasCita(): { label: string; value: string }[] {
    const fechas: { label: string; value: string }[] = [];
    const diasSemana = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];
    const hoy = new Date();
    for (let i = 0; i <= 7; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + i);
        if (fecha.getDay() !== 0) {
            // Excluye domingos
            const label = `${diasSemana[fecha.getDay()]} ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
            const value = fecha.toISOString().split("T")[0];
            fechas.push({ label, value });
        }
    }
    return fechas;
}

const horasCita = [
    { label: "08:00 AM", value: "08:00" },
    { label: "09:00 AM", value: "09:00" },
    { label: "10:00 AM", value: "10:00" },
    { label: "11:00 AM", value: "11:00" },
    { label: "12:00 PM", value: "12:00" },
    { label: "01:00 PM", value: "13:00" },
    { label: "02:00 PM", value: "14:00" },
    { label: "03:00 PM", value: "15:00" },
];

const ScheduleRepair = (): React.ReactElement => {
    const router = useRouter();
    const { appointmentData, updateAppointmentData } = useAppointment();
    
    const [sucursal, setSucursal] = useState(appointmentData.sucursal || "");
    const [servicio, setServicio] = useState(appointmentData.servicio || "");
    const [fecha, setFecha] = useState(appointmentData.fecha || "");
    const [hora, setHora] = useState(appointmentData.hora || "");

    // Control de modals
    const [modalSucursal, setModalSucursal] = useState(false);
    const [modalServicio, setModalServicio] = useState(false);
    const [modalFecha, setModalFecha] = useState(false);
    const [modalHora, setModalHora] = useState(false);

    // Guardar datos en el contexto cuando cambien
    useEffect(() => {
        updateAppointmentData({ sucursal, servicio, fecha, hora });
    }, [sucursal, servicio, fecha, hora]);

    // Limpiar campos si no hay datos en el contexto
    useEffect(() => {
        if (!appointmentData.sucursal && !appointmentData.servicio && !appointmentData.fecha && !appointmentData.hora) {
            setSucursal("");
            setServicio("");
            setFecha("");
            setHora("");
        }
    }, [appointmentData]);

    return (
        <View style={styles.container}>
            {/* ENCABEZADO */}
            <View style={styles.logoRow}>
                <TouchableOpacity 
                    style={styles.languageIcon} 
                    onPress={() => router.push({
                        pathname: "/language",
                        params: { previousScreen: "/scheduleRepair" }
                    })}
                >
                    <Ionicons name="language-outline" size={36} color="#000000ff" />
                </TouchableOpacity>
                <View style={styles.logoCenter}>
                    <TouchableOpacity style={styles.logoContainer} onPress={() => router.push("/")}>
                        <Image
                            source={require("../assets/images/logo.png")}
                            style={styles.logo}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* TÍTULO */}
            <Text style={styles.title}>Información General</Text>

            {/* FORMULARIO */}
            <View style={styles.form}>
                {/* Sucursal */}
                <Text style={styles.label}>Sucursal</Text>
                <TouchableOpacity
                    style={styles.inputField}
                    onPress={() => setModalSucursal(true)}
                >
                    <Text style={{ color: sucursal ? "#222" : "#aaa" }}>
                        {sucursal
                            ? sucursales.find(s => s.id === sucursal)?.nombre
                            : "Seleccione una sucursal"}
                    </Text>
                </TouchableOpacity>
                <Modal visible={modalSucursal} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Picker
                                selectedValue={sucursal}
                                onValueChange={(value) => {
                                    setSucursal(value);
                                    setModalSucursal(false);
                                }}
                            >
                                <Picker.Item label="Seleccione una sucursal" value="" />
                                {sucursales.map((s) => (
                                    <Picker.Item key={s.id} label={s.nombre} value={s.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </Modal>

                {/* Servicio */}
                <Text style={styles.label}>Servicio</Text>
                <TouchableOpacity
                    style={styles.inputField}
                    onPress={() => setModalServicio(true)}
                >
                    <Text style={{ color: servicio ? "#222" : "#aaa" }}>
                        {servicio
                            ? servicios.find(s => s.id === servicio)?.nombre
                            : "Seleccione un servicio"}
                    </Text>
                </TouchableOpacity>
                <Modal visible={modalServicio} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Picker
                                selectedValue={servicio}
                                onValueChange={(value) => {
                                    setServicio(value);
                                    setModalServicio(false);
                                }}
                            >
                                <Picker.Item label="Seleccione un servicio" value="" />
                                {servicios.map((s) => (
                                    <Picker.Item key={s.id} label={s.nombre} value={s.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </Modal>

                {/* Fecha */}
                <Text style={styles.label}>Fecha De La Cita</Text>
                <TouchableOpacity
                    style={styles.inputField}
                    onPress={() => setModalFecha(true)}
                >
                    <Text style={{ color: fecha ? "#222" : "#aaa" }}>
                        {fecha
                            ? getFechasCita().find(f => f.value === fecha)?.label
                            : "Seleccione una fecha"}
                    </Text>
                </TouchableOpacity>
                <Modal visible={modalFecha} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Picker
                                selectedValue={fecha}
                                onValueChange={(value) => {
                                    setFecha(value);
                                    setModalFecha(false);
                                }}
                            >
                                <Picker.Item label="Seleccione una fecha" value="" />
                                {getFechasCita().map((f) => (
                                    <Picker.Item key={f.value} label={f.label} value={f.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </Modal>

                {/* Hora */}
                <Text style={styles.label}>Hora De La Cita</Text>
                <TouchableOpacity
                    style={styles.inputField}
                    onPress={() => setModalHora(true)}
                >
                    <Text style={{ color: hora ? "#222" : "#aaa" }}>
                        {hora
                            ? horasCita.find(h => h.value === hora)?.label
                            : "Seleccione una hora"}
                    </Text>
                </TouchableOpacity>
                <Modal visible={modalHora} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Picker
                                selectedValue={hora}
                                onValueChange={(value) => {
                                    setHora(value);
                                    setModalHora(false);
                                }}
                            >
                                <Picker.Item label="Seleccione una hora" value="" />
                                {horasCita.map((h) => (
                                    <Picker.Item key={h.value} label={h.label} value={h.value} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </Modal>
            </View>

            {/* BOTONES INFERIORES */}
            <View style={styles.bottomButtons}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()} 
                >
                    <Text style={styles.buttonTextBottom}>Volver</Text>
                </TouchableOpacity>
                {sucursal && servicio && fecha && hora && (
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => router.push("/scheduleRepairV2")}
                    >
                        <Text style={styles.buttonTextBottom}>Siguiente</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default ScheduleRepair;

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
        width: "80%",       // ocupa solo el 90% del ancho
        alignSelf: "center"
    },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    modalContent: {
        backgroundColor: "#ffffffff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 50,
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


