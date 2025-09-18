import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Haptics from "expo-haptics";

type RootStackParamList = {
  Countdown: { eventId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface EventCardProps {
  id: string;
  name: string;
  color?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  name,
  color = "#3B82F6",
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Countdown", { eventId: id });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center p-4 bg-white rounded-lg shadow-md mb-2"
    >
      <MaterialIcons name="timer" size={24} color={color} />
      <Text className="ml-4 text-lg font-semibold text-gray-900">{name}</Text>
    </TouchableOpacity>
  );
};

export default EventCard;
