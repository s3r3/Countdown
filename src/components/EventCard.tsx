import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
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
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <MaterialIcons name="timer" size={24} color={color} />
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 3, // Android shadow
    marginBottom: 8,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  text: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#111827", // tailwind text-gray-900
  },
});
