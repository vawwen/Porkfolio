import { StyleSheet, Dimensions, Platform } from "react-native";
// import { colors, spacingY } from "@/constants/Theme";
import { colors, spacingX, spacingY } from "@/constants/Theme";
import { scale, verticalScale } from "@/utils/styling";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: Platform.OS == "ios" ? height * 0.03 : height * 0.035,
    paddingBottom: Platform.OS == "ios" ? spacingY._20 : spacingY._10,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._10,
    // paddingVertical: spacingY._30,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._10,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.primary,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.black,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    // borderWidth: 1,
    // borderColor: colors.black,
    // overflow: "hidden",
    // position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.cardBackground,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  input: {
    flex: 1,
    height: 48,
    color: colors.textDark,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  inputGroup: { marginBottom: 20 },
});

export default styles;
