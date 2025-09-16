
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import EventCard from '../components/EventCard';
import Tooltip from '../components/Tooltip';
import { useAppStore } from '../store';

type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Countdown: { eventId: string };
  AddEvent: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const { events } = useAppStore();
  const navigation = useNavigation<NavigationProp>();
  const [showTooltip, setShowTooltip] = useState(true);

  // Animasi untuk FAB
  const fabScale = useSharedValue(1);
  const animatedFabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  // Cek apakah user baru (misalnya, jika events kosong)
  useEffect(() => {
    if (events.length > 0) {
      setShowTooltip(false);
    }
  }, [events]);

  const handleAddEvent = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    fabScale.value = withSpring(1.2, {}, () => {
      fabScale.value = withSpring(1);
    });
    navigation.navigate('AddEvent');
  };

  return (
    <View className="flex-1 bg-white p-4">
      {events.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl font-semibold text-gray-900">
            Tambah event pertama kamu!
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={({ item }) => (
            <EventCard id={item.id} name={item.name} color={item.color} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <Tooltip
        isVisible={showTooltip}
        content="Tap '+' untuk tambah event baru!"
        onClose={() => setShowTooltip(false)}
      >
        <Animated.View style={animatedFabStyle} className="absolute bottom-6 right-6">
          <TouchableOpacity
            onPress={handleAddEvent}
            className="bg-blue-500 p-4 rounded-full shadow-md"
          >
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </Tooltip>
    </View>
  );
};

export default HomeScreen;
