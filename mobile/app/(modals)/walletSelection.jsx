import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "@/constants/Theme";
import { verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import styles from "@/assets/styles/modals.styles";
import { API_URL } from "@/constants/api";
import { useAuthStore } from "@/store/authStore";
import logo from "@/assets/images/logo-1.png";
import walletStyles from "@/assets/styles/wallet.styles";
import logo2 from "@/assets/images/i.png";
import Loader from "@/components/Loader";

export default function walletSelection() {
  const { token, _version } = useAuthStore();
  const router = useRouter();
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const params = useLocalSearchParams();
  const balance = parseFloat(params.balance);

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

  useEffect(() => {
    fetchWallets();
  }, [_version]);

  const onClose = () => {
    router.back();
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="arrow-back" size={verticalScale(26)} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Select Wallet</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          style={styles.scrollViewStyle}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {wallets?.map((item) => (
                <TouchableOpacity
                  key={item?._id}
                  style={walletStyles.walletItem}
                  onPress={() =>
                    router.replace({
                      pathname: "/(tabs)",
                      params: {
                        data: JSON.stringify(item),
                      },
                    })
                  }
                >
                  {/* LEFT */}
                  <View style={walletStyles.walletLeft}>
                    <View style={walletStyles.walletLogoWrapper}>
                      <Image
                        source={logo}
                        style={walletStyles.walletLogo}
                        contentFit="contain"
                      />
                    </View>
                    <Text
                      style={walletStyles.walletName}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item?.name}
                    </Text>
                    <Text
                      style={walletStyles.walletSubtitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Balance{" "}
                      {Math.abs(item.balance) > item.limit &&
                      item.balance < 0 ? (
                        <Text style={walletStyles.exceedLimit}>
                          EXCEEDS LIMIT!
                        </Text>
                      ) : (
                        <></>
                      )}
                    </Text>
                    <Text
                      style={[
                        walletStyles.walletBalance,
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
                    <Text style={walletStyles.walletSubtitle}>
                      Limit: {item?.limit}
                    </Text>
                  </View>
                  {/* RIGHT */}
                  <View style={walletStyles.walletRight}>
                    <Image
                      source={item?.icon}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                key={"total"}
                style={walletStyles.walletItem}
                onPress={() =>
                  router.replace({
                    pathname: "/(tabs)",
                    params: {
                      data: JSON.stringify({ name: "Total" }),
                    },
                  })
                }
              >
                {/* LEFT */}
                <View style={walletStyles.walletLeft}>
                  <View style={walletStyles.walletLogoWrapper}>
                    <Image
                      source={logo}
                      style={walletStyles.walletLogo}
                      contentFit="contain"
                    />
                  </View>
                  <Text
                    style={walletStyles.walletName}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    Total
                  </Text>
                  <Text
                    style={walletStyles.walletSubtitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Balance
                  </Text>
                  <Text
                    style={[
                      walletStyles.walletBalance,
                      {
                        color:
                          balance > 0
                            ? colors.success
                            : balance === 0
                            ? colors.textSecondary
                            : colors.error,
                      },
                    ]}
                  >
                    {balance > 0 ? "+ " : balance === 0 ? "" : "- "}$
                    {Math.abs(balance)}
                  </Text>
                  <Text style={walletStyles.walletSubtitle}>
                    {/* Limit: {item?.limit} */}
                  </Text>
                </View>
                {/* RIGHT */}
                <View style={walletStyles.walletRight}>
                  <Image
                    source={logo2}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                </View>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </ModalWrapper>
  );
}
