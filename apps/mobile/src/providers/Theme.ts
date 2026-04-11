import { createContext, useContext } from "react";

type ThemeContextValue = {
  themeName: "light" | "dark";
  setThemeName: (value: "light" | "dark") => void;
};

export const ThemeProvider = createContext<ThemeContextValue>({
  themeName: "light",
  setThemeName: () => {},
});

export const useThemeContext = () => useContext(ThemeProvider);
