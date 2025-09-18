import React from "react";
import { View, Text } from "react-native";
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

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
      onClose();
    });
  };

  return (
    <Tooltip
      isVisible={isVisible}
      content={
        <Animated.View
          style={animatedStyle}
          className="bg-blue-500 p-4 rounded-lg"
        >
          <Text className="text-white text-base">{content}</Text>
        </Animated.View>
      }
      placement="top"
      onClose={handlePress}
      backgroundColor="rgba(0,0,0,0.5)"
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
