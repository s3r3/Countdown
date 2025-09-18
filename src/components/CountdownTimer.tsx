import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { setupNotificationListener } from "../utils/notifications";

interface CountdownTimerProps {
  time: number; // Waktu dalam detik
}

const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ time }) => {
  const scale = useSharedValue(1);

  // Setup listener hanya sekali
  useEffect(() => {
    const subscription = setupNotificationListener();
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  // Animasi scale ketika `time` berubah
  useEffect(() => {
    scale.value = withTiming(1.1, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 100 });
    });
  }, [time, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.timerText, animatedStyle]}>
        {formatTime(time)}
      </Animated.Text>
    </View>
  );
};

export default CountdownTimer;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  timerText: {
    fontSize: 48, // setara dengan text-6xl
    fontWeight: "bold",
    color: "#111827", // tailwind text-gray-900
  },
});
