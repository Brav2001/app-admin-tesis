import { useEffect, useState } from "react";
import { StyleSheet, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "@/utils/theme.js";
import HeaderContainerCard from "@/components/general/HeaderContainerCard";
import MainCard from "@/components/MainCard";
import CardInfo from "@/components/general/CardInfo";
import { router, useLocalSearchParams } from "expo-router";
import QrButton from "@/components/general/QrButton";
import { useStore } from "@/utils/store";
import { retrieveToken } from "@/utils/storageAuth";
import api from "@/utils/api.js";
import axios from "axios";
import Toast from "react-native-toast-message";

const ProductDetail = () => {
  const [data, setData] = useState(null);
  const [basket, setBasket] = useState(null);
  const [opb, setOpb] = useState(null);
  const [loading, setLoading] = useState(true);
  const { qr, clearQR } = useStore();
  const { id: paramId } = useLocalSearchParams<{ id: string }>();
  const id =
    paramId || "7"; /* redireccionar a la pantalla orderList si no exite el id*/

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await retrieveToken();
        const response = await axios.get(api.getOneOrderProductDetail(id), {
          headers: {
            "auth-token": token,
          },
        });

        const data = response.data;

        const parsed = data.map((product) => ({
          id: product.id,
          name: product.Product.name,
          weigth: `${product.weight} gr`,
          image:
            product.Product.image ||
            "https://olimpica.vtexassets.com/arquivos/ids/765776-800-450?v=637806525173900000&width=800&height=450&aspect=true",
          aisle: product.Order_Product_Basket.Basket.Level.Shelve.Aisle.number,
          shelve: product.Order_Product_Basket.Basket.Level.Shelve.number,
          level: product.Order_Product_Basket.Basket.Level.number,
          basket: product.Order_Product_Basket.Basket.id
            .slice(-6)
            .toUpperCase(),
        }));

        setData(parsed[0]);

        setBasket(data[0].Order_Product_Basket.Basket.id);
        setOpb(data[0].Order_Product_Basket.id);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (qr && basket && opb) {
      if (qr !== basket) {
        Toast.show({
          type: "error",
          text1: "Código QR no coincide",
          text2: "Por favor, escanea el código QR correcto.",
        });
        clearQR();
        return;
      }
      axios
        .patch(api.collectProductOrder(opb), {
          headers: {
            "auth-token": retrieveToken(),
          },
        })
        .then(() => {
          Toast.show({
            type: "success",
            text1: "Producto recogido",
            text2: "El producto ha sido recogido correctamente.",
          });
          setBasket(null);
          setOpb(null);
          clearQR();
          router.back();
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            text1: "Error al recoger el producto",
            text2: "Por favor, inténtalo de nuevo.",
          });
          console.error("Error al recoger el producto:", error);
        });
      clearQR();
    }
  }, [qr, clearQR, basket, opb]);

  return (
    <SafeAreaView style={styles.container}>
      <MainCard title={""}>
        <HeaderContainerCard id={id} />
        <Text style={styles.titleView}>Detalles del producto</Text>
        <Image source={{ uri: data?.image }} style={styles.image} />
        <CardInfo title={data?.name}>
          <Text style={styles.infoText}>{data?.weigth}</Text>
          <Text style={styles.infoText}>Pasillo: {data?.aisle}</Text>
          <Text style={styles.infoText}>Estante: {data?.shelve}</Text>
          <Text style={styles.infoText}>Nivel: {data?.level}</Text>
          <Text style={styles.infoText}>Canasta: {data?.basket}</Text>
        </CardInfo>
        <QrButton />
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
  image: {
    width: "100%",
    aspectRatio: 16 / 10,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  infoText: {
    color: theme.colors.textPrimary,
    justifyContent: "center",
    alignItems: "center",
    fontSize: theme.fonts.sizes.subtitle,
    marginTop: 5,
  },
});

export default ProductDetail;
