import { View } from "react-native";
import InputForm from "./InputForm";
import ActionButton from "../ActionButton";
import { useState } from "react";
import axios from "axios";
import api from "../../utils/api";
import { useStore } from "../../utils/store";
import { storeData } from "../../utils/storageAuth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [ChangeLogged] = useStore((state) => [state.ChangeLogged]);

  const handleLogin = () => {
    //validar datos antes de hacer login
    axios
      .post(api.auth, { email, password })
      .then(async (res) => {
        ChangeLogged(true);
        await storeData(res.data);
      })
      .catch(
        (err) => console.log(err) //manejar errores con una alerta
      );
  };

  return (
    <View>
      <InputForm type={"text"} value={email} setValue={setEmail} />
      <InputForm type={"password"} value={password} setValue={setPassword} />
      <ActionButton title={"Ingresar"} onPress={handleLogin} />
    </View>
  );
};

export default LoginForm;
