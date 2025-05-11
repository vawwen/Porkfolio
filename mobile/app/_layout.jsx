import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [user, token]);

  useEffect(() => {
    const inAuthScreen = segments[0] === "(auth)" || segments[0] === undefined;
    const isSignedIn = !!user && !!token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)/welcome");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(type)" />
          {/* Modals */}
          <Stack.Screen
            name="(modals)/profileModal"
            options={{
              presentation: "modal",
              animation:
                Platform.OS === "android" ? "slide_from_right" : undefined,
            }}
          />
          <Stack.Screen
            name="(modals)/typeModal"
            options={{
              presentation: "modal",
              animation:
                Platform.OS === "android" ? "slide_from_right" : undefined,
            }}
          />
          <Stack.Screen
            name="(modals)/walletModal"
            options={{ presentation: "modal" }}
          />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
