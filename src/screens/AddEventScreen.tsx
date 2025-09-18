import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useAppStore } from "../store";
import { colors } from "../constants/colors";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const AddEventScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const addEvent = useAppStore((state) => state.addEvent);
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(colors.primary);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert(t("addEvent.error"));
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addEvent(name, color);
    navigation.goBack();
  };

  return (
    <View className={`flex-1 bg-[${colors.backgroundLight}] p-4`}>
      <Text className={`text-2xl font-bold text-[${colors.textPrimary}] mb-4`}>
        {t("addEvent.title")}
      </Text>
      <TextInput
        className={`border border-[${colors.textSecondary}] rounded-lg p-3 mb-4 text-[${colors.textPrimary}]`}
        placeholder={t("addEvent.namePlaceholder")}
        value={name}
        onChangeText={setName}
      />
      <View className="flex-row mb-4">
        {["#3B82F6", "#10B981", "#F59E0B", "#EF4444"].map((c) => (
          <TouchableOpacity
            key={c}
            className={`w-10 h-10 rounded-full mr-2 ${color === c ? "border-2 border-[${colors.textPrimary}]" : ""}`}
            style={{ backgroundColor: c }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setColor(c);
            }}
          />
        ))}
      </View>
      <TouchableOpacity
        className={`bg-[${colors.primary}] p-4 rounded-lg items-center`}
        onPress={handleSubmit}
      >
        <Text className="text-white font-semibold">{t("addEvent.submit")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddEventScreen;
