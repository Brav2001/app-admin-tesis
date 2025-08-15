import { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import ProductItem from "./productsItem";
import { useRouter } from "expo-router";
import { retrieveToken } from "@/utils/storageAuth";
import api from "@/utils/api.js";
import axios from "axios";

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

const ProductList = ({ id }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await retrieveToken();
        const response = await axios.get(api.getOrderProductAllDetail(id), {
          headers: {
            "auth-token": token,
          },
        });

        const data = response.data;

        const parsed = data.map((product) => ({
          id: product.id,
          name: product.Product.name,
          weigth: `${product.weight} gr`,
        }));

        setProducts(parsed);

        console.log("Products fetched successfully:", parsed);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);
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
