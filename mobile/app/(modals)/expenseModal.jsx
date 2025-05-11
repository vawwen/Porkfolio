import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState, useMemo, useCallback } from "react";
import { colors } from "@/constants/Theme";
import { verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/modals.styles";
import IncomeExpenseToggle from "../../components/IncomeExpenseToggle";
import { API_URL } from "../../constants/api";
import DropdownComponent from "@/components/DropdownComponent";

export default function expenseModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const item = useMemo(() => {
    return params?.data ? JSON.parse(params.data) : null;
  }, [params?.data]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(""); // value
  const [category, setCategory] = useState("income");
  const [wallet, setWallet] = useState(null);
  const [type, setType] = useState(null);

  const [walletList, setWalletList] = useState([]);
  const [typeList, setTypeList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [typeLoading, setTypeLoading] = useState(false);

  //   name, value, category, type, wallet;

  const { token } = useAuthStore();

  const handleCategoryChange = (option) => {
    setCategory(option);
  };

  // Add new expense
  const handleSubmit = async () => {
    if (!name || !amount || !wallet || !type) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/expense`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          value: amount,
          wallet,
          type,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success", "You successfully added a transaction!");

      resetModal();
      onClose();
    } catch (error) {
      console.error("Error adding transaction:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
      action();
    }
  };

  // Edit type
  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      if (!name || !amount || !wallet || !type) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      const response = await fetch(`${API_URL}/expense/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          category,
          value: amount,
          wallet,
          type,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success", "You successfully edited the transaction!");

      resetModal();
      onClose();
    } catch (error) {
      console.error("Error editing transaction:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete type
  const handleDelete = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/expense/${item?._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success", "You successfully deleted the transaction!");

      resetModal();
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete alert
  const showDeleteAlert = () => {
    Alert.alert("Confirm", `Are you sure you want to delete ${item?.name}?`, [
      {
        text: "Cancel",
        onPress: () => console.log("cancel delete"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => handleDelete(),
        style: "destructive",
      },
    ]);
  };

  // Fetch wallets
  const fetchWallets = async (refresh = false) => {
    try {
      setWalletLoading(true);

      const response = await fetch(`${API_URL}/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch wallets");

      setWalletList(data.wallets ?? []);
    } catch (error) {
      console.log("Error fetching wallets", error);
    } finally {
      setWalletLoading(false);
    }
  };

  // Fetch types
  const fetchTypes = async (refresh = false) => {
    try {
      setTypeLoading(true);

      const queryParams = new URLSearchParams({
        category: category,
      });

      const response = await fetch(`${API_URL}/type?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch types");

      setTypeList(data);
    } catch (error) {
      console.log("Error fetching types", error);
    } finally {
      setTypeLoading(false);
    }
  };

  // Fetch dropdown data
  useEffect(() => {
    fetchTypes();
    fetchWallets();
  }, []);

  useEffect(() => {
    fetchTypes();
    if (!item) {
      setType(null);
    }
  }, [category]);

  // Reset Input
  const resetModal = () => {
    setName("");
    setCategory("income");
    setAmount("");
    setWallet(null);
    setType(null);
  };

  useEffect(() => {
    if (!!item) {
      setName(item?.name);
      setCategory(item?.category);
      setWallet(item?.wallet);
      setType(item?.type?._id);
      setAmount(item?.value);
    }
  }, [item]);

  const onClose = () => {
    router.back();
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="arrow-back" size={verticalScale(26)} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>{item ? "Edit" : "New"} Transaction</Text>
          {/* Delete button */}
          {item ? (
            isLoading ? (
              <ActivityIndicator color={colors.error} />
            ) : (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => showDeleteAlert()}
              >
                <Ionicons
                  name="trash-outline"
                  size={verticalScale(26)}
                  color={colors.error}
                />
              </TouchableOpacity>
            )
          ) : (
            <></>
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          style={styles.scrollViewStyle}
        >
          <View style={styles.form}>
            {/* Category */}
            <View style={styles.formGroup}>
              <IncomeExpenseToggle
                onSelectionChange={handleCategoryChange}
                item={item}
              />
            </View>
            {/* Wallet */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Wallet</Text>
              <DropdownComponent
                icon={"wallet-outline"}
                data={walletList}
                value={wallet}
                setValue={setWallet}
              />
            </View>
            {/* Type */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Transaction Type</Text>
              <DropdownComponent
                icon={"swap-horizontal"}
                data={typeList}
                value={type}
                setValue={setType}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter transaction description"
                  placeholderTextColor={colors.placeholderText}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Amount */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  keyboardType="decimal-pad"
                  style={styles.input}
                  placeholder="Enter amount"
                  placeholderTextColor={colors.placeholderText}
                  value={String(amount)}
                  onChangeText={(text) => {
                    const filteredText = text.replace(/[^0-9.]/g, "");

                    const parts = filteredText.split(".");
                    if (parts.length <= 2) {
                      setAmount(filteredText);
                    }
                  }}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={item ? handleUpdate : handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>
                  {item ? "Save Changes" : "Add Transaction"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
}
