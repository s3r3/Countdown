import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { useAppStore } from "../store";
import { colors } from "../constants/colors";

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { userPrefs, setUserPrefs } = useAppStore();

  const toggleTheme = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUserPrefs({ theme: userPrefs.theme === "light" ? "dark" : "light" });
  };

  const toggleLanguage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUserPrefs({ language: userPrefs.language === "en" ? "id" : "en" });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundLight }]}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {t("settings.title")}
      </Text>

      {/* Theme Section */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {t("settings.theme")}
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={toggleTheme}
        >
          <Text style={styles.buttonText}>
            {t(
              `settings.theme${userPrefs.theme === "light" ? "Dark" : "Light"}`,
            )}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Language Section */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {t("settings.language")}
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={toggleLanguage}
        >
          <Text style={styles.buttonText}>
            {t(`settings.language${userPrefs.language === "en" ? "Id" : "En"}`)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  button: {
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
});
