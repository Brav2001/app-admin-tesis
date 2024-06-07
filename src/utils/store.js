import { create } from "zustand";

export const useStore = create((set) => ({
  logged: false,
  ChangeLogged: (value) => set((state) => ({ logged: value })),
}));
