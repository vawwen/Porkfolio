import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { act, useEffect, useState } from 'react'
import ScreenWrapper from "@/components/ScreenWrapper"
import { colors, radius, spacingX, spacingY } from '@/constants/Theme'
import { scale, verticalScale } from '@/utils/styling'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { BarChart, PieChart } from "react-native-gifted-charts"

const statistics = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const timeRanges = ['Weekly', 'Monthly', 'Yearly']

  const fetchWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
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
          <Text style={{ fontSize: 10,color: colors.textPrimary }}>
            {[65, 50, 75, 30, 60, 65, 65][i]}
          </Text>
        )
      });
      
      // Error bar
      data.push({
        value: [20, 40, 25, 20, 40, 30, 30][i], // Error values
        frontColor: colors.error,
        topLabelComponent: () => (
          <Text style={{ fontSize: 10, color: colors.textPrimary }}>
            {[20, 40, 25, 20, 40, 30, 30][i]}
          </Text>
        )
      });
    }
    return data;
  }
  
  const fetchMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
        )
      });
      
      // Error bar
      data.push({
        value: [280, 320, 290, 360, 430, 350][i % 6],
        frontColor: colors.error,
        topLabelComponent: () => (
          <Text style={{ fontSize: 10, color: colors.textPrimary }}>
            {[280, 320, 290, 360, 430, 350][i % 6]}
          </Text>
        )
      });
    }
    return data;
  }
  
  const fetchYearlyData = () => {
    const years = ['2020', '2021', '2022', '2023', '2024'];
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
        )
      });
      
      // Error bar
      data.push({
        value: [5200, 6000][i % 2],
        frontColor: colors.error,
        topLabelComponent: () => (
          <Text style={{ fontSize: 10, color: colors.textPrimary }}>
            {[5200, 6000][i % 2]}
          </Text>
        )
      });
    }
    return data;
  }
  
  const data = {
    Weekly: fetchWeeklyData(),
    Monthly: fetchMonthlyData(),
    Yearly: fetchYearlyData()
  }

  const [chartData, setChartData] = useState(data.Weekly)

  const handleTimeRangeChange = (event) => {
    const selectedIndex = event.nativeEvent.selectedSegmentIndex
    setActiveIndex(selectedIndex)
    setChartData(data[timeRanges[selectedIndex]])
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
        >
          <SegmentedControl
            values={timeRanges}
            selectedIndex={activeIndex}
            onChange={handleTimeRangeChange}
            tintColor={colors.primary}
            backgroundColor={colors.neutralLight}
            appearance='light'
            activeFontStyle={styles.segmentFontStyle}
            fontStyle={{...styles.segmentFontStyle, color: colors.textDark}}
            style={styles.segmentStyle}
          />

            <View style={styles.chartContainer}>
              {
                chartData.length > 0? (
                  <BarChart
                    data={chartData}
                    barWidth={scale(12)}
                    spacing={[1,2].includes(activeIndex)? scale(25):scale(16)}
                    roundedTop
                    yAxisLabelPrefix= "$"
                    yAxisTextStyle= {{color: colors.textPrimary, fontSize: verticalScale(12)}}
                    xAxisLabelTextStyle= {{
                      color: colors.textPrimary,
                      fontSize: verticalScale(12),
                    }}
                    noOfSections= {4}
                    minHeight= {5}
                  />
                ): (
                  <View style={styles.noChart} />
                )
              }
            </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default statistics

const styles = StyleSheet.create({
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 0,
  },
  noChart: {
    backgroundColor: "rgba(0,0,0, 0.6)",
    height: verticalScale(210),
  },
  segmentStyle: {
    height: scale(37),
  },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.white,
  },
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    marginBottom: spacingY._10,
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
})