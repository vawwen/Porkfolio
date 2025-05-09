import { StyleSheet } from "react-native";
import { colors } from "@/constants/Theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 3,
    paddingBottom: 20,
    gap: 10,
  },
  scrollViewStyle: {
    marginTop: 10,
    flex: 1,
    backgroundColor: colors.background,
  },
  topImage: {
    width: "100%",
    height: 200,
    position: "absolute",
    top: 0,
    zIndex: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  overImageContent: {
    flex: "1 1 auto",
    marginTop: 70,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  belowImageContent: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  balance: { fontSize: 40, marginTop: 10, fontWeight: 800 },
  username: {
    color: colors.primary,
    fontWeight: "800",
  },
  incomeExpenseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 3,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  boxText: {
    marginLeft: 8,
  },
  boxTextWrapper: {
    height: "100%",
    flex: 1,
  },
  income: {
    color: colors.success,
    fontSize: 20,
    fontWeight: 700,
  },
  expense: {
    color: colors.error,
    fontSize: 20,
    fontWeight: 700,
  },
  neutral: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: 700,
  },
  transactionsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  transactionsCardType: {},
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
