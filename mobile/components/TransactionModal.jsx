import React, { useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { verticalScale } from "@/utils/styling";
import { colors } from "../constants/Theme";

const { width } = Dimensions.get("window");

export default function TransactionModal({
  isVisible,
  onClose,
  onAddIncome,
  onAddExpense,
}) {
  // Animations
  const slideAnim = useRef(new Animated.Value(width)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          slideAnim.setValue(-gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -100) {
          onClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="arrow-back" size={verticalScale(26)} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>New Transaction</Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity style={styles.option} onPress={onAddIncome}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#E8F5E9" }]}
            >
              <Ionicons
                name="arrow-up-circle"
                size={28}
                color={colors.success}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionText}>Add Income</Text>
              <Text style={styles.optionSubtext}>Record money received</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={onAddExpense}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#FFEBEE" }]}
            >
              <Ionicons
                name="arrow-down-circle"
                size={28}
                color={colors.error}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionText}>Add Expense</Text>
              <Text style={styles.optionSubtext}>Record money spent</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  closeButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 4,
  },
  optionSubtext: {
    fontSize: 14,
    color: "#666",
  },
});
