import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import HomeIllust from "../../assets/images/home-illust.jpg";
import { colors } from "../../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../assets/styles/txn.styles";
import FloatingButton from "../../components/FloatingButton";
import TransactionModal from "../../components/TransactionModal";
import { API_URL } from "../../constants/api";
import { useGlobalUpdate } from "@/hooks/useGlobalUpdate";

export default function Home() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [balIndicator, setBalIndicator] = useState("");
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  // Modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddIncome = () => {
    setIsModalVisible(false);
    // Navigate to add income screen or show income form
  };

  const handleAddExpense = () => {
    setIsModalVisible(false);
    // Navigate to add expense screen or show expense form
  };

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

      const response = await fetch(
        `${API_URL}/expense?page=${pageNum}&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch transactions");

      // setTransactions((prevTxns) => [...prevTxns, ...data.expense]);

      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);

      setBalance(parseFloat(data.balance).toFixed(2));
      setIncome(parseFloat(data.totalIncome).toFixed(2));
      setExpense(parseFloat(data.totalExpense).toFixed(2));

      console.log(data);
    } catch (error) {
      console.log("Error fetching transactions", error);
    } finally {
      if (refresh) setRefreshing(false);
      else setIsLoading(false);
    }
  };

  // Update states
  useGlobalUpdate(fetchExpenses);
  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleLoadMore = async () => {};

  const renderItem = ({ item }) => {
    <TouchableOpacity style={styles.transactionsCard}>
      {/* Transaction Icon */}
      <Ionicons
        name="car-sharp"
        size={30}
        color={colors.success}
        style={styles.inputIcon}
      />
      <View style={styles.boxTextWrapper}>
        {/* Type */}
        <Text
          style={[styles.boxText, styles.neutral]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.type?.name}
        </Text>
        {/* Desc */}
        <Text style={[styles.subtitle, styles.boxText]}>{item?.name}</Text>
      </View>
      <View style={[styles.boxTextWrapper, { maxWidth: "30%" }]}>
        {/* Amount */}
        <Text
          style={[styles.boxText, styles.neutral, { textAlign: "right" }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.value}
        </Text>
        {/* Date */}
        <Text style={[styles.subtitle, styles.boxText, { textAlign: "right" }]}>
          25/10/25
        </Text>
      </View>
    </TouchableOpacity>;
  };

  useEffect(() => {
    if (balance == 0) {
      setBalIndicator("");
    } else if (balance > 0) {
      setBalIndicator("+ ");
    } else {
      setBalIndicator("- ");
    }
  }, [balance]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Image
          source={HomeIllust}
          style={styles.topImage}
          resizeMode="stretch"
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
              {/* Income */}
              <TouchableOpacity style={styles.box}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.successOverlay },
                  ]}
                >
                  <Ionicons
                    name="arrow-up-circle"
                    size={25}
                    color={colors.success}
                    style={styles.inputIcon}
                  />
                </View>
                <View style={styles.boxTextWrapper}>
                  <Text style={[styles.subtitle, styles.boxText]}>Income</Text>
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
              </TouchableOpacity>

              {/* Expense */}
              <TouchableOpacity style={styles.box}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.errorOverlay },
                  ]}
                >
                  <Ionicons
                    name="arrow-down-circle"
                    size={25}
                    color={colors.error}
                    style={styles.inputIcon}
                  />
                </View>
                <View style={styles.boxTextWrapper}>
                  <Text style={[styles.subtitle, styles.boxText]}>Expense</Text>
                  <Text
                    style={[
                      styles.boxText,
                      expense == 0 ? styles.neutral : styles.expense,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    ${expense}
                  </Text>
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
            />
          </View>
        </View>
      </View>
      <FloatingButton onPress={() => setIsModalVisible(true)} />

      {/* Floating Action Modal */}
      <TransactionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddIncome={handleAddIncome}
        onAddExpense={handleAddExpense}
      />
    </ScreenWrapper>
  );
}
