import { createContext, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { translate, type Language } from "./translations";

export const LANGUAGE_KEY = "calendarul-naturii-language";
type Values = Record<string, string | number>;
type LanguageControls = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, values?: Values) => string;
  labelFor: (canonical: string) => string;
};
const Context = createContext<LanguageControls | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setCurrent] = useState<Language>(() => {
    try {
      return localStorage.getItem(LANGUAGE_KEY) === "de" ? "de" : "ro";
    } catch {
      return "ro";
    }
  });
  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.title = language === "de"
      ? "Naturkalender – Morgenkreis"
      : "Calendarul naturii – Întâlnirea de dimineață";
  }, [language]);
  const value = useMemo(() => {
    const t = (key: string, values: Values = {}) =>
      translate(key, language).replace(/\{(\w+)\}/g, (token, name: string) =>
        Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : token,
      );
    return {
      language,
      t,
      labelFor: t,
      setLanguage(next: Language) {
        setCurrent(next);
        try {
          localStorage.setItem(LANGUAGE_KEY, next);
        } catch {
          // Session choice still works when storage is unavailable.
        }
      },
    };
  }, [language]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useLanguage() {
  const value = useContext(Context);
  if (!value) throw new Error("useLanguage requires LanguageProvider");
  return value;
}
