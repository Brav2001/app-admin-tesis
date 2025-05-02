import { useEffect } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import ProductItem from "./productsItem";
import MainCard from "../MainCard";
import { useRouter } from "expo-router";

const products = [
  {
    id: "5",
    name: "Papa",
    weigth: "1kg",
    image:
      "https://olimpica.vtexassets.com/arquivos/ids/765776-800-450?v=637806525173900000&width=800&height=450&aspect=true",
    collected: true,
  },
  {
    id: "6",
    name: "Carne",
    weigth: "1kg",
    image:
      "https://olimpica.vtexassets.com/arquivos/ids/765776-800-450?v=637806525173900000&width=800&height=450&aspect=true",
    collected: true,
  },
  {
    id: "7",
    name: "Leche",
    weigth: "1L",
    image:
      "https://olimpica.vtexassets.com/arquivos/ids/765776-800-450?v=637806525173900000&width=800&height=450&aspect=true",
    collected: true,
  },
  {
    id: "8",
    name: "Jugo",
    weigth: "1L",
    image:
      "https://olimpica.vtexassets.com/arquivos/ids/765776-800-450?v=637806525173900000&width=800&height=450&aspect=true",
    collected: true,
  },
  {
    id: "9",
    name: "Arroz",
    weigth: "1kg",
    image:
      "https://olimpica.vtexassets.com/arquivos/ids/765776-800-450?v=637806525173900000&width=800&height=450&aspect=true",
    collected: true,
  },
];

const ProductList = ({ id }) => {
  const router = useRouter();

  useEffect(() => {
    const allCollected = products.every((product) => product.collected);
    if (allCollected) {
      router.replace("/collector/OrderDelivery?id=" + id);
    }
  }, []);
  return (
    <View
      style={{
        width: "90%",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: "auto",
      }}
    >
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductItem product={item} />}
        keyExtractor={(item) => item.id}
        style={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  productList: {
    width: "100%",
    maxHeight: "90%",
  },
});

export default ProductList;
