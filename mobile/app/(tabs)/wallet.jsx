import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors } from "@/constants/Theme";
import { verticalScale } from "@/utils/styling";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API_URL } from "@/constants/api";
import { useAuthStore } from "@/store/authStore";
import { Image } from "expo-image";
import logo from "../../assets/images/logo-1.png";
import styles from "@/assets/styles/wallet.styles";

export default function wallet() {
  const { token } = useAuthStore();

  const [wallets, setWallets] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Get wallets
  const fetchWallets = async (refresh = false) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch wallets");

      setWallets(data.wallets ?? []);
      setTotalBalance(data.totalBalance ?? 0.0);
    } catch (error) {
      console.log("Error fetching wallets", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update states
  useEffect(() => {
    fetchWallets();
  }, []);

  const router = useRouter();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Balance */}
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            {isLoading ? (
              <View style={styles.balanceLoading}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : (
              <Text style={styles.balance}>${totalBalance?.toFixed(2)}</Text>
            )}
            <Text style={styles.balanceSubtitle}>Total Balance</Text>
          </View>
        </View>

        {/* Wallet */}
        <View style={styles.wallets}>
          <View style={styles.flexRow}>
            <Text style={{ fontSize: 20, fontWeight: 800 }}>My Wallets</Text>
            <TouchableOpacity
              style={styles.circleStyle}
              onPress={() => router.push("/(modals)/walletModal")}
            >
              <Ionicons
                name="add-outline"
                color={colors.white}
                size={verticalScale(25)}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.walletsList}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            {isLoading ? (
              <View style={styles.listLoading}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : (
              wallets?.map((item) => (
                <TouchableOpacity
                  key={item?._id}
                  style={styles.walletItem}
                  onPress={() =>
                    router.push({
                      pathname: "/(modals)/walletModal",
                      params: {
                        data: JSON.stringify(item),
                      },
                    })
                  }
                >
                  {/* LEFT */}
                  <View style={styles.walletLeft}>
                    <View style={styles.walletLogoWrapper}>
                      <Image
                        source={logo}
                        style={styles.walletLogo}
                        contentFit="contain"
                      />
                    </View>
                    <Text
                      style={styles.walletName}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item?.name}
                    </Text>
                    <Text
                      style={styles.walletSubtitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Balance{" "}
                      {Math.abs(item.balance) > item.limit &&
                      item.balance < 0 ? (
                        <Text style={styles.exceedLimit}>EXCEEDS LIMIT!</Text>
                      ) : (
                        <></>
                      )}
                    </Text>
                    <Text
                      style={[
                        styles.walletBalance,
                        {
                          color:
                            item?.balance > 0
                              ? colors.success
                              : item?.balance === 0
                              ? colors.textSecondary
                              : colors.error,
                        },
                      ]}
                    >
                      {item?.balance > 0
                        ? "+ "
                        : item?.balance === 0
                        ? ""
                        : "- "}
                      ${Math.abs(item?.balance)}
                    </Text>
                    <Text style={styles.walletSubtitle}>
                      Limit: {item?.limit}
                    </Text>
                  </View>
                  {/* RIGHT */}
                  <View style={styles.walletRight}>
                    <Image
                      source={item?.icon}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </ScreenWrapper>
  );
}
