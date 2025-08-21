import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import {
  retrieveActiveDelivery,
  retrieveId,
  retrieveToken,
  saveGeofencingStart,
  retrieveGeofencingStart,
  saveNameZone,
  retrieveNameZone,
  saveLocationStorage,
  retrieveLocationStorage,
  saveStatusStaff,
  retrieveStatusStaff,
} from "./storageAuth";
import axios from "axios";
import api from "./api";
import { getDistance } from "geolib";

const LOCATION_TASK = "LOCATION_TASK";

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Error en geofencing:", error);
    return;
  }
  console.log("Data: ", data);

  if (data) {
    const isActive = await retrieveActiveDelivery();
    const nameZone = await retrieveNameZone();

    const bodegaData = await retrieveLocationStorage();

    const { latitude, longitude } = data.locations[0].coords;

    const distance = getDistance(
      { latitude, longitude },
      { latitude: bodegaData.latitude, longitude: bodegaData.longitude }
    );

    if (distance <= bodegaData.radius) {
      if (
        isActive === "true" &&
        (await retrieveStatusStaff()) !== "Disponible"
      ) {
        const payload = {
          status: "Disponible",
        };
        const headers = {
          "auth-token": await retrieveToken(),
        };
        const params = {
          id: await retrieveId(),
        };

        try {
          const response = await axios.put(
            api.updateStatusStaff(params.id),
            payload,
            { headers }
          );
          console.log("Respuesta de la API (ENTER):", response.data);
        } catch (apiError) {
          console.error("Error al notificar API (ENTER):", apiError);
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `¡Bienvenido a la Bodega ${nameZone} !`,
            body: `Entraste en ${nameZone}. Ahora estás disponible para recibir pedidos`,
            sound: "default",
          },
          trigger: null,
        });

        await saveStatusStaff("Disponible");
      }
    } else {
      if (
        (await retrieveStatusStaff()) === "Disponible" ||
        (await retrieveStatusStaff()) === undefined ||
        (await retrieveStatusStaff()) === null
      ) {
        const payload = {
          status: "Inactivo",
        };
        const headers = {
          "auth-token": await retrieveToken(),
        };
        const params = {
          id: await retrieveId(),
        };

        console.log("Enviando a la API (EXIT):", {
          url: api.updateStatusStaff(params.id),
          payload,
          headers,
        });

        try {
          const response = await axios.put(
            api.updateStatusStaff(params.id),
            payload,
            { headers }
          );
          console.log("Respuesta de la API (EXIT):", response.data);
        } catch (apiError) {
          console.error("Error al notificar API (EXIT):", apiError);
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Saliste de la bodega ${nameZone}`,
            body: "Ahora estás inactivo y no recibirás pedidos hasta volver a entrar.",
            sound: "default",
          },
          trigger: null,
        });
        await saveStatusStaff("Inactivo");
      }
    }
  }
});

// Función para iniciar el geofencing
export async function startGeofencing() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.error("Permiso de ubicación en primer plano denegado");
    return;
  }

  let bgStatus = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus.status !== "granted") {
    console.error("Permiso de ubicación en segundo plano denegado");
    return;
  }

  const data = await axios.get(api.getAdministrationData, {
    headers: {
      "auth-token": await retrieveToken(),
    },
  });

  console.info("Datos de geofencing:", data.data);

  const TARGET_REGION = {
    latitude: parseFloat(data.data[0].latitude),
    longitude: parseFloat(data.data[0].longitude),
    radius: parseFloat(data.data[0].radius),
  };

  await saveNameZone(data.data[0].name);
  await saveLocationStorage(TARGET_REGION);

  console.log("Región objetivo:", TARGET_REGION);

  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.High,
    timeInterval: 1000, // cada 1 segundo
    distanceInterval: 10, // o cada 10 metros
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "Rastreo activo",
      notificationBody: "Tu ubicación está siendo usada",
    },
  });
  await saveGeofencingStart("true");
  console.log("Geofencing iniciado");
}

// Función para detener geofencing
export async function stopGeofencing() {
  const started = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
  if (started) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK);
    console.log("Rastreo detenido");
  }
}
