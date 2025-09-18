import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useRoute, RouteProp } from "@react-navigation/native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";
import CountdownTimer from "../components/CountdownTimer";
import ProgressBar from "../components/ProgressBar";
import RatingModal from "../components/RatingModal";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppStore } from "../store";
import { colors } from "../constants/colors";
import { getRandomQuote } from "../constants/quotes";
import type { RootStackParamList } from "../navigation/AppNavigator";

type CountdownRouteProp = RouteProp<RootStackParamList, "Countdown">;

const CountdownScreen: React.FC = () => {
  const { t } = useTranslation();
  const route = useRoute<CountdownRouteProp>();
  const { eventId } = route.params;
  const events = useAppStore((state) => state.events);
  const updateStats = useAppStore((state) => state.updateStats);
  const language = useAppStore((state) => state.userPrefs.language);
  const event = events.find((e) => e.id === eventId);

  const [time, setTime] = useState(0);
  const [maxTime, setMaxTime] = useState(1); // default supaya ga division by zero
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const scale = useSharedValue(1);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }
    if (time === 0 && isRunning) {
      setIsRunning(false);
      setIsDone(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      updateStats(event?.name || "Event", maxTime);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, event, updateStats, maxTime]);

  const handleButtonPress = (
    action:
      | "start"
      | "pause"
      | "reset"
      | "add"
      | "subtract"
      | "preset15"
      | "preset25"
      | "preset45",
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });

    switch (action) {
      case "start":
        if (time > 0) setIsRunning(true);
        break;
      case "pause":
        setIsRunning(false);
        break;
      case "reset":
        setIsRunning(false);
        setTime(0);
        setMaxTime(1);
        break;
      case "add":
        setTime((prev) => {
          const newTime = prev + 1;
          if (newTime > maxTime) setMaxTime(newTime); // update maxTime kalau tambah manual
          return newTime;
        });
        break;
      case "subtract":
        if (time > 0) setTime((prev) => prev - 1);
        break;
      case "preset15":
        setTime(15 * 60);
        setMaxTime(15 * 60);
        break;
      case "preset25":
        setTime(25 * 60);
        setMaxTime(25 * 60);
        break;
      case "preset45":
        setTime(45 * 60);
        setMaxTime(45 * 60);
        break;
    }
  };

  if (!event) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.backgroundLight }]}
      >
        <Text style={[styles.errorText, { color: colors.error }]}>
          {t("addEvent.error")}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundLight }]}
    >
      {isDone && <ConfettiCannon count={50} origin={{ x: -10, y: 0 }} />}
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {event.name}
      </Text>
      <Text style={[styles.quote, { color: colors.textSecondary }]}>
        {getRandomQuote(language)}
      </Text>

      <CountdownTimer time={time} />

      {/* Progress bar fleksibel */}
      <ProgressBar progress={time / maxTime} width={325} />

      {/* Control Buttons */}
      <View style={styles.controlRow}>
        <TouchableOpacity
          style={[styles.circleButton, { backgroundColor: colors.secondary }]}
          onPress={() => handleButtonPress("subtract")}
        >
          <MaterialIcons name="remove" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.circleButton,
            { backgroundColor: isRunning ? colors.error : colors.primary },
          ]}
          onPress={() => handleButtonPress(isRunning ? "pause" : "start")}
        >
          <MaterialIcons
            name={isRunning ? "pause" : "play-arrow"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.circleButton, { backgroundColor: colors.accent }]}
          onPress={() => handleButtonPress("add")}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Preset Buttons */}
      <View style={styles.presetRow}>
        <TouchableOpacity
          style={[
            styles.presetButton,
            { backgroundColor: colors.primary, marginRight: 4 },
          ]}
          onPress={() => handleButtonPress("preset15")}
        >
          <Text style={styles.presetButtonText}>{t("countdown.preset15")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.presetButton,
            { backgroundColor: colors.primary, marginHorizontal: 4 },
          ]}
          onPress={() => handleButtonPress("preset25")}
        >
          <Text style={styles.presetButtonText}>{t("countdown.preset25")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.presetButton,
            { backgroundColor: colors.primary, marginLeft: 4 },
          ]}
          onPress={() => handleButtonPress("preset45")}
        >
          <Text style={styles.presetButtonText}>{t("countdown.preset45")}</Text>
        </TouchableOpacity>
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        style={[styles.resetButton, { backgroundColor: colors.error }]}
        onPress={() => handleButtonPress("reset")}
      >
        <Text style={styles.resetButtonText}>{t("countdown.reset")}</Text>
      </TouchableOpacity>

      <RatingModal
        visible={isDone}
        eventName={event.name}
        onClose={() => setIsDone(false)}
      />
    </View>
  );
};

export default CountdownScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  quote: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "500",
  },
  controlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  circleButton: {
    padding: 12,
    borderRadius: 999,
  },
  presetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  presetButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  presetButtonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  resetButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  resetButtonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
});
