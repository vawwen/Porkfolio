import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY, radius } from "@/constants/Theme";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import logo from "../../assets/images/logo-1.png";

const welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Login button & image */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)")}
          style={styles.loginButton}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <Image source={logo} style={styles.welcomeImage} resizeMode="contain" />
      </View>

      {/* footer */}
      <View style={styles.footer}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.porkfolio}>Porkfolio</Text>
        </View>

        <View style={{ alignItems: "center", gap: 2 }}>
          <Text style={styles.subtitle}>An app to help you track and</Text>
          <Text style={styles.subtitle}>manage your finances</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/signup")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    alignSelf: "center",
    marginTop: verticalScale(100),
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
  },
  footer: {
    backgroundColor: colors.cardBackground,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    elevation: 10,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius._17,
    height: verticalScale(52),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { fontWeight: 600, color: colors.white, fontSize: 16 },
  porkfolio: { fontSize: 30, fontWeight: 800 },
  subtitle: { fontSize: 17, color: colors.secondary },
});
