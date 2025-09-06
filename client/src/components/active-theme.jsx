"use client";

import { createContext, useContext, useEffect, useState } from "react";

const DEFAULT_THEME = "catppuccin";
const ThemeContext = createContext(undefined);

export const themeList = ["default", "slate", "mocha-mousse", "catppuccin"];
export const themeListTranslated = {
  default: "Výchozí",
  slate: "Břidlice",
  "mocha-mousse": "Mocha pěna",
  catppuccin: "Catppuccin",
};

export function ActiveThemeProvider({
  children,
  initialTheme = DEFAULT_THEME,
  storageKey = "shadcn-ui-theme",
}) {
  const [activeTheme, setActiveTheme] = useState(initialTheme);

  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey);
    if (storedTheme && themeList.includes(storedTheme)) {
      setActiveTheme(storedTheme);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    themeList.forEach((element) => {
      root.classList.remove(`theme-${element}`);
    });
    root.classList.add(`theme-${activeTheme}`);
    localStorage.setItem(storageKey, activeTheme);
  }, [activeTheme, storageKey]);

  const value = {
    activeTheme,
    setActiveTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeConfig() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useThemeConfig must be used within an ActiveThemeProvider"
    );
  }
  return context;
}
