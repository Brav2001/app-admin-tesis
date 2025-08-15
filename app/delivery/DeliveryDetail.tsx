import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import MainCard from "@/components/MainCard";
import HeaderContainerCard from "@/components/general/HeaderContainerCard";
import ProductList from "@/components/delivery/productList";
import theme from "@/utils/theme.js";

const DeliveryDetail = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { id: paramId } = useLocalSearchParams<{ id: string }>();
  const id =
    paramId || "7"; /* redireccionar a la pantalla orderList si no exite el id*/
  return (
    <SafeAreaView style={styles.container}>
      <MainCard title={""}>
        <HeaderContainerCard id={id} />
        <Text style={styles.titleView}>Detalles del pedido</Text>
        <ProductList id={id} />
        <View style={styles.checkContainer}>
          <Text style={styles.textCheck}>
            Confirma que el pedido esta listo antes de entregar
          </Text>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setIsChecked}
          />
        </View>
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor: !isChecked ? "#6a6a6a" : "#D9D9D9",
          }} // Cambia el color del botón según el estado del checkbox
          disabled={!isChecked}
        >
          <Text style={styles.buttonText}>ENTREGAR</Text>
        </TouchableOpacity>
      </MainCard>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundMain,
    paddingHorizontal: 15,
  },
  titleView: {
    fontSize: theme.fonts.sizes.bigtitle,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    textAlign: "center",
  },
  checkContainer: {
    flexDirection: "row", // Texto a la izquierda, checkbox a la derecha
    alignItems: "center",
    justifyContent: "flex-end", // Todo alineado a la derecha del contenedor
    width: "100%",
    paddingHorizontal: 20,
    gap: 10, // Espacio entre el texto y el checkbox
  },
  textCheck: {
    fontSize: 16,
    color: "#fff",
    textAlign: "right", // Alinea el contenido del texto a la derecha
    flexShrink: 1, // Permite que el texto se ajuste si no cabe
  },
  checkbox: {
    borderColor: "#fff",
    backgroundColor: theme.colors.primary,
    width: 35, // Tamaño fijo para evitar problemas
    aspectRatio: 1,
    borderRadius: 10,
  },
  button: {
    // Color de fondo gris claro
    borderRadius: 10, // Bordes redondeados
    paddingVertical: 12, // Espaciado interno vertical
    paddingHorizontal: 24, // Espaciado interno horizontal
    alignItems: "center", // Centrar el texto
    shadowColor: "#000", // Sombra negra
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 4, // Radio de la sombra
    elevation: 5,
    marginTop: 15, // Elevación para Android
  },
  buttonText: {
    color: "#134F45", // Color del texto (verde oscuro)
    fontWeight: "bold", // Texto en negrita
    fontSize: 16, // Tamaño de fuente
  },
});

export default DeliveryDetail;
