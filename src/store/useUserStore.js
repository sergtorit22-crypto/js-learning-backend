import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: null,

      // Просто записуємо дані користувача при вході
      login: (userData) => set({ user: userData }),

      // Очищаємо при виході
      logout: () => {
        set({ user: null });
        window.location.href = "/"; // Жорсткий перехід на головну
      },
    }),
    {
      name: "user-auth-storage",
    },
  ),
);

export default useUserStore;
