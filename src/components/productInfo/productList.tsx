import React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import ProductItem from "./productsItem";
import theme from "../../utils/theme";
import MainCard from "../MainCard";

const products = [
  {
    id: "5",
    name: "Papa",
    weigth: "1kg",
    image:
      "https://olimpica.vtexassets.com/arquivos/ids/765776-800-450?v=637806525173900000&width=800&height=450&aspect=true",
  },
  {
    id: "6",
    name: "Carne",
    weigth: "1kg",
    image:
      "https://olimpica.vtexassets.com/arquivos/ids/765776-800-450?v=637806525173900000&width=800&height=450&aspect=true",
  },
  {
    id: "7",
    name: "Leche",
    weigth: "1L",
    image:
      "https://olimpica.vtexassets.com/arquivos/ids/765776-800-450?v=637806525173900000&width=800&height=450&aspect=true",
  },
  {
    id: "8",
    name: "Jugo",
    weigth: "1L",
    image:
      "https://olimpica.vtexassets.com/arquivos/ids/765776-800-450?v=637806525173900000&width=800&height=450&aspect=true",
  },
  {
    id: "9",
    name: "Arroz",
    weigth: "1kg",
    image:
      "https://olimpica.vtexassets.com/arquivos/ids/765776-800-450?v=637806525173900000&width=800&height=450&aspect=true",
  },
];

const ProductList = ({ id }) => {
  return (
    <MainCard>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductItem product={item} />}
        keyExtractor={(item) => item.id}
        style={styles.productList}
      />
    </MainCard>
  );
};

const styles = StyleSheet.create({
  productList: {
    width: "100%",
  },
});

export default ProductList;
