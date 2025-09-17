
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface Event {
  id: string;
  name: string;
  initialTime: number;
  color?: string;
}

interface Stats {
  points: number;
  streaks: number;
  history: Array<{ eventName: string; duration: number; date: string; rating?: number }>;
}

interface UserPrefs {
  theme: 'light' | 'dark';
  sound: string;
  language: 'en' | 'id';
}

interface TimerState {
  eventId: string | null;
  time: number;
  isRunning: boolean;
}

interface AppState {
  events: Event[];
  stats: Stats;
  userPrefs: UserPrefs;
  timerState: TimerState;
  addEvent: (name: string, color?: string) => void;
  deleteEvent: (id: string) => void;
  updateStats: (eventName: string, duration: number, rating?: number) => void;
  setUserPrefs: (prefs: Partial<UserPrefs>) => void;
  setTimerState: (timer: Partial<TimerState>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      events: [],
      stats: { points: 0, streaks: 0, history: [] },
      userPrefs: { theme: 'light', sound: 'default', language: 'id' },
      timerState: { eventId: null, time: 0, isRunning: false },
      addEvent: (name, color) =>
        set((state) => ({
          events: [...state.events, { id: uuidv4(), name, initialTime: 0, color }],
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),
      updateStats: (eventName, duration, rating) =>
        set((state) => ({
          stats: {
            ...state.stats,
            points: state.stats.points + (rating ? rating * 2 : 10),
            streaks: new Date().toDateString() === new Date(state.stats.history.slice(-1)[0]?.date).toDateString()
              ? state.stats.streaks + 1
              : 1,
            history: [...state.stats.history, { eventName, duration, date: new Date().toISOString(), rating }],
          },
        })),
      setUserPrefs: (prefs) =>
        set((state) => ({
          userPrefs: { ...state.userPrefs, ...prefs },
        })),
      setTimerState: (timer) =>
        set((state) => ({
          timerState: { ...state.timerState, ...timer },
        })),
    }),
    {
      name: 'countdown-timer-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
