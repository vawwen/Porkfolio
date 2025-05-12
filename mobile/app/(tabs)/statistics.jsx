import { ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors } from "@/constants/Theme";
import { scale, verticalScale } from "@/utils/styling";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { Text as SvgText } from "react-native-svg";
import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/constants/api";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import Loader from "@/components/Loader";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/assets/styles/statistics.styles";

import { weeklyData, monthlyData, yearlyData } from "./test";

dayjs.extend(weekday);

const statistics = () => {
  const { token } = useAuthStore();

  const [activeIndex, setActiveIndex] = useState(0);
  const timeRanges = ["Weekly", "Monthly", "Yearly"];
  const [barChartData, setBarChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch chart data
  const fetchData = async (refresh = false) => {
    try {
      setIsLoading(true);

      const data =
        activeIndex === 0
          ? weeklyData
          : activeIndex === 1
          ? monthlyData
          : yearlyData;

      // Set Bar Data
      const transformedBarData = transformBarData(data?.barData);
      setBarChartData(transformedBarData);

      // Set Pie Data
      const transformedPieData = transformPieData(data?.pieData);
      setPieData(transformedPieData);
    } catch (error) {
      console.log("Error fetching analytics", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Bar data transformation
  const transformBarData = (originalData) => {
    const today = dayjs();

    let dataPoints;
    if (activeIndex === 0) {
      // Weekly
      const startOfWeek = today.subtract(1, "week").startOf("isoWeek");
      dataPoints = Array.from({ length: 7 }, (_, index) =>
        startOfWeek.add(index, "day").format("YYYY-MM-DD")
      );
    } else if (activeIndex === 1) {
      // Monthly
      const startOfYear = today.startOf("year");
      dataPoints = Array.from({ length: 12 }, (_, index) =>
        startOfYear.add(index, "month").format("YYYY-MM")
      );
    }

    const result =
      activeIndex === 2
        ? originalData
        : dataPoints.map((date) => {
            const entry = originalData.find((d) => d._id.period === date);
            if (entry) {
              return entry;
            } else {
              return {
                _id: { period: date },
                income: 0,
                expense: 0,
                netTotal: 0,
              };
            }
          });

    return result.flatMap((entry) => [
      {
        value: entry.income,
        label:
          activeIndex === 0
            ? dayjs(entry._id.period).format("ddd")
            : activeIndex === 1
            ? dayjs(entry._id.period).format("MMM")
            : entry._id.period,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.success,
      },
      {
        value: entry.expense,
        frontColor: colors.error,
      },
    ]);
  };

  // Pie data transformation
  const transformPieData = (originalData) => {
    const colorPalette = [
      "#D8B4FF",
      "#9E7FD9",
      "#B4FFD8",
      "#FFD8B4",
      "#7C4DFF",
    ];

    const overallTotal = originalData.reduce(
      (sum, item) => sum + item.total,
      0
    );

    const transformedData = originalData.map((item) => ({
      value: (item.total / overallTotal) * 100,
      type: item.type,
    }));

    transformedData.sort((a, b) => b.value - a.value);

    const topItems = transformedData.slice(0, 4);

    const othersTotal = transformedData
      .slice(4)
      .reduce((sum, item) => sum + item.value, 0);

    const finalData = topItems.map((item, index) => ({
      value: Math.floor(item.value),
      color: colorPalette[index % colorPalette.length],
      text: item.type,
      labelComponent: () => (
        <Text style={{ color: "black", fontSize: 12 }}>
          {Math.floor(item.value)}%
        </Text>
      ),
    }));

    const sumFloored = finalData.reduce((sum, item) => sum + item.value, 0);

    if (othersTotal > 0) {
      const othersValue = 100 - sumFloored;
      finalData.push({
        value: othersValue,
        color: colorPalette[colorPalette.length - 1],
        text: "Others",
        labelComponent: () => (
          <Text style={{ color: "black", fontSize: 12 }}>{othersValue}%</Text>
        ),
      });
    } else {
      const remainder = 100 - sumFloored;
      if (remainder > 0 && finalData.length > 0) {
        finalData[0].value += remainder;
        finalData[0].labelComponent = () => (
          <Text style={{ color: "black", fontSize: 12 }}>
            {finalData[0].value}%
          </Text>
        );
      }
    }

    return finalData;
  };

  // Handling time range change
  const handleTimeRangeChange = (event) => {
    const selectedIndex = event.nativeEvent.selectedSegmentIndex;
    setActiveIndex(selectedIndex);
  };

  useEffect(() => {
    fetchData();
  }, [activeIndex]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
        </View>

        <View style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 16 }}>
          <SegmentedControl
            values={timeRanges}
            selectedIndex={activeIndex}
            onChange={handleTimeRangeChange}
            tintColor={colors.primary}
            backgroundColor={colors.neutralLight}
            appearance="light"
            activeFontStyle={styles.segmentFontStyle}
            fontStyle={{ ...styles.segmentFontStyle, color: colors.textDark }}
            style={styles.segmentStyle}
          />
        </View>
        {isLoading ? (
          <Loader />
        ) : (
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 30,
            }}
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Bar Chart */}
            <Text style={styles.chartTitle}>Transactions</Text>
            <View style={styles.chartContainer}>
              {barChartData.length > 0 ? (
                <BarChart
                  data={barChartData}
                  barWidth={scale(12)}
                  spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
                  roundedTop
                  yAxisLabelPrefix="$"
                  yAxisTextStyle={{
                    color: colors.textPrimary,
                    fontSize: verticalScale(12),
                  }}
                  xAxisLabelTextStyle={{
                    color: colors.textPrimary,
                    fontSize: verticalScale(12),
                  }}
                  noOfSections={4}
                  minHeight={5}
                  width={300}
                  yAxisLabelWidth={50}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons
                    name="cash-outline"
                    size={60}
                    color={colors.secondary}
                  />
                  <Text style={styles.emptyText}>No transactions yet</Text>
                  <Text style={styles.emptySubtext}>
                    Start building your Porkfolio!
                  </Text>
                </View>
              )}
            </View>

            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: colors.neutralLight,
                marginVertical: 12,
              }}
            />

            {/* Pie Chart */}
            <View style={styles.chartContainer}>
              <Text style={[styles.chartTitle, { width: "100%" }]}>
                Expense Breakdown
              </Text>
              {pieData.length > 0 ? (
                <View style={styles.pieChartWrapper}>
                  <PieChart
                    data={pieData}
                    radius={scale(80)}
                    donut
                    showExternalLabels
                    externalLabelComponent={(item, index) => (
                      <SvgText
                        style={{
                          color: colors.textPrimary,
                          fontSize: 12,
                        }}
                      >
                        {item?.value + "%"}
                      </SvgText>
                    )}
                  />
                  <View style={styles.pieLegend}>
                    {pieData.map((item, index) => (
                      <View key={index} style={styles.legendItem}>
                        <View
                          style={[
                            styles.legendColor,
                            { backgroundColor: item.color },
                          ]}
                        />
                        <Text style={styles.legendText}>{item.text}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons
                    name="thumbs-up-outline"
                    size={60}
                    color={colors.secondary}
                  />
                  <Text style={styles.emptyText}>No expenses yet</Text>
                  <Text style={styles.emptySubtext}>
                    Great! You have a clean sheet!
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default statistics;
