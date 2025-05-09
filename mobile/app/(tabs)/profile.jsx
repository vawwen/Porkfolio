import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/Theme";
import { verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const accountOptions = [
    {
      title: "Edit Profile",
      icon: "person",
      routeName: "/(modals)/profileModal",
    },
    {
      title: "Settings",
      icon: "settings-outline",
      routeName: "/(modals)/settingsModal",
    },
    {
      title: "Spending Limit",
      icon: "cash-outline",
      routeName: "/(modals)/spendingModal",
    },
    {
      title: "Budget Allocation",
      icon: "pie-chart-outline",
      routeName: "/(modals)/budgetModal",
    },
    {
      title: "Logout",
      icon: "log-out-outline",
      routeName: "/(auth)/welcome",
    },
  ];

  const showLogoutAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("cancel logout"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: logout,
        style: "destructive",
      },
    ]);
  };

  const handlePress = (item) => {
    if (item.title === "Logout") {
      showLogoutAlert();
    } else {
      // router.push(item.routeName);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Profile" style={{ marginVertical: spacingY._10 }} />

        {/* User Information */}
        <View style={styles.profileSection}>
          {/* Avatar */}
          <View>
            <Image
              source={user?.profileImage}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>

          {/* Name & email */}
          <View style={styles.userInfo}>
            <Typo size={24} fontWeight={600} color={colors.textPrimary}>
              {user?.username}
            </Typo>
            <Typo size={15} fontWeight={600} color={colors.textSecondary}>
              {user?.email}
            </Typo>
          </View>

          {/* Account Options */}
          <View style={styles.optionsContainer}>
            {accountOptions.map((item, index) => (
              <TouchableOpacity
                key={index.toString()}
                style={styles.optionCard}
                onPress={() => handlePress(item)}
              >
                {/* Icon */}
                <View style={styles.optionContent}>
                  <Ionicons
                    name={item.icon}
                    size={24}
                    color={colors.primaryDark}
                    style={styles.optionIcon}
                  />
                  <Typo size={16} fontWeight={"500"}>
                    {item.title}
                  </Typo>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: spacingY._30,
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
  optionsContainer: {
    width: "100%",
    gap: spacingY._15,
  },
  optionCard: {
    width: "100%",
    backgroundColor: colors.cardBackground,
    borderRadius: radius._20,
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingX._20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
  },
  optionIcon: {
    width: 24,
    textAlign: "center",
  },
});
