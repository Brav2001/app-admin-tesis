import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import theme from "../../utils/theme";

const ProductItem = ({ product }) => {
  const OpenCamera = () => {};
  return (
    <View style={styles.container}>
      <Link href={`collector/ProductDetail?id=${product.id}`} asChild>
        <TouchableOpacity onPress={OpenCamera}>
          <View style={styles.productItemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productWeigth}>{product.weigth}</Text>
            </View>
            <View>
              <Image
                source={{
                  uri: product.image,
                }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 5,
    backgroundColor: theme.colors.backgroundMain,
    marginBottom: 10,
    borderRadius: 10,
  },
  productItemContainer: {
    backgroundColor: theme.colors.backgroundCards,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
  },
  productDetails: {
    flexDirection: "column",
  },
  productName: {
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.sizes.subtitle,
    fontWeight: "bold",
  },
  productWeigth: {
    color: theme.colors.textPrimary,
    justifyContent: "center",
    alignItems: "center",
    fontSize: theme.fonts.sizes.paragraph,
  },
  productButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  textContainer: {
    marginRight: 5,
  },
});

export default ProductItem;
