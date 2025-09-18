import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Tooltip from "../components/Tooltip";
import { useAppStore } from "../store";
import { colors } from "../constants/colors";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const events = useAppStore((state) => state.events);
  const removeEvent = useAppStore((state) => state.deleteEvent);
  const [showTooltip, setShowTooltip] = useState(events.length === 0);

  // Auto-hide tooltip setelah beberapa detik
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  const handleAddEvent = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowTooltip(false);
    navigation.navigate("AddEvent");
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      t("home.deleteTitle"),
      t("home.deleteMessage", { name }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Warning,
            );
            removeEvent(id);
          },
        },
      ],
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundLight }]}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {t("home.title")}
      </Text>

      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 18, color: colors.textSecondary }}>
            {t("home.empty")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[styles.eventCard, { backgroundColor: colors.cardLight }]}
            >
              <TouchableOpacity
                style={styles.eventContent}
                onPress={() =>
                  navigation.navigate("Countdown", { eventId: item.id })
                }
              >
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text style={[styles.eventName, { color: colors.textPrimary }]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.name)}
                style={styles.deleteButton}
              >
                <MaterialIcons name="delete" size={24} color={colors.error} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Tooltip
        isVisible={showTooltip}
        content={t("home.addButton")}
        onClose={() => setShowTooltip(true)}
      >
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={handleAddEvent}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </Tooltip>
    </View>
  );
};

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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  eventContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "500",
  },
  deleteButton: {
    padding: 4,
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    padding: 16,
    borderRadius: 999,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default HomeScreen;
