import React, { useEffect } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Rating } from "react-native-ratings";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useAppStore } from "../store";

interface RatingModalProps {
  visible: boolean;
  eventName: string;
  onClose: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  eventName,
  onClose,
}) => {
  const opacity = useSharedValue(0);
  const updateStats = useAppStore((state) => state.updateStats);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleRating = (rating: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateStats(eventName, rating); // Simpan rating sebagai bagian dari stats
    onClose();
  };

  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <Animated.View
          style={animatedStyle}
          className="bg-white rounded-lg p-6 w-4/5"
        >
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Rate sesi "{eventName}"
          </Text>
          <Rating
            type="star"
            ratingCount={5}
            imageSize={40}
            onFinishRating={handleRating}
            style={{ paddingVertical: 10 }}
          />
          <TouchableOpacity
            onPress={onClose}
            className="mt-4 bg-gray-200 rounded-lg p-3 items-center"
          >
            <Text className="text-gray-900 font-semibold">Tutup</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default RatingModal;
