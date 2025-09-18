import React from "react";
import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { LineChart } from "react-native-chart-kit";
import { useAppStore } from "../store";
import { colors } from "../constants/colors";

const StatsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { stats } = useAppStore();
  const screenWidth = Dimensions.get("window").width;

  const data = {
    labels: stats.history.slice(-7).map((entry) => entry.date.slice(5, 10)),
    datasets: [
      { data: stats.history.slice(-7).map((entry) => entry.duration / 60) },
    ],
  };

  const totalHours = stats.history
    .reduce((sum, entry) => sum + entry.duration / 3600, 0)
    .toFixed(1);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundLight }]}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {t("stats.title")}
      </Text>
      <Text style={[styles.infoText, { color: colors.textPrimary }]}>
        {t("stats.totalTime", { hours: totalHours })}
      </Text>
      <Text style={[styles.infoText, { color: colors.textPrimary }]}>
        {t("stats.streaks", { count: stats.streaks })}
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
        style={styles.chart}
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        {t("stats.history")}
      </Text>
      <FlatList
        data={stats.history.slice(-10)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[styles.historyItem, { backgroundColor: colors.cardLight }]}
          >
            <Text style={{ color: colors.textPrimary }}>
              {item.eventName} - {(item.duration / 60).toFixed(1)}m -{" "}
              {item.date.slice(0, 10)}
              {item.rating && ` - ${item.rating} ⭐`}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  historyItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
});
