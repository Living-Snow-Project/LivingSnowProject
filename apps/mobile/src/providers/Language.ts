import { createContext, useContext } from "react";

type LanguageContextValue = {
  language: string;
  setLanguage: (value: string) => void;
};

export const LanguageProvider = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
});

export const useLanguageContext = () => useContext(LanguageProvider);
