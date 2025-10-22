/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import en from "../../locales/en/common.json";
import ru from "../../locales/ru/common.json";

export type Lang = "en" | "ru";

interface LanguageContextType {
  userLang: Lang;
  setUserLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
 en: en as Record<string, string>,
  ru: ru as Record<string, string>,
};

const LanguageContext = createContext<LanguageContextType>({
  userLang: "en",
  setUserLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [userLang, setUserLangState] = useState<Lang>("en");

  useEffect(() => {
    // Load language from localStorage if available
    const stored = localStorage.getItem("userLang") as Lang;
       if (stored && translations[stored]) {
      setUserLangState(stored);
    } else {
      setUserLangState("en"); // Default if nothing stored
    }
  }, []);

  const setUserLang = (lang: Lang) => {
    if (!translations[lang]) return;
    setUserLangState(lang);
    localStorage.setItem("userLang", lang);
    
  };

  // Function to get translated string
  const t = (key: string) => {
    return translations[userLang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ userLang, setUserLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);





