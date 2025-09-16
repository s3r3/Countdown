// App.tsx
import React from "react";
import { LogBox } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import "./global.css";

// Ignore Metro "level" bug
LogBox.ignoreLogs([
  "Cannot read property 'level' of undefined",
]);

const App = () => {
  return <AppNavigator />;
};

export default App;
