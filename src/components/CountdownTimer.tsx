import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface CountdownTimerProps {
  time: number; // Waktu dalam detik
}

const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ time }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(1.1, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 100 });
    });
  }, [time, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="items-center">
      <Animated.Text style={animatedStyle} className="text-6xl font-bold text-gray-900">
        {formatTime(time)}
      </Animated.Text>
    </View>
  );
};

export default CountdownTimer;
