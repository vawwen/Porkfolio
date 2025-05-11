import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { verticalScale } from "@/utils/styling";
import { colors } from "../../constants/Theme";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../constants/api";
import styles from "../../assets/styles/type.styles";
import { useGlobalUpdate } from "../../hooks/useGlobalUpdate";

export default function Type() {
  const router = useRouter();
  const { token } = useAuthStore();

  const onClose = () => {
    router.back();
  };

  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTypes = async (refresh = false) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/type`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch types");

      setTypes(data);
    } catch (error) {
      console.log("Error fetching types", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update States
  useGlobalUpdate(fetchTypes);
  useEffect(() => {
    fetchTypes();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.typeCard}
      onPress={() => {
        router.push({
          pathname: "/(modals)/typeModal",
          params: {
            data: JSON.stringify(item),
          },
        });
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
          gap: 14,
        }}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                item?.category === "income"
                  ? colors.successOverlay
                  : colors.errorOverlay,
            },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={verticalScale(26)}
            color={item?.category === "income" ? colors.success : colors.error}
          />
        </View>

        <View style={styles.cardLabels}>
          <Text
            style={[
              {
                textAlign: "left",
              },
              styles.label,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item?.category?.charAt(0).toUpperCase() + item?.category?.slice(1)}
          </Text>
          <Text
            style={[
              {
                textAlign: "left",
                color:
                  item?.category === "income" ? colors.success : colors.error,
              },
              styles.mainLabel,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item?.name}
          </Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flex: 1,
          maxWidth: "30%",
        }}
      >
        <Text
          style={[
            {
              textAlign: "right",
            },
            styles.label,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Last Updated
        </Text>
        <Text
          style={[
            {
              textAlign: "right",
              color: colors.textDark,
            },
            styles.mainLabel,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {new Date(item?.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { flex: 1 }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons
            name="arrow-back"
            size={verticalScale(26)}
            color={colors.black}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Transaction Types</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push("/(modals)/typeModal");
          }}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />
      ) : (
        <FlatList
          data={types}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </KeyboardAvoidingView>
  );
}
