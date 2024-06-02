import { StyleSheet, Text, TextInput, View } from "react-native";
import theme from "../../utils/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialIcons } from "@expo/vector-icons";

const InputForm = ({ type }) => {
  return (
    <View style={styles.inputContainer}>
      {type === "password" ? (
        <MaterialIcons
          name="password"
          size={24}
          color="white"
          style={styles.icon}
        />
      ) : (
        <AntDesign name="user" size={24} color="white" style={styles.icon} />
      )}

      <TextInput
        style={styles.input}
        placeholder={type === "password" ? "Password" : "Username"}
        placeholderTextColor={"#fff"}
        selectionColor={theme.colors.primary}
        secureTextEntry={type === "password"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundInputs,
    borderRadius: 15,
    height: 40,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontStyle: theme.fonts.main,
  },
  icon: {
    marginRight: 10,
  },
});

export default InputForm;
