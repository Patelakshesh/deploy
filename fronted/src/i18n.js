import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en.json";
import frTranslation from "./locales/fr.json";

i18n
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation }
    },
    lng: "en", // Default language
    fallbackLng: "en", // Fallback language if the selected one is missing
    interpolation: { escapeValue: false }
  });

export default i18n;
