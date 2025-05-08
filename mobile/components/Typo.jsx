import { colors } from "@/constants/Theme";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, Text } from "react-native";

const Typo = ({
  size,
  color = colors.textPrimary,
  fontWeight = "400",
  children,
  style,
  textProps = {},
}) => {
  const textStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
  };

  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;

const styles = StyleSheet.create({});
