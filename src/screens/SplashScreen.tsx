import React, { useEffect } from "react";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <LottieView
        source={require("../assets/animations/BuqhV4qLkW.json")}
        autoPlay
        loop
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
};

export default SplashScreen;
