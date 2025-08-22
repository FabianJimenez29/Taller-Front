import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const tiposPlaca = [
  { label: "Seleccione Una Opción", value: "" },
  { label: "Particular", value: "particular" },
  { label: "Comercial", value: "comercial" },
  { label: "Transporte Público", value: "publico" },
];

const VehicleInfo = (): React.ReactElement => {
  const router = useRouter();

  const [tipoPlaca, setTipoPlaca] = useState("");
  const [numeroPlaca, setNumeroPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [problema, setProblema] = useState("");

  const [modalPlaca, setModalPlaca] = useState(false);

  return (
    <View style={styles.container}>
      {/* ENCABEZADO */}
      <View style={styles.logoRow}>
        <TouchableOpacity style={styles.languageIcon} onPress={() => alert("Cambiar idioma")}>
          <Ionicons name="language-outline" size={36} color="#000000ff" />
        </TouchableOpacity>
        <View style={styles.logoCenter}>
        <TouchableOpacity style={styles.logoContainer} onPress={() => router.push("/")}>
            <Image
              source={require("../../assets/images/logo.png")}
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
        <TouchableOpacity style={styles.inputField} onPress={() => setModalPlaca(true)}>
          <Text style={{ color: tipoPlaca ? "#222" : "#aaa" }}>
            {tipoPlaca
              ? tiposPlaca.find(t => t.value === tipoPlaca)?.label
              : "Seleccione Una Opción"}
          </Text>
        </TouchableOpacity>
        <Modal visible={modalPlaca} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Picker
                selectedValue={tipoPlaca}
                onValueChange={(value) => {
                  setTipoPlaca(value);
                  setModalPlaca(false);
                }}
              >
                {tiposPlaca.map((t) => (
                  <Picker.Item key={t.value} label={t.label} value={t.value} />
                ))}
              </Picker>
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/scheduleRepair")}>
          <Text style={styles.buttonTextBottom}>Volver</Text>
        </TouchableOpacity>

        {tipoPlaca && numeroPlaca && marca && modelo && problema && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => alert("Siguiente paso")}
          >
            <Text style={styles.buttonTextBottom}>Siguiente</Text>
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