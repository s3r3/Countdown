import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
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
    <View
      style={[styles.container, { backgroundColor: colors.backgroundLight }]}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {t("addEvent.title")}
      </Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.textSecondary, color: colors.textPrimary },
        ]}
        placeholder={t("addEvent.namePlaceholder")}
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />
      <View style={styles.colorOptionsContainer}>
        {["#3B82F6", "#10B981", "#F59E0B", "#EF4444"].map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.colorCircle,
              { backgroundColor: c },
              color === c && {
                borderWidth: 2,
                borderColor: colors.textPrimary,
              },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setColor(c);
            }}
          />
        ))}
      </View>
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: colors.primary }]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>{t("addEvent.submit")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddEventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24, // text-2xl kira-kira
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    // text color & borderColor akan override melalui props
  },
  colorOptionsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  colorCircle: {
    width: 40, // kira-kira w-10
    height: 40, // h-10
    borderRadius: 20,
    marginRight: 8,
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
