
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, RouteProp } from '@react-navigation/native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';
import CountdownTimer from '../components/CountdownTimer';
import ProgressBar from '../components/ProgressBar';
import RatingModal from '../components/RatingModal';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '../store';
import { colors } from '../constants/colors';
import { getRandomQuote } from '../constants/quotes';
import type { RootStackParamList } from '../navigation/AppNavigator';

type CountdownRouteProp = RouteProp<RootStackParamList, 'Countdown'>;

const CountdownScreen: React.FC = () => {
  const { t } = useTranslation();
  const route = useRoute<CountdownRouteProp>();
  const { eventId } = route.params;
  const events = useAppStore((state) => state.events);
  const updateStats = useAppStore((state) => state.updateStats);
  const language = useAppStore((state) => state.userPrefs.language);
  const event = events.find((e) => e.id === eventId);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const scale = useSharedValue(1);

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
      updateStats(event?.name || 'Event', time);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, event, updateStats]);

  const handleButtonPress = (action: 'start' | 'pause' | 'reset' | 'add' | 'subtract' | 'preset15' | 'preset25' | 'preset45') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, {}, () => { scale.value = withSpring(1); });
    switch (action) {
      case 'start':
        if (time > 0) setIsRunning(true);
        break;
      case 'pause':
        setIsRunning(false);
        break;
      case 'reset':
        setIsRunning(false);
        setTime(0);
        break;
      case 'add':
        setTime((prev) => prev + 1);
        break;
      case 'subtract':
        if (time > 0) setTime((prev) => prev - 1);
        break;
      case 'preset15':
        setTime(15 * 60);
        break;
      case 'preset25':
        setTime(25 * 60);
        break;
      case 'preset45':
        setTime(45 * 60);
        break;
    }
  };

  if (!event) {
    return (
      <View className={`flex-1 bg-[${colors.backgroundLight}] justify-center items-center`}>
        <Text className="text-xl text-[${colors.error}]">{t('addEvent.error')}</Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 bg-[${colors.backgroundLight}] p-4`}>
      {isDone && <ConfettiCannon count={50} origin={{ x: -10, y: 0 }} />}
      <Text className={`text-2xl font-bold text-[${colors.textPrimary}] mb-4`}>
        {event.name}
      </Text>
      <Text className={`text-base text-[${colors.textSecondary}] mb-4`}>
        {getRandomQuote(language)}
      </Text>
      <CountdownTimer time={time} />
      <ProgressBar progress={time / (45 * 60)} width={250} />
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity
          className={`bg-[${colors.secondary}] p-3 rounded-full`}
          onPress={() => handleButtonPress('subtract')}
        >
          <MaterialIcons name="remove" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className={`bg-[${isRunning ? colors.error : colors.primary}] p-3 rounded-full`}
          onPress={() => handleButtonPress(isRunning ? 'pause' : 'start')}
        >
          <MaterialIcons name={isRunning ? 'pause' : 'play-arrow'} size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className={`bg-[${colors.accent}] p-3 rounded-full`}
          onPress={() => handleButtonPress('add')}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity
          className={`bg-[${colors.primary}] p-3 rounded-lg flex-1 mr-2`}
          onPress={() => handleButtonPress('preset15')}
        >
          <Text className="text-white text-center">{t('countdown.preset15')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`bg-[${colors.primary}] p-3 rounded-lg flex-1 mx-1`}
          onPress={() => handleButtonPress('preset25')}
        >
          <Text className="text-white text-center">{t('countdown.preset25')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`bg-[${colors.primary}] p-3 rounded-lg flex-1 ml-2`}
          onPress={() => handleButtonPress('preset45')}
        >
          <Text className="text-white text-center">{t('countdown.preset45')}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        className={`bg-[${colors.error}] p-3 rounded-lg mt-4`}
        onPress={() => handleButtonPress('reset')}
      >
        <Text className="text-white text-center">{t('countdown.reset')}</Text>
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
