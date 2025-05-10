import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingY } from "@/constants/Theme";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function Profile() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const accountOptions = [
    {
      title: "Edit Profile",
      icon: "person-outline",
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
      title: "Transaction Types",
      icon: "swap-horizontal",
      routeName: "/(type)",
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
      router.push(item.routeName);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
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
            <Text style={styles.name}>{user?.username}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        {/* Options */}
        <ScrollView
          style={styles.optionsList}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {accountOptions.map((item, index) => (
            <TouchableOpacity
              key={index.toString()}
              style={styles.optionsCard}
              onPress={() => handlePress(item)}
            >
              <Ionicons name={item.icon} size={30} color={colors.primaryDark} />
              <Text style={styles.optionsLabel}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

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
