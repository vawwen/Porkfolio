import { ActivityIndicator, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { colors } from "@/constants/Theme";

const Loader = ({ size = "small" }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
};

export default Loader;
