import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import HomeIllust from "../../assets/images/home-illust.jpg";
import { colors } from "../../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../assets/styles/txn.styles";
import FloatingButton from "../../components/FloatingButton";
import { API_URL } from "../../constants/api";
import homeStyles from "../../assets/styles/home.styles";
import Loader from "@/components/Loader";
import { Image } from "expo-image";
import logo2 from "@/assets/images/i.png";
import logo from "@/assets/images/logo-1.png";

export default function Home() {
  const { user, token, _version } = useAuthStore();
  const router = useRouter();

  const params = useLocalSearchParams();
  const selectedWallet = useMemo(() => {
    return params?.data ? JSON.parse(params.data) : null;
  }, [params?.data]);

  const [balance, setBalance] = useState(0);
  const [balIndicator, setBalIndicator] = useState("");
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  // Transaction List Items
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Get Expenses
  const fetchExpenses = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setIsLoading(true);

      const queryParams = new URLSearchParams({
        ...(selectedWallet &&
          selectedWallet?.name !== "Total" && { wallet: selectedWallet._id }), // Only adds wallet if selectedWallet exists
        page: pageNum,
        limit: 5,
      });

      const response = await fetch(`${API_URL}/expense?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch transactions");

      const uniqueTransactions =
        refresh || pageNum === 1
          ? data.expense
          : Array.from(
              new Set([...transactions, ...data.expense].map((txn) => txn._id))
            ).map((id) =>
              [...transactions, ...data.expense].find((txn) => txn._id === id)
            );
      setTransactions(uniqueTransactions);

      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);

      setBalance(
        data?.balance ? parseFloat(data.balance).toFixed(2) : (0).toFixed(2)
      );
      setIncome(
        data?.totalIncome
          ? parseFloat(data.totalIncome).toFixed(2)
          : (0).toFixed(2)
      );
      setExpense(
        data?.totalExpense
          ? parseFloat(data.totalExpense).toFixed(2)
          : (0).toFixed(2)
      );
    } catch (error) {
      console.log("Error fetching transactions", error);
    } finally {
      if (refresh) setRefreshing(false);
      else setIsLoading(false);
    }
  };

  // Update states
  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [_version]);

  const handleLoadMore = async () => {
    if (hasMore && !isLoading && !refreshing) {
      await fetchExpenses(page + 1);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.transactionsCard,
        {
          backgroundColor:
            item.category === "income"
              ? colors.successOverlay
              : colors.errorOverlay,
        },
      ]}
      onPress={() => {
        router.push({
          pathname: "/(modals)/expenseModal",
          params: {
            data: JSON.stringify(item),
          },
        });
      }}
    >
      {/* Transaction Icon */}
      <Ionicons
        name={item?.type?.icon}
        size={30}
        color={item.category === "income" ? colors.success : colors.error}
        style={styles.inputIcon}
      />
      <View style={styles.boxTextWrapper}>
        {/* Type */}
        <Text
          style={[styles.boxText, styles.description]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.name}
        </Text>
        {/* Desc */}
        <Text style={[styles.subtitle, styles.boxText]}>
          {item?.type?.name}
        </Text>
      </View>
      <View style={[styles.boxTextWrapper, { maxWidth: "30%" }]}>
        {/* Amount */}
        <Text
          style={[
            styles.boxText,
            styles.neutral,
            {
              textAlign: "right",
              color:
                item?.category === "income" ? colors.success : colors.error,
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.category === "income" ? "+" : "-"}${item?.value}
        </Text>
        {/* Date */}
        <Text style={[styles.subtitle, styles.boxText, { textAlign: "right" }]}>
          {new Date(item?.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (balance == 0) {
      setBalIndicator("");
    } else if (balance > 0) {
      setBalIndicator("+ ");
    } else {
      setBalIndicator("- ");
    }
  }, [balance]);

  // Can be loader
  if (isLoading) return <Loader />;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Image
          source={HomeIllust}
          style={styles.topImage}
          contentFit="stretch"
        />
        {/* Welcome box */}
        <View style={styles.content}>
          <View style={styles.overImageContent}>
            <Text style={styles.title}>
              Welcome back,{" "}
              <Text style={styles.username}>{user?.username ?? "Guest"}!</Text>
            </Text>
            <Text style={styles.subtitle}>Your Balance</Text>
            <Text
              style={[
                styles.balance,
                {
                  // Dynamic colors based on balance
                  color:
                    balance == 0
                      ? colors.textSecondary // no balance
                      : balance > 0
                      ? colors.success // surplus
                      : colors.error, // deflicit
                },
              ]}
            >
              {balIndicator}${Math.abs(balance)}
            </Text>
          </View>
          <View style={styles.belowImageContent}>
            <View style={styles.incomeExpenseContainer}>
              <View style={[styles.box, { flexDirection: "column" }]}>
                {/* Income */}
                <View style={styles.incomeExpense}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: colors.successOverlay },
                    ]}
                  >
                    <Ionicons
                      name="arrow-up-circle"
                      size={18}
                      color={colors.success}
                      style={styles.inputIcon}
                    />
                  </View>
                  <Text
                    style={[
                      styles.boxText,
                      income == 0 ? styles.neutral : styles.income,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    ${income}
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.neutralLight,
                    marginVertical: 2,
                  }}
                />
                {/* Expense */}
                <View style={styles.incomeExpense}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: colors.errorOverlay },
                    ]}
                  >
                    <Ionicons
                      name="arrow-down-circle"
                      size={18}
                      color={colors.error}
                      style={styles.inputIcon}
                    />
                  </View>
                  <Text
                    style={[
                      styles.boxText,
                      income == 0 ? styles.neutral : styles.expense,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    ${expense}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.box, { padding: 0 }]}
                onPress={() =>
                  router.push({
                    pathname: "(modals)/walletSelection",
                    params: { balance: balance.toString() },
                  })
                }
              >
                <View style={styles.miniWalletLeft}>
                  <Image
                    source={logo}
                    style={styles.miniWalletLogo}
                    contentFit="contain"
                  />
                  <Text
                    style={styles.miniWalletName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {selectedWallet?.name ?? "Total"}
                  </Text>
                </View>
                <View style={styles.miniWalletRight}>
                  <Image
                    source={selectedWallet?.icon ?? logo2}
                    style={styles.miniWalletIcon}
                    contentFit="cover"
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/* Recent Transactions */}
            <Text style={styles.section}>Recent Transactions</Text>
            <FlatList
              data={transactions}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    fetchExpenses(1, true);
                  }}
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                />
              }
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={
                hasMore && transactions.length > 0 ? (
                  <ActivityIndicator
                    style={homeStyles.footerLoader}
                    size="small"
                    color={colors.primary}
                  />
                ) : null
              }
              ListEmptyComponent={
                <View style={homeStyles.emptyContainer}>
                  <Ionicons
                    name="cash-outline"
                    size={60}
                    color={colors.secondary}
                  />
                  <Text style={homeStyles.emptyText}>No transactions yet</Text>
                  <Text style={homeStyles.emptySubtext}>
                    Start building your Porkfolio!
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </View>
      <FloatingButton onPress={() => router.push("/(modals)/expenseModal")} />
    </ScreenWrapper>
  );
}
