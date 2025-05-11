import {
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState, useMemo } from "react";
import { colors } from "@/constants/Theme";
import { verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/modals.styles";
import { ProfileIcons } from "../../constants/constants";
import IncomeExpenseToggle from "../../components/IncomeExpenseToggle";
import { API_URL } from "../../constants/api";

export default function typeModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const item = useMemo(() => {
    return params?.data ? JSON.parse(params.data) : null;
  }, [params?.data]);
  const icons = ProfileIcons;

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
              <IncomeExpenseToggle
                onSelectionChange={handleCategoryChange}
                item={item}
              />
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
      </View>
    </ModalWrapper>
  );
}
