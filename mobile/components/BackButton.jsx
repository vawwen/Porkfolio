import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { verticalScale } from "@/utils/styling";
import { colors } from "@/constants/Theme";

const BackButton = ({ style, iconSize = 26 }) => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()} style={[styles.button]}>
      <Ionicons
        name="arrow-back"
        size={verticalScale(26)}
        color={colors.black}
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    marginRight: 15,
  },
});
