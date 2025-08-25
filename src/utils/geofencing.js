import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import {
  retrieveId,
  retrieveToken,
  saveGeofencingStart,
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
    return;
  }

  if (data) {
    const nameZone = await retrieveNameZone();

    const bodegaData = await retrieveLocationStorage();

    const statusStaff = (await retrieveStatusStaff()) || "Inactivo";

    const token = (await retrieveToken()) || null;

    const id = (await retrieveId()) || null;

    if (!token || !id) {
      await stopGeofencing();
    }

    const { latitude, longitude } = data.locations[0].coords;

    const distance = getDistance(
      { latitude, longitude },
      { latitude: bodegaData.latitude, longitude: bodegaData.longitude }
    );

    if (distance <= bodegaData.radius && statusStaff !== "Disponible") {
      try {
        const payload = {
          status: "Disponible",
        };
        const headers = {
          "auth-token": token,
        };
        const params = {
          id: id,
        };
        const response = await axios.put(
          api.updateStatusStaff(params.id),
          payload,
          { headers, timeout: 5000 }
        );
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `¡Bienvenido a la Bodega ${nameZone} !`,
            body: `Entraste en ${nameZone}. Ahora estás disponible para recibir pedidos`,
            sound: "default",
          },
          trigger: null,
        });

        await saveStatusStaff("Disponible");
      } catch (apiError) {}
    } else {
      if (statusStaff === "Inactivo") {
        try {
          const payload = {
            status: "Inactivo",
          };
          const headers = {
            "auth-token": token,
          };
          const params = {
            id: id,
          };
          const response = await axios.put(
            api.updateStatusStaff(params.id),
            payload,
            { headers, timeout: 5000 }
          );
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Saliste de la bodega ${nameZone}`,
              body: "Ahora estás inactivo y no recibirás pedidos hasta volver a entrar.",
              sound: "default",
            },
            trigger: null,
          });
          await saveStatusStaff("Inactivo");
        } catch (apiError) {}
      }
    }
  }
});

// Función para iniciar el geofencing
export async function startGeofencing() {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    let bgStatus = await Location.requestBackgroundPermissionsAsync();
    if (bgStatus.status !== "granted") {
      return;
    }

    const data = await axios.get(api.getAdministrationData, {
      headers: {
        "auth-token": await retrieveToken(),
      },
    });

    const TARGET_REGION = {
      latitude: parseFloat(data.data[0].latitude),
      longitude: parseFloat(data.data[0].longitude),
      radius: parseFloat(data.data[0].radius),
    };

    await saveNameZone(data.data[0].name);
    await saveLocationStorage(TARGET_REGION);

    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
      accuracy: Location.Accuracy.High,
      timeInterval: 1000, // cada 1 segundo
      distanceInterval: 10, // o cada 0 metros
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Rastreo activo",
        notificationBody: "Tu ubicación está siendo usada",
      },
    });
    await saveGeofencingStart("true");
  } catch (error) {
    await saveGeofencingStart("false");
  }
}

// Función para detener geofencing
export async function stopGeofencing() {
  try {
    const started = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK
    );
    if (started) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK);
    }
    await saveGeofencingStart("false");
  } catch (error) {
    // Forzar el estado a false incluso si hay error
    await saveGeofencingStart("false");
  }
}
