import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notification: null,
  notify: (text, type = "success") => {
    set({ notification: { text, type } });
    setTimeout(() => set({ notification: null }), 3000);
  },
}));

export default useNotificationStore;
