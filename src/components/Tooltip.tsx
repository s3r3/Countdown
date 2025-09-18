import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Tooltip from "react-native-walkthrough-tooltip";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface TooltipProps {
  isVisible: boolean;
  content: string;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomTooltip: React.FC<TooltipProps> = ({
  isVisible,
  content,
  onClose,
  children,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
      if (typeof onClose === "function") {
        onClose();
      } else {
        console.warn("⚠️ onClose harus function, dapat:", typeof onClose);
      }
    });
  };

  return (
    <Tooltip
      isVisible={isVisible}
      content={
        <Animated.View style={[styles.tooltipBox, animatedStyle]}>
          <Text style={styles.tooltipText}>{content}</Text>
        </Animated.View>
      }
      placement="top"
      onClose={handleClose}
      backgroundColor="rgba(0,0,0,0.5)"
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;

const styles = StyleSheet.create({
  tooltipBox: {
    backgroundColor: "#3B82F6", // bg-blue-500
    padding: 16, // p-4
    borderRadius: 12, // rounded-lg
  },
  tooltipText: {
    color: "#FFFFFF", // text-white
    fontSize: 16, // text-base
  },
});
