import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../constants/Theme";
import { useEffect } from "react";

const IncomeExpenseToggle = ({ onSelectionChange, item }) => {
  const [activeTab, setActiveTab] = useState("income");

  useEffect(() => {
    if (item) {
      setActiveTab(item?.category);
    }
  }, [item]);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    onSelectionChange(tab);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === "income" && styles.activeTab]}
        onPress={() => handleTabPress("income")}
      >
        <Text
          style={[styles.tabText, activeTab === "income" && styles.activeText]}
        >
          Income
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabButton, activeTab === "expense" && styles.activeTab]}
        onPress={() => handleTabPress("expense")}
      >
        <Text
          style={[styles.tabText, activeTab === "expense" && styles.activeText]}
        >
          Expense
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 5,
    width: "100%",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  activeText: {
    color: colors.primary,
    fontWeight: "600",
  },
});

export default IncomeExpenseToggle;
