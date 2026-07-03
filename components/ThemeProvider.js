"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ isDark: false, toggle: () => {} });

function getInitialTheme() {
  if (typeof window === "undefined") return false;

  const stored = localStorage.getItem("theme");
  if (stored === "dark") return true;
  if (stored === "light") return false;

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsDark(getInitialTheme());
    setMounted(true);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!localStorage.getItem("theme")) {
        setIsDark(media.matches);
        document.documentElement.classList.toggle("dark", media.matches);
      }
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark, mounted]);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
