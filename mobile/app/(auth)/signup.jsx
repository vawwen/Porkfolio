import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import styles from "../../assets/styles/signup.styles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/Theme";
import { useState } from "react";
import { router } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import BackButton from "../../components/BackButton";
import illustrationImage from "../../assets/images/i.png";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { user, isLoading, register, token } = useAuthStore();

  const handleSignUp = async () => {
    const result = await register(username, email, password);

    if (!result.success) Alert.alert("Error", result.error);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <BackButton />
        <View style={{ flex: 0.3 }} />
        <View style={styles.header}>
          <Image
            source={illustrationImage}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
          <Text style={styles.topIllustrationText}>
            No more <Text style={styles.topIllustrationAppName}>oink</Text>-ing
            about money troubles!{" "}
          </Text>
        </View>
        <View style={styles.formContainer}>
          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Lebron James"
                placeholderTextColor={colors.placeholderText}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="lebron@gmail.com"
                placeholderTextColor={colors.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="******"
                placeholderTextColor={colors.placeholderText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Sign Up button */}
          <TouchableOpacity
            onPress={handleSignUp}
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>
          {/* Back to login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.link}>Login!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
