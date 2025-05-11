import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { act, useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/Theme";
import { scale, verticalScale } from "@/utils/styling";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { Text as SvgText } from "react-native-svg";

const statistics = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const timeRanges = ["Weekly", "Monthly", "Yearly"];

  const fetchWeeklyTransactionData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = [];

    for (let i = 0; i < 7; i++) {
      // Success bar
      data.push({
        value: [65, 50, 75, 30, 60, 65, 65][i], // Success values
        label: days[i],
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.success,
        topLabelComponent: () => (
          <Text style={{ fontSize: 10, color: colors.textPrimary }}>
            {[65, 50, 75, 30, 60, 65, 65][i]}
          </Text>
        ),
      });

      // Error bar
      data.push({
        value: [20, 40, 25, 20, 40, 30, 30][i], // Error values
        frontColor: colors.error,
        topLabelComponent: () => (
          <Text style={{ fontSize: 10, color: colors.textPrimary }}>
            {[20, 40, 25, 20, 40, 30, 30][i]}
          </Text>
        ),
      });
    }
    return data;
  };

  const fetchMonthlyTransactionData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const data = [];

    for (let i = 0; i < 12; i++) {
      // Success bar
      data.push({
        value: [420, 380, 450, 410, 390, 400][i % 6],
        label: months[i],
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.success,
        topLabelComponent: () => (
          <Text style={{ fontSize: 10, color: colors.textPrimary }}>
            {[420, 380, 450, 410, 390, 400][i % 6]}
          </Text>
        ),
      });

      // Error bar
      data.push({
        value: [280, 320, 290, 360, 430, 350][i % 6],
        frontColor: colors.error,
        topLabelComponent: () => (
          <Text style={{ fontSize: 10, color: colors.textPrimary }}>
            {[280, 320, 290, 360, 430, 350][i % 6]}
          </Text>
        ),
      });
    }
    return data;
  };

  const fetchYearlyTransactionData = () => {
    const years = ["2020", "2021", "2022", "2023", "2024"];
    const data = [];

    for (let i = 0; i < 5; i++) {
      // Success bar
      data.push({
        value: [4800, 5500, 5800][i % 3],
        label: years[i],
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.success,
        topLabelComponent: () => (
          <Text style={{ fontSize: 10, color: colors.textPrimary }}>
            {[4800, 5500, 5800][i % 3]}
          </Text>
        ),
      });

      // Error bar
      data.push({
        value: [5200, 6000][i % 2],
        frontColor: colors.error,
        topLabelComponent: () => (
          <Text style={{ fontSize: 10, color: colors.textPrimary }}>
            {[5200, 6000][i % 2]}
          </Text>
        ),
      });
    }
    return data;
  };

  const fetchWeeklyPieData = () => {
    const categories = ["Food", "Transport", "Shopping", "Bills", "Other"];
    const percentages = [35, 25, 20, 15, 5];
    const colors = ["#4CAF50", "#2196F3", "#FFC107", "#F44336", "#9C27B0"];
    return categories.map((category, index) => ({
      value: percentages[index],
      color: colors[index],
      text: category,
      labelComponent: () => (
        <Text style={{ color: colors.textPrimary, fontSize: 12 }}>
          {`${category} ${percentages[index]}%`}
        </Text>
      ),
    }));
  };

  const fetchMonthlyPieData = () => {
    const categories = ["Food", "Transport", "Shopping", "Bills", "Other"];
    const percentages = [30, 20, 25, 20, 5];
    const colors = ["#4CAF50", "#2196F3", "#FFC107", "#F44336", "#9C27B0"];
    return categories.map((category, index) => ({
      value: percentages[index],
      color: colors[index],
      text: category,
      labelComponent: () => (
        <Text style={{ color: colors.textPrimary, fontSize: 12 }}>
          {`${category} ${percentages[index]}%`}
        </Text>
      ),
    }));
  };

  const fetchYearlyPieData = () => {
    const categories = ["Food", "Transport", "Shopping", "Bills", "Other"];
    const percentages = [25, 15, 30, 25, 5];
    const colors = ["#4CAF50", "#2196F3", "#FFC107", "#F44336", "#9C27B0"];
    return categories.map((category, index) => ({
      value: percentages[index],
      color: colors[index],
      text: category,
      labelComponent: () => (
        <Text style={{ color: colors.textPrimary, fontSize: 12 }}>
          {`${category} ${percentages[index]}%`}
        </Text>
      ),
    }));
  };

  const barChartInitData = {
    Weekly: fetchWeeklyTransactionData(),
    Monthly: fetchMonthlyTransactionData(),
    Yearly: fetchYearlyTransactionData(),
  };

  const pieChartInitData = {
    Weekly: fetchWeeklyPieData(),
    Monthly: fetchMonthlyPieData(),
    Yearly: fetchYearlyPieData(),
  };

  const [barChartData, setChartData] = useState(barChartInitData.Weekly);
  const [pieData, setPieData] = useState(pieChartInitData.Weekly);

  const handleTimeRangeChange = (event) => {
    const selectedIndex = event.nativeEvent.selectedSegmentIndex;
    setActiveIndex(selectedIndex);
    setChartData(barChartInitData[timeRanges[selectedIndex]]);
    setPieData(pieChartInitData[timeRanges[selectedIndex]]);
  };

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
              />
            ) : (
              <View style={styles.noChart} />
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
              Transaction Breakdown
            </Text>
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
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default statistics;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 0,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  segmentStyle: {
    height: scale(37),
  },
  chartContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
  },
  noChart: {
    backgroundColor: "rgba(0,0,0, 0.6)",
    height: verticalScale(210),
  },

  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.white,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: "left",
  },
  pieChartWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pieCenterText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  pieLegend: {
    marginLeft: spacingX._20,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacingY._5,
  },
  legendColor: {
    width: scale(12),
    height: scale(12),
    borderRadius: radius.sm,
    marginRight: spacingX._5,
  },
  legendText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
});
