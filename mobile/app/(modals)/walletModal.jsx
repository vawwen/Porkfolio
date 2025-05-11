import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import { colors } from "@/constants/Theme";
import { verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import styles from "@/assets/styles/modals.styles";
import { API_URL } from "@/constants/api";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useAuthStore } from "@/store/authStore";

const walletModal = () => {
  const { token } = useAuthStore();
  const router = useRouter();
  const triggerRefresh = useAuthStore((state) => state.triggerRefresh);

  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get Wallet
  const params = useLocalSearchParams();
  const item = useMemo(() => {
    return params?.data ? JSON.parse(params.data) : null;
  }, [params?.data]);

  useEffect(() => {
    if (!!item) {
      setName(item?.name);
      setLimit(item?.limit);
      setImage(item?.icon);
    }
  }, []);

  useEffect(() => {
    console.log(limit);
  }, [limit]);

  const onClose = () => {
    router.back();
  };

  const resetModal = () => {
    setName("");
    setLimit(0);
    setImage(null);
    setImageBase64(null);
  };

  // Image upload
  const pickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "We need camera roll permissions to upload an image"
          );
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "images",
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
          base64: true,
        });

        console.log(result);

        if (!result.canceled) {
          setImage(result.assets[0].uri);

          if (result.assets[0].base64) {
            setImageBase64(result.assets[0].base64);
          } else {
            const base64 = await FileSystem.readAsStringAsync(
              result.assets[0].uri,
              { encoding: FileSystem.EncodingType.Base64 }
            );
            setImageBase64(base64);
          }
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "There was a problem selecting your image");
    }
  };

  // Add new wallet
  const handleSubmit = async () => {
    if (!name || !limit || !imageBase64) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      setIsLoading(true);

      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType
        ? `image/${fileType.toLowerCase()}`
        : "image/jpeg";

      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      const response = await fetch(`${API_URL}/wallet`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          limit: parseFloat(limit).toFixed(2),
          icon: imageDataUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success", "You can now use your new wallet!");

      resetModal();
      onClose();
    } catch (error) {
      console.error("Error adding wallet:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      triggerRefresh();
      setIsLoading(false);
    }
  };

  // Edit wallet
  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      if (
        name === item.name &&
        image === item.icon &&
        imageBase64 &&
        limit === item.limit
      ) {
        Alert.alert("Success", "You successfully edited the wallet!");
        onClose();
        return;
      }

      if (!name || !limit || !image) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      let imageDataUrl = image;
      if (image !== item.icon) {
        const uriParts = image.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const imageType = fileType
          ? `image/${fileType.toLowerCase()}`
          : "image/jpeg";

        imageDataUrl = `data:${imageType};base64,${imageBase64}`;
      }

      const response = await fetch(`${API_URL}/wallet/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          icon: imageDataUrl,
          limit,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success", "You successfully edited the wallet!");

      resetModal();
      onClose();
    } catch (error) {
      console.error("Error editing wallet:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      triggerRefresh();
      setIsLoading(false);
    }
  };

  // Delete wallet
  const handleDelete = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/wallet/${item?._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success", "You successfully deleted the wallet!");

      resetModal();
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      triggerRefresh();
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

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="arrow-back" size={verticalScale(26)} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>{item ? "Edit" : "New"} Wallet</Text>
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
          {/* Name */}
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Wallet Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="wallet-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Wallet Name"
                  placeholderTextColor={colors.placeholderText}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Limit */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Limit</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="speedometer-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  keyboardType="decimal-pad"
                  style={styles.input}
                  placeholder="Enter Spending Limit"
                  placeholderTextColor={colors.placeholderText}
                  value={String(limit)}
                  onChangeText={(text) => {
                    const filteredText = text.replace(/[^0-9.]/g, "");

                    const parts = filteredText.split(".");
                    if (parts.length <= 2) {
                      setLimit(filteredText);
                    }
                  }}
                />
              </View>
            </View>

            {/* Icon */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Wallet Icon</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={styles.previewImage}
                  ></Image>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name="image-outline"
                      size={40}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.placeholderText}>
                      Tap to select image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
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
                  {item ? "Save Changes" : "Add New Wallet"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default walletModal;
