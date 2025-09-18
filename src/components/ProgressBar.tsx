import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface ProgressBarProps {
  progress: number; // nilai antara 0 dan 1
  width?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, width = 200 }) => {
  const animatedProgress = useSharedValue(progress);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 500 });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }));

  return (
    <View style={[styles.container, { width }]}>
      <Animated.View style={[styles.fill, animatedStyle]} />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    height: 10,
    backgroundColor: "#E5E7EB", // abu-abu terang
    borderRadius: 5,
    overflow: "hidden",
    
  },
  fill: {
    height: "100%",
    backgroundColor: "#3B82F6", // biru
  },
});
