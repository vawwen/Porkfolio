import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState, useMemo } from "react";
import { colors, spacingY } from "@/constants/Theme";
import { verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/modals.styles";
import { API_URL } from "../../constants/api";

export default function profileModal() {
  const { user, edit, token } = useAuthStore();

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.username || "");
      setEmail(user.email || "");
      setImage(user.profileImage || null);
    }
  }, []);

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

  // Edit User
  const handleSubmit = async () => {
    if (
      name === user.username &&
      image === user.profileImage &&
      imageBase64 &&
      email === user.email
    ) {
      Alert.alert("Success", "You successfully saved your new profile!");
      onClose();
      return;
    }
    if (!name || !email || !image) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      setIsLoading(true);

      let imageDataUrl = image;
      if (image !== user.profileImage) {
        const uriParts = image.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const imageType = fileType
          ? `image/${fileType.toLowerCase()}`
          : "image/jpeg";

        imageDataUrl = `data:${imageType};base64,${imageBase64}`;
      }

      const response = await fetch(`${API_URL}/auth`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email,
          profileImage: imageDataUrl,
        }),
      });
      const data = await response.json();
      console.log(data);

      await edit(data.user);

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success", "You successfully saved your new profile!");

      onClose();
    } catch (error) {
      console.error("Error editing profile:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

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
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          style={styles.scrollViewStyle}
        >
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: image ?? user.profileImage }}
                  style={styles.avatar}
                  contentFit="cover"
                  transition={100}
                />

                <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
                  <Ionicons
                    name="pencil-outline"
                    size={verticalScale(20)}
                    color={colors.accent}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor={colors.placeholderText}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={colors.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
}
