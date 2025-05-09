import { useRef, useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { verticalScale } from "@/utils/styling";
import { colors } from "../constants/Theme";
import { useRouter } from "expo-router";
import IncomeExpenseToggle from "./IncomeExpenseToggle";
import { useAuthStore } from "../store/authStore";
import { API_URL } from "../constants/api";

const { width } = Dimensions.get("window");

export default function AddTypeModal({ isVisible, onClose, item }) {
  // Function
  const [name, setName] = useState("");
  const [category, setCategory] = useState("income");
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useAuthStore();

  const handleCategoryChange = (option) => {
    setCategory(option);
  };

  // Add new type
  const handleSubmit = async () => {
    if (!name || !selectedCategory) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/type`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          icon: selectedCategory.icon,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success", "You can now use your new type!");

      resetModal();
      onClose();
    } catch (error) {
      console.error("Error adding type:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit type
  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      if (!name || !selectedCategory) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      const response = await fetch(`${API_URL}/type/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          category,
          icon: selectedCategory.icon,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success", "You successfully edited the type!");

      resetModal();
      onClose();
    } catch (error) {
      console.error("Error editing type:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete type
  const handleDelete = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/type/${item?._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success", "You successfully deleted the type!");
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

  // Reset Input
  const resetModal = () => {
    setName("");
    setCategory("income");
    setSelectedCategory(null);
  };

  // Animation
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
      resetModal();
    }
  }, [isVisible]);

  const icons = [
    {
      category: "Transportation",
      options: [
        {
          name: "Plane",
          icon: "airplane-outline",
        },
        {
          name: "Boat",
          icon: "boat-outline",
        },
        {
          name: "Car",
          icon: "car-outline",
        },
        {
          name: "Bike",
          icon: "bicycle-outline",
        },
        {
          name: "Train",
          icon: "train-outline",
        },
      ],
    },
    {
      category: "Food",
      options: [
        {
          name: "Burger",
          icon: "fast-food-outline",
        },
        {
          name: "Resto",
          icon: "restaurant-outline",
        },
        {
          name: "Pizza",
          icon: "pizza-outline",
        },
        {
          name: "Fruit",
          icon: "nutrition-outline",
        },
        {
          name: "Beer",
          icon: "beer-outline",
        },
      ],
    },
    {
      category: "Shopping",
      options: [
        {
          name: "Grocery",
          icon: "basket-outline",
        },
        {
          name: "Luxury",
          icon: "diamond-outline",
        },
        {
          name: "Gift",
          icon: "gift-outline",
        },
        {
          name: "Gadget",
          icon: "desktop-outline",
        },
        {
          name: "Clothes",
          icon: "shirt-outline",
        },
      ],
    },
    {
      category: "Entertainment",
      options: [
        {
          name: "Games",
          icon: "game-controller-outline",
        },
        {
          name: "Movies",
          icon: "ticket-outline",
        },
        {
          name: "Gym",
          icon: "barbell-outline",
        },
        {
          name: "Sing",
          icon: "mic",
        },
        {
          name: "Gambling",
          icon: "dice-outline",
        },
      ],
    },
    {
      category: "Income",
      options: [
        {
          name: "Cash",
          icon: "cash-outline",
        },
        {
          name: "Wallet",
          icon: "wallet-outline",
        },
        {
          name: "Estate",
          icon: "home-outline",
        },
        {
          name: "Office",
          icon: "business-outline",
        },
        {
          name: "Work",
          icon: "briefcase-outline",
        },
      ],
    },
    {
      category: "Miscellaneous",
      options: [
        {
          name: "Health",
          icon: "fitness-outline",
        },
        {
          name: "Pet",
          icon: "paw-outline",
        },
        {
          name: "Friends",
          icon: "people-outline",
        },
        {
          name: "School",
          icon: "school-outline",
        },
        {
          name: "Crypto",
          icon: "logo-bitcoin",
        },
      ],
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelect = (category) => {
    setSelectedCategory(category);
  };

  function findOptionByIcon(optionName) {
    for (const category of icons) {
      const foundOption = category.options.find(
        (option) => option.icon === optionName
      );
      if (foundOption) {
        return {
          name: foundOption.name,
          icon: foundOption.icon,
          category: category.category, // parent category name
        };
      }
    }
    return null; // if not found
  }

  useEffect(() => {
    if (!!item) {
      setName(item?.name);
      setCategory(item?.category);
      setSelectedCategory(findOptionByIcon(item?.icon));
    }
  }, [item]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
              <Ionicons
                name="arrow-back"
                size={verticalScale(26)}
                color="#333"
              />
            </TouchableOpacity>
            <Text style={styles.title}>{item ? "Edit" : "New"} Type</Text>
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
            {/* Type Name */}
            <View style={styles.form}>
              <View style={styles.formGroup}>
                <IncomeExpenseToggle onSelectionChange={handleCategoryChange} />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>New Type Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter type name"
                    placeholderTextColor={colors.placeholderText}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              {/* Icon */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>New Type Icon</Text>
                <View style={[styles.iconPicker, { padding: 10 }]}>
                  <View style={{ width: "100%" }}>
                    {icons.map((cat) => (
                      <View key={cat.category}>
                        <Text style={{ color: colors.primaryDark }}>
                          {cat.category}
                        </Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                          }}
                        >
                          {cat.options.map((icon) => (
                            <TouchableOpacity
                              key={icon.name}
                              style={[
                                styles.categoryButton,
                                selectedCategory?.name === icon.name &&
                                  styles.selectedButton,
                              ]}
                              onPress={() => handleSelect(icon)}
                            >
                              <Ionicons
                                name={icon.icon}
                                size={28}
                                color={
                                  selectedCategory?.name === icon.name
                                    ? colors.primaryDark
                                    : colors.textSecondary
                                }
                              />
                              <Text
                                style={[
                                  styles.categoryText,
                                  selectedCategory?.name === icon.name &&
                                    styles.selectedText,
                                ]}
                              >
                                {icon.name}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
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
                    {item ? "Save Changes" : "Add new Type"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  scrollContentContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  scrollViewStyle: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    marginBottom: 16,
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: colors.textSecondary,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    color: colors.textDark,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
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
    color: colors.textSecondary,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  imagePicker: {
    width: "100%",
    height: 200,
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  iconPicker: {
    display: "flex",
    flex: 1,
    width: "100%",
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  categoryButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "20%",
    justifyContent: "center",
    height: "auto",
    padding: 5,
    marginBottom: 15,
    marginTop: 15,
    color: colors.textSecondary,
  },
  selectedButton: {
    backgroundColor: "rgba(177, 140, 229, 0.2)",
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: 10,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
    color: colors.textSecondary,
  },
  selectedText: {
    color: colors.primaryDark,
    fontWeight: "500",
  },
  deleteButton: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
