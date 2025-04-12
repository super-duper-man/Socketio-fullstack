import { create } from "zustand";

type themeStoreType = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const useThemeStore = create<themeStoreType>((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
