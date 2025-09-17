
import React from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LineChart } from 'react-native-chart-kit';
import { useAppStore } from '../store';
import { colors } from '../constants/colors';

const StatsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { stats } = useAppStore();
  const screenWidth = Dimensions.get('window').width;

  const data = {
    labels: stats.history.slice(-7).map((entry) => entry.date.slice(5, 10)),
    datasets: [{ data: stats.history.slice(-7).map((entry) => entry.duration / 60) }],
  };

  const totalHours = stats.history.reduce((sum, entry) => sum + entry.duration / 3600, 0).toFixed(1);

  return (
    <View className={`flex-1 bg-[${colors.backgroundLight}] p-4`}>
      <Text className={`text-2xl font-bold text-[${colors.textPrimary}] mb-4`}>
        {t('stats.title')}
      </Text>
      <Text className={`text-lg text-[${colors.textPrimary}] mb-2`}>
        {t('stats.totalTime', { hours: totalHours })}
      </Text>
      <Text className={`text-lg text-[${colors.textPrimary}] mb-4`}>
        {t('stats.streaks', { count: stats.streaks })}
      </Text>
      <LineChart
        data={data}
        width={screenWidth - 32}
        height={220}
        yAxisLabel=""
        yAxisSuffix="m"
        chartConfig={{
          backgroundColor: colors.cardLight,
          backgroundGradientFrom: colors.cardLight,
          backgroundGradientTo: colors.cardLight,
          decimalPlaces: 0,
          color: () => colors.primary,
          labelColor: () => colors.textPrimary,
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
      <Text className={`text-lg text-[${colors.textPrimary}] mt-4 mb-2`}>
        {t('stats.history')}
      </Text>
      <FlatList
        data={stats.history.slice(-10)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className={`bg-[${colors.cardLight}] p-3 rounded-lg mb-2`}>
            <Text className={`text-[${colors.textPrimary}]`}>
              {item.eventName} - {(item.duration / 60).toFixed(1)}m - {item.date.slice(0, 10)}
              {item.rating && ` - ${item.rating} stars`}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default StatsScreen;
