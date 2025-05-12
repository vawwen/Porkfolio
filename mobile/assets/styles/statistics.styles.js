import { StyleSheet } from "react-native";
import { colors, radius, spacingX, spacingY } from "@/constants/Theme";
import { scale, verticalScale } from "@/utils/styling";

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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});

export default styles;
