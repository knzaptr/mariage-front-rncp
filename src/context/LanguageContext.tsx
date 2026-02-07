"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // fonction de traduction
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Objet centralisé des traductions
type TranslationsType = { [key: string]: string };
const translations: Record<Language, TranslationsType> = { fr, en };

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("fr");

  // fonction de traduction
  const t = (key: string) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
