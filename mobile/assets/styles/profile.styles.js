// styles/profile.styles.js
import { StyleSheet } from "react-native";
import { colors, spacingX, spacingY } from "@/constants/Theme";
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 600,
    color: colors.textPrimary,
  },
  email: {
    fontSize: 15,
    fontWeight: 500,
    color: colors.textSecondary,
  },
  optionsList: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  optionsCard: {
    backgroundColor: colors.cardBackground,
    padding: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 10,
  },
  optionsLabel: {
    fontSize: 16,
    fontWeight: 500,
    color: colors.textDark,
  },
  profileSection: {
    alignItems: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.black,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
  },
  userInfo: {
    alignItems: "center",
    marginVertical: spacingY._30,
    gap: spacingY._5,
  },
});

export default styles;
