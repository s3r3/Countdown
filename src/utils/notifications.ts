// notifications.ts
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// ✅ Handler: bagaimana notifikasi ditampilkan saat diterima
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // ✅ baru di SDK 54
    shouldShowList: true,   // ✅ baru di SDK 54
  }),
});


/**
 * Minta izin notifikasi ke user
 */
export async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.log("Notification permissions not granted");
    return false;
  }

  // Android butuh channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return true;
}

/**
 * Jadwalkan notifikasi berdasarkan detik ke depan
 */
export async function scheduleNotification(
  eventName: string,
  seconds: number
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: `${eventName} Countdown`,
      body: `Time remaining: ${formatTime(seconds)}`,
      data: { eventName },
      categoryIdentifier: "countdown-actions",
    },
     trigger: {
    type: "timeInterval",   // ✅ WAJIB
    seconds,                // ✅ jumlah detik
    repeats: false,         // ✅ kalau mau sekali saja
  } as Notifications.TimeIntervalTriggerInput, 
  });
}

/**
 * Daftarkan kategori notifikasi (dengan tombol aksi)
 */
export async function registerNotificationActions(): Promise<void> {
  await Notifications.setNotificationCategoryAsync("countdown-actions", [
    { identifier: "start", buttonTitle: "Start", options: {} },
    { identifier: "pause", buttonTitle: "Pause", options: {} },
    { identifier: "reset", buttonTitle: "Reset", options: {} },
  ]);
}

/**
 * Format detik jadi string hh:mm:ss
 */
export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
