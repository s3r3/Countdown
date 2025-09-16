
import React from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';

interface ProgressBarProps {
  progress: number; // Nilai antara 0 dan 1
  width?: number;
}

const AnimatedProgressBar = Animated.createAnimatedComponent(Progress.Bar);

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, width = 200 }) => {
  const animatedProgress = useSharedValue(progress);

  React.useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 500 });
  }, [progress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => ({
    progress: animatedProgress.value,
  }));

  return (
    <View className="items-center mt-4">
      <AnimatedProgressBar
        animatedProps={animatedProps}
        width={width}
        height={10}
        color="#3B82F6"
        unfilledColor="#E5E7EB"
        borderWidth={0}
      />
    </View>
  );
};

export default ProgressBar;
