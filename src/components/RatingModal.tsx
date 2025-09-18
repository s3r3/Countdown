import React, { useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContent, animatedStyle]}>
          <Text style={styles.title}>Rate sesi "{eventName}"</Text>
          <Rating
            type="star"
            ratingCount={5}
            imageSize={40}
            onFinishRating={handleRating}
            style={{ paddingVertical: 10 }}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Tutup</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default RatingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // bg-black/50
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "80%", // w-4/5
  },
  title: {
    fontSize: 20, // text-xl
    fontWeight: "bold",
    color: "#111827", // text-gray-900
    marginBottom: 16, // mb-4
  },
  closeButton: {
    marginTop: 16, // mt-4
    backgroundColor: "#E5E7EB", // bg-gray-200
    borderRadius: 8,
    padding: 12, // p-3
    alignItems: "center",
  },
  closeButtonText: {
    color: "#111827", // text-gray-900
    fontWeight: "600", // font-semibold
  },
});
