import { colors } from "@/constants/Theme";
import React from "react";
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children }) => {
  const paddingTop = Platform.OS === "ios" ? height * 0.03 : 50;

  return (
    <View
      style={[
        {
          paddingTop,
          flex: 1,
          backgroundColor: colors.white,
        },
        style,
      ]}
    >
      <StatusBar barStyle="dark-content" />
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
