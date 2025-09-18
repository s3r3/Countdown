import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./en.json";
import id from "./id.json";

// Ambil kode bahasa dari device
const deviceLanguage = Localization.getLocales()[0]?.languageCode || "en";

i18n.use(initReactI18next).init({
  lng: deviceLanguage.startsWith("id") ? "id" : "en",
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    id: { translation: id },
  },
  interpolation: {
    escapeValue: false, // React sudah aman dari XSS
  },
});

export default i18n;
