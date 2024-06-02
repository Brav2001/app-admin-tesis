import { Pressable, StyleSheet, View, Text } from "react-native";
import theme from "../utils/theme";

const ActionButton = ({ title, onPress = () => {} }) => {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: pressed
              ? theme.colors.backgroundActionButtonsPressed
              : theme.colors.backgroundActionButtons,
          },
        ]}
      >
        <Text style={styles.title}>{title}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    backgroundColor: theme.colors.backgroundMain,
    paddingBottom: 5,
    borderRadius: 15,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 15,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.main,
    fontWeight: "600",
  },
});

export default ActionButton;
