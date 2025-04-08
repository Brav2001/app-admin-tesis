import { create } from "zustand";

export const useStore = create((set) => ({
  logged: false,
  dataStaff: null,
  qr: null,
  ChangeLogged: (value) => set((state) => ({ logged: value })),
  ChangeDataStaff: (value) => set((state) => ({ dataStaff: value })),
  setQR: (data) => set({ qr: data }),
  clearQR: () => set({ qr: null }),
}));
