import React from "react";
import { StyleSheet, View, Text } from "react-native";
import theme from "../../utils/theme";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";

const UserInfo = () => {
  return (
    <View style={styles.userInfoContainer}>
      <View style={styles.infoBox}>
        <FontAwesome6 name="clipboard-user" size={32} color="#FFFFFF" />
        <Text style={styles.infoText}>Recolector</Text>
      </View>
      <View style={styles.infoBox}>
        <MaterialCommunityIcons
          name="clipboard-list-outline"
          size={38}
          color="#FFFFFF"
        />
        <Text style={styles.infoText}>15</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
    justifyContent: "space-between",
  },
  infoBox: {
    maxWidth: "45%",
    backgroundColor: theme.colors.backgroundCards,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  infoText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.sizes.paragraph,
  },
});

export default UserInfo;
