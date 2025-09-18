import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { formatTime } from "./formatTime";
import { useAppStore } from "../store";

/**
 * Interface for timer state in Zustand
 */
interface TimerState {
  eventId: string | null;
  time: number;
  isRunning: boolean;
}

/**
 * Request permission for notifications.
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    console.log("Notifications only work on physical devices");
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.log("Permission for notifications denied");
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("countdown-timer", {
      name: "Countdown Timer",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return true;
};

/**
 * Schedule a countdown notification.
 * @param eventName - Name of the event.
 * @param seconds - Time remaining in seconds.
 * @param eventId - ID of the event for data.
 */
export const scheduleCountdownNotification = async (
  eventName: string,
  seconds: number,
  eventId: string,
) => {
  const { t } = useTranslation();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: t("notifications.title", { eventName }),
      body: t("notifications.body", { time: formatTime(seconds) }),
      data: { eventId, action: "update" },
      sound: true,
    },
    trigger:
      seconds > 0
        ? {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds,
            repeats: false,
          }
        : null,
  });
};

/**
 * Schedule a notification when the timer is done.
 * @param eventName - Name of the event.
 * @param eventId - ID of the event for data.
 */
export const scheduleDoneNotification = async (
  eventName: string,
  eventId: string,
) => {
  const { t } = useTranslation();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: t("notifications.done", { eventName }),
      body: t("countdown.done", { eventName }),
      data: { eventId, action: "done" },
      sound: true,
    },
    trigger: null, // Immediate
  });
};

/**
 * Handle notification response (e.g., when user taps notification).
 * This should be called in App.tsx or root component.
 */
export const setupNotificationListener = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const { eventId, action } = response.notification.request.content
        .data as { eventId: string; action: string };
      const store = useAppStore.getState();

      if (action === "done") {
        // Navigate to CountdownScreen or show RatingModal
        console.log(`Timer for event ${eventId} is done`);
        // Update Zustand state to show RatingModal
        store.setTimerState({ eventId, time: 0, isRunning: false });
      } else if (action === "update") {
        // Navigate to CountdownScreen to manage timer
        console.log(`Navigating to CountdownScreen for event ${eventId}`);
      }
    },
  );

  return subscription;
};

/**
 * Cancel all scheduled notifications for a specific event.
 * @param eventId - ID of the event to cancel.
 */
export const cancelNotification = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
