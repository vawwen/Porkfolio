import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors } from "@/constants/Theme";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import styles from "@/assets/styles/profile.styles";

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
