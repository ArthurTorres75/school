"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { LANGUAGE_STORAGE_KEY, isLanguage, type Language } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  language: Language;
}

export function LanguageProvider({ children, language }: LanguageProviderProps) {
  const subscribe = (onStoreChange: () => void) => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === LANGUAGE_STORAGE_KEY) {
        onStoreChange();
      }
    };

    const handleLanguageChange = () => {
      onStoreChange();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("school-language-change", handleLanguageChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("school-language-change", handleLanguageChange);
    };
  };

  const getSnapshot = () => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguage(savedLanguage) ? savedLanguage : language;
  };

  const getServerSnapshot = () => language;

  const currentLanguage = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLanguage = (nextLanguage: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    window.dispatchEvent(new Event("school-language-change"));
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const contextValue: LanguageContextType = {
    language: currentLanguage,
    setLanguage,
  };

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
