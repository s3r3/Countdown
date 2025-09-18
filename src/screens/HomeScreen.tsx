import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import EventCard from "../components/EventCard";
import Tooltip from "../components/Tooltip";
import { useAppStore } from "../store";
import { colors } from "../constants/colors";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const events = useAppStore((state) => state.events);
  const [showTooltip, setShowTooltip] = useState(events.length === 0);

  const handleAddEvent = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("AddEvent");
  };

  return (
    <View className={`flex-1 bg-[${colors.backgroundLight}] p-4`}>
      <Text className={`text-2xl font-bold text-[${colors.textPrimary}] mb-4`}>
        {t("home.title")}
      </Text>
      {events.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className={`text-lg text-[${colors.textSecondary}]`}>
            {t("home.empty")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard id={item.id} name={item.name} color={item.color} />
          )}
        />
      )}
      <Tooltip
        isVisible={showTooltip}
        content={t("home.addButton")}
        onClose={() => setShowTooltip(false)}
      >
        <TouchableOpacity
          className={`absolute bottom-4 right-4 bg-[${colors.primary}] p-4 rounded-full shadow-md`}
          onPress={handleAddEvent}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </Tooltip>
    </View>
  );
};

export default HomeScreen;
