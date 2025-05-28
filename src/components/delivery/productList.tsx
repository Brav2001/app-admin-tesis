import { useEffect } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import ProductItem from "./productsItem";
import { useRouter } from "expo-router";

const products = [
  {
    id: "5",
    name: "Papa",
    weigth: "1kg",
  },
  {
    id: "6",
    name: "Carne",
    weigth: "1kg",
  },
  {
    id: "7",
    name: "Leche",
    weigth: "1L",
  },
  {
    id: "8",
    name: "Jugo",
    weigth: "1L",
  },
  {
    id: "9",
    name: "Arroz",
    weigth: "1kg",
  },
];

const ProductList = () => {
  const router = useRouter();

  return (
    <View
      style={{
        width: "90%",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: "auto",
        flex: 1,
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
