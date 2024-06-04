import React from "react";
import { StyleSheet, View, Text } from "react-native";
import theme from "../../utils/theme";

const Header = ({ name }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>JUAN SEBASTIAN</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.backgroundCards,
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 10,
    width: "90%",
    alignItems: "center",
  },
  headerText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.sizes.title,
    fontWeight: theme.fonts.main,
  },
});

export default Header;
