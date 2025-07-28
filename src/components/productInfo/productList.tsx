import { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import ProductItem from "./productsItem";
import { useRouter } from "expo-router";
import { retrieveToken } from "@/utils/storageAuth";
import api from "@/utils/api.js";
import axios from "axios";

const ProductList = ({ id }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
          image:
            product.image ||
            "https://olimpica.vtexassets.com/arquivos/ids/765776-800-450?v=637806525173900000&width=800&height=450&aspect=true",
          collected: product.Order_Product_Basket.isCollected,
        }));

        const allCollected = parsed.every((product) => product.collected);
        if (allCollected) {
          router.replace("/collector/OrderDelivery?id=" + id);
        }
        setProducts(parsed);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
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
