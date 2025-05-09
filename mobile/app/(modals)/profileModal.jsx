import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { colors, spacingY } from "@/constants/Theme";
import { verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageService";
import { Ionicons } from "@expo/vector-icons";
import Typo from "@/components/Typo";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/modals.styles";

const profileModal = () => {
  const { user } = useAuthStore();

  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "",
    image: null,
  });

  useEffect(() => {
    setUserData({
      name: user?.username || "",
      image: user?.profileImage || null,
    });
  }, [user?.name, user?.image]);

  const onSubmit = async () => {
    let { name, image } = userData;
    if (!name.trim()) {
      Alert.alert("User", "Please fill all the fields");
      return;
    }

    //TODO
    //after finish close modal
    router.back();
  };

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUserData({ ...userData, image: result.assets[0] });
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Update Profile"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.avatarContainer}>
            <Image
              source={getProfileImage(userData.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />

            <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
              <Ionicons
                name="pencil-outline"
                size={verticalScale(20)}
                color={colors.accent}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor={colors.placeholderText}
                value={userData.name}
                onChangeText={(value) =>
                  setUserData({ ...userData, name: value })
                }
              />
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button onPress={onSubmit} style={{ flex: 1 }}>
          <Typo fontWeight={"700"}>Update</Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default profileModal;
