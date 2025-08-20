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
} from "./storageAuth";
import axios from "axios";
import api from "./api";

const GEOFENCE_TASK = "GEOFENCE_TASK";

TaskManager.defineTask(
  GEOFENCE_TASK,
  async ({ data: { eventType }, error }) => {
    if (error) {
      console.error("Error en geofencing:", error);
      return;
    }

    const isActive = await retrieveActiveDelivery();
    const nameZone = await retrieveNameZone();

    if (eventType === Location.GeofencingEventType.Enter) {
      if (isActive === "true") {
        const payload = {
          status: "Disponible",
        };
        const headers = {
          "auth-token": await retrieveToken(),
        };
        const params = {
          id: await retrieveId(),
        };

        console.log("Enviando a la API (ENTER):", {
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

        console.log("Entraste en el área y estás trabajando, API notificada.");
      }
    } else if (eventType === Location.GeofencingEventType.Exit) {
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
          body: "Ahora estás inactivo y no recibirás pedidos hasta volver a entrar",
          sound: "default",
        },
        trigger: null,
      });
      console.log("Saliste del área, API notificada.");
    }
  }
);

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

  console.log("Región objetivo:", TARGET_REGION);

  await Location.startGeofencingAsync(GEOFENCE_TASK, [TARGET_REGION]);
  await saveGeofencingStart("true");
  console.log("Geofencing iniciado");
}

// Función para detener geofencing
export async function stopGeofencing() {
  const started = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK);
  if (started) {
    await Location.stopGeofencingAsync(GEOFENCE_TASK);
    await saveGeofencingStart("false");
    console.log("Geofencing detenido");
  } else {
    console.log("Geofencing ya estaba detenido");
  }
}
