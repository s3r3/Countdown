
import React, { useEffect } from 'react';
import AppNavigator  from './src/navigation/AppNavigator';
// import './src/i18n'; // Inisialisasi i18n
import { setupNotificationListener, requestNotificationPermission } from './src/utils/notifications';
import "./global.css"

const App: React.FC = () => {
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
