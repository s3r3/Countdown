import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Vibration } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useRoute, RouteProp } from '@react-navigation/native';
import CountdownTimer from '../components/CountdownTimer';
import ProgressBar from '../components/ProgressBar';
import RatingModal from '../components/RatingModal';
import { useAppStore } from '../store';
import { scheduleNotification, registerNotificationActions } from '../utils/notifications';

type RootStackParamList = {
  Countdown: { eventId: string };
};

type CountdownRouteProp = RouteProp<RootStackParamList, 'Countdown'>;

const CountdownScreen: React.FC = () => {
  const route = useRoute<CountdownRouteProp>();
  const { eventId } = route.params;
  const { events, updateStats } = useAppStore();
  const event = events.find((e) => e.id === eventId);
  const [time, setTime] = useState(0); // Waktu dalam detik
  const [initialTime, setInitialTime] = useState(0); // Untuk progress bar
  const [isRunning, setIsRunning] = useState(false);
  const [isTimerDone, setIsTimerDone] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const confettiRef = useRef<ConfettiCannon>(null);

  // Animasi untuk tombol
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Setup notifikasi
  useEffect(() => {
    registerNotificationActions();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setIsTimerDone(true);
            Vibration.vibrate([0, 500, 200, 500]);
            confettiRef.current?.start();
            updateStats(event?.name || 'Event', initialTime);
            return 0;
          }
          scheduleNotification(event?.name || 'Event', prev - 1);
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, time, event, initialTime, updateStats]);

  const handleAdjustTime = (delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    buttonScale.value = withSpring(1.1, {}, () => {
      buttonScale.value = withSpring(1);
    });
    setTime((prev) => Math.max(0, prev + delta));
    if (!initialTime) setInitialTime(time + delta);
  };

  const handlePreset = (minutes: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    buttonScale.value = withSpring(1.1, {}, () => {
      buttonScale.value = withSpring(1);
    });
    const newTime = minutes * 60;
    setTime(newTime);
    setInitialTime(newTime);
  };

  const handleStartPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    buttonScale.value = withSpring(1.1, {}, () => {
      buttonScale.value = withSpring(1);
    });
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    buttonScale.value = withSpring(1.1, {}, () => {
      buttonScale.value = withSpring(1);
    });
    setTime(initialTime || 0);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <View className="flex-1 bg-white justify-center items-center p-4">
      <Text className="text-2xl font-bold text-gray-900 mb-4">{event?.name || 'Event'}</Text>
      <CountdownTimer time={time} />
      <ProgressBar progress={initialTime ? time / initialTime : 0} />
      <View className="flex-row justify-center mt-6">
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity
            onPress={() => handleAdjustTime(-1)}
            className="bg-gray-200 p-4 rounded-full mx-2"
          >
            <MaterialIcons name="remove" size={24} color="black" />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity
            onPress={() => handleAdjustTime(1)}
            className="bg-gray-200 p-4 rounded-full mx-2"
          >
            <MaterialIcons name="add" size={24} color="black" />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View className="flex-row justify-center mt-4">
        {[15, 25, 45].map((minutes) => (
          <Animated.View key={minutes} style={animatedButtonStyle}>
            <TouchableOpacity
              onPress={() => handlePreset(minutes)}
              className="bg-blue-500 p-3 rounded-lg mx-2"
            >
              <Text className="text-white font-semibold">{minutes} min</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      <View className="flex-row justify-center mt-6">
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity
            onPress={handleStartPause}
            className="bg-green-500 p-4 rounded-full mx-2"
          >
            <MaterialIcons name={isRunning ? 'pause' : 'play-arrow'} size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity
            onPress={handleReset}
            className="bg-red-500 p-4 rounded-full mx-2"
          >
            <MaterialIcons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <RatingModal
        visible={isTimerDone}
        eventName={event?.name || 'Event'}
        onClose={() => setIsTimerDone(false)}
      />
      <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} autoStart={false} ref={confettiRef} />
    </View>
  );
};

export default CountdownScreen;
