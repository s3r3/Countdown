import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import HomeScreen from "../screens/HomeScreen";
import AddEventScreen from "../screens/AddEventScreen";
import CountdownScreen from "../screens/CountdownScreen";
import StatsScreen from "../screens/StatsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { colors } from "../constants/colors";
import { useNavigation } from "@react-navigation/native";

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  AddEvent: undefined;
  Countdown: { eventId: string };
  Stats: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.splashContainer}>
      <LottieView
        source={require("../assets/animations/BuqhV4qLkW.json")}
        autoPlay
        loop
        style={{ flex: 1 }}
      />
    </View>
  );
};

const AppNavigator: React.FC = () => {
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddEvent"
          component={AddEventScreen}
          options={{ title: t("addEvent.title") }}
        />
        <Stack.Screen
          name="Countdown"
          component={CountdownScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stats"
          component={StatsScreen}
          options={{ title: t("stats.title") }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: t("settings.title") }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
});
