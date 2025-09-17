
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save data to AsyncStorage.
 * @param key - The key for the data.
 * @param value - The value to save (will be JSON.stringified).
 */
export const saveToStorage = async (key: string, value: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to AsyncStorage:', error);
  }
};

/**
 * Load data from AsyncStorage.
 * @param key - The key for the data.
 * @returns The parsed data or null if not found.
 */
export const loadFromStorage = async (key: string): Promise<any | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error loading from AsyncStorage:', error);
    return null;
  }
};

/**
 * Remove data from AsyncStorage.
 * @param key - The key for the data.
 */
export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from AsyncStorage:', error);
  }
};

/**
 * Clear all AsyncStorage data (use with caution).
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};
