
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../store';
import { colors } from '../constants/colors';

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { userPrefs, setUserPrefs } = useAppStore();

  const toggleTheme = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUserPrefs({ theme: userPrefs.theme === 'light' ? 'dark' : 'light' });
  };

  const toggleLanguage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUserPrefs({ language: userPrefs.language === 'en' ? 'id' : 'en' });
  };

  return (
    <View className={`flex-1 bg-[${colors.backgroundLight}] p-4`}>
      <Text className={`text-2xl font-bold text-[${colors.textPrimary}] mb-4`}>
        {t('settings.title')}
      </Text>
      <View className="mb-4">
        <Text className={`text-lg text-[${colors.textPrimary}] mb-2`}>{t('settings.theme')}</Text>
        <TouchableOpacity
          className={`bg-[${colors.primary}] p-3 rounded-lg`}
          onPress={toggleTheme}
        >
          <Text className="text-white">{t(`settings.theme${userPrefs.theme === 'light' ? 'Dark' : 'Light'}`)}</Text>
        </TouchableOpacity>
      </View>
      <View className="mb-4">
        <Text className={`text-lg text-[${colors.textPrimary}] mb-2`}>{t('settings.language')}</Text>
        <TouchableOpacity
          className={`bg-[${colors.primary}] p-3 rounded-lg`}
          onPress={toggleLanguage}
        >
          <Text className="text-white">{t(`settings.language${userPrefs.language === 'en' ? 'Id' : 'En'}`)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;
