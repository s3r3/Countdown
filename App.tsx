import "react-native-get-random-values"; // ⬅️ harus paling atas

import React, { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import "./src/i18n"; // Inisialisasi i18n
import {
  setupNotificationListener,
  requestNotificationPermission,
} from "./src/utils/notifications";
import "./global.css";
import i18n from "./src/i18n";
import { useAppStore } from "./src/store";

const App: React.FC = () => {
  const language = useAppStore((state) => state.userPrefs.language);

  // 🔑 Sinkronisasi bahasa dengan i18n
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    const initNotifications = async () => {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        const subscription = setupNotificationListener();
        return () => subscription.remove();
      }
    };
    initNotifications();
  }, []);

  return <AppNavigator />;
};

export default App;
