"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

import {
  THEME,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  isTheme,
  type Theme,
} from "@/lib/i18n";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const subscribe = (onStoreChange: () => void) => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === THEME_STORAGE_KEY) {
        onStoreChange();
      }
    };

    const handleThemeChange = () => {
      onStoreChange();
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    window.addEventListener("storage", handleStorage);
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  };

  const getSnapshot = (): Theme => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (isTheme(savedTheme)) {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEME.DARK
      : THEME.LIGHT;
  };

  const getServerSnapshot = (): Theme => THEME.LIGHT;

  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === THEME.DARK);
  }, [theme]);

  const setTheme = (nextTheme: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
