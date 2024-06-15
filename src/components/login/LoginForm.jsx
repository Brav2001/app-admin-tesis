import { View, Text, StyleSheet } from "react-native";
import InputForm from "./InputForm";
import ActionButton from "../ActionButton";
import { useState } from "react";
import axios from "axios";
import api from "../../utils/api";
import { useStore } from "../../utils/store";
import { storeData } from "../../utils/storageAuth";
import { Formik, useField } from "formik";
import loginSchema from "../../schemas/auth.schema";
import FormikInputValue from "./FormikInputValue";

const initialValues = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [ChangeLogged] = useStore((state) => [state.ChangeLogged]);

  const handleLogin = (values) => {
    //validar datos antes de hacer login
    axios
      .post(api.auth, { email: values.email, password: values.password })
      .then(async (res) => {
        ChangeLogged(true);
        await storeData(res.data);
      })
      .catch(
        (err) => console.log(err) //manejar errores con una alerta
      );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginSchema}
      onSubmit={(values) => handleLogin(values)}
    >
      {({ handleBlur, handleSubmit, values }) => (
        <View>
          <FormikInputValue
            name={"email"}
            type={"text"}
            onBlur={handleBlur("email")}
            value={values.email}
          />
          <FormikInputValue
            type={"password"}
            name={"password"}
            onBlur={handleBlur("password")}
            value={values.password}
          />
          <ActionButton title={"Ingresar"} onPress={handleSubmit} />
        </View>
      )}
    </Formik>
  );
};

export default LoginForm;
