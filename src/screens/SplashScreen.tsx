import LottieView from 'lottie-react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';


const SplashScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: 'gray-900' }}>
      <LottieView
        source={require('../assets/animations/BuqhV4qLkW.json')}
        autoPlay
        loop
        style={{ flex: 1 }}
      />

    </SafeAreaView>
  );
};
export default SplashScreen;