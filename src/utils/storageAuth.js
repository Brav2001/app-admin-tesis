import * as SecureStore from "expo-secure-store";

export const storeData = async (data) => {
  try {
    await SecureStore.setItemAsync("authToken", data.token);
    await SecureStore.setItemAsync("authId", data.Staff.id);
    await SecureStore.setItemAsync("authRol", data.Rol.name);
  } catch (error) {
    console.log("Error al almacenar el token:", error);
  }
};

export const saveActiveDelivery = async (value) => {
  try {
    await SecureStore.setItemAsync("activeDelivery", value);
  } catch (error) {
    console.log("Error al almacenar el activeDelivery:", error);
  }
};

export const saveGeofencingStart = async (value) => {
  try {
    await SecureStore.setItemAsync("geofencingStart", value);
  } catch (error) {
    console.log("Error al almacenar el geofencingStart:", error);
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
      return rol;
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
      return id;
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
      return token;
    } else {
      console.log("No se encontró ningún token almacenado");
    }
  } catch (error) {
    console.log("Error al recuperar el token:", error);
  }
};

export const retrieveActiveDelivery = async () => {
  try {
    const activeDelivery = await SecureStore.getItemAsync("activeDelivery");
    if (activeDelivery) {
      return activeDelivery;
    } else {
      console.log("No se encontró ningún activeDelivery almacenado");
    }
  } catch (error) {
    console.log("Error al recuperar el activeDelivery:", error);
  }
};

export const retrieveGeofencingStart = async () => {
  try {
    const geofencingStart = await SecureStore.getItemAsync("geofencingStart");
    if (geofencingStart) {
      return geofencingStart;
    } else {
      console.log("No se encontró ningún geofencingStart almacenado");
    }
  } catch (error) {
    console.log("Error al recuperar el geofencingStart:", error);
  }
};

export const removeData = async () => {
  try {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("authId");
    await SecureStore.deleteItemAsync("authRol");
    await SecureStore.deleteItemAsync("activeDelivery");
    await SecureStore.deleteItemAsync("geofencingStart");
  } catch (error) {
    console.log("Error al eliminar la data:", error);
  }
};
