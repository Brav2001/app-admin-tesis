import * as SecureStore from "expo-secure-store";

export const storeData = async (data) => {
  console.log("Data recibida:", data);
  try {
    await SecureStore.setItemAsync("authToken", data.token);
    await SecureStore.setItemAsync("authId", data.Staff.id);
    await SecureStore.setItemAsync("authRol", data.Rol.name);
  } catch (error) {
    console.log("Error al almacenar el token:", error);
  }
};

export const retrieveAuth = async () => {
  try {
    const token = await SecureStore.getItemAsync("authId");
    const rol = await SecureStore.getItemAsync("authRol");
    const id = await SecureStore.getItemAsync("authId");
    if (token && rol && id) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error al recuperar el auth:", error);
  }
};

export const retrieveRol = async () => {
  try {
    const rol = await SecureStore.getItemAsync("authRol");
    if (rol) {
      console.log("Rol recuperado:", rol);
    } else {
      console.log("No se encontró ningún Rol almacenado");
    }
  } catch (error) {
    console.log("Error al recuperar el Rol:", error);
  }
};

export const retrieveId = async () => {
  try {
    const id = await SecureStore.getItemAsync("authId");
    if (id) {
      console.log("Id recuperado:", id);
    } else {
      console.log("No se encontró ningún Id almacenado");
    }
  } catch (error) {
    console.log("Error al recuperar el Id:", error);
  }
};

export const retrieveToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("authToken");
    if (token) {
      console.log("Token recuperado:", token);
    } else {
      console.log("No se encontró ningún token almacenado");
    }
  } catch (error) {
    console.log("Error al recuperar el token:", error);
  }
};

export const removeData = async () => {
  try {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("authId");
    await SecureStore.deleteItemAsync("authRol");
  } catch (error) {
    console.log("Error al eliminar la data:", error);
  }
};
