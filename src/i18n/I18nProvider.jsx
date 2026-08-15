import { useEffect, useMemo, useState } from "react";
import { I18nContext } from "./I18nContext";
import { translations } from "./translations";

function getInitialLanguage() {
  const savedLanguage = window.localStorage.getItem("milano-language");
  return savedLanguage === "en" ? "en" : "ar";
}

export default function I18nProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("milano-language", language);
  }, [language]);

  const value = useMemo(() => {
    function t(key, variables = {}) {
      const message =
        translations[language][key] ??
        translations.en[key] ??
        key;

      return message.replace(/\{\{(\w+)\}\}/g, (_, name) =>
        String(variables[name] ?? ""),
      );
    }

    function localize(content) {
      if (typeof content === "string" || typeof content === "number") {
        return String(content);
      }
      return content?.[language] ?? content?.en ?? content?.ar ?? "";
    }

    return {
      language,
      isArabic: language === "ar",
      setLanguage,
      toggleLanguage: () =>
        setLanguage((current) => (current === "ar" ? "en" : "ar")),
      t,
      localize,
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
