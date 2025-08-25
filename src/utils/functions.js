import { saveStatusStaff, retrieveId, retrieveToken } from "./storageAuth";
import api from "./api";
import axios from "axios";

export const formatTimeDifference = (createdAt) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diffMs = now - createdDate;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;

  if (diffDays > 0) {
    return `${diffDays} día(s), ${remainingHours} hora(s) y ${remainingMinutes} minuto(s)`;
  } else if (diffHours > 0) {
    return `${diffHours} hora(s) y ${remainingMinutes} minuto(s)`;
  } else {
    return `${diffMinutes} minuto(s)`;
  }
};

export const inactiveStaff = async () => {
  await axios
    .put(
      api.updateStatusStaff(await retrieveId()),
      { status: "Inactivo" },
      {
        headers: {
          "auth-token": await retrieveToken(),
        },
      }
    )
    .then(async () => {
      await saveStatusStaff("Inactivo");
    })
    .catch((error) => {
      console.error("Error al actualizar el estado del personal:", error);
    });
};
