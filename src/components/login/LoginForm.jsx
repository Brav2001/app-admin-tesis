import { View } from "react-native";
import InputForm from "./InputForm";
import ActionButton from "../ActionButton";

const LoginForm = () => {
  return (
    <View>
      <InputForm type={"text"} />
      <InputForm type={"password"} />
      <ActionButton
        title={"Ingresar"}
        onPress={() => {
          console.log("press");
        }}
      />
    </View>
  );
};

export default LoginForm;
