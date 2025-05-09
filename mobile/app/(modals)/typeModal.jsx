import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
import AddTypeModal from "../../components/AddTypeModal";

const { width } = Dimensions.get("window");

export default function TypeModal({ isVisible }) {
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
      //   if (refresh) setRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.typeCard}
      onPress={() => {
        setIsModalVisible(true);
        setEditingType(item);
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
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="none"
        onRequestClose={onClose}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="arrow-back" size={verticalScale(26)} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Transaction Types</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsModalVisible(true)}
          >
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <ActivityIndicator style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={types}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </Modal>
      <AddTypeModal
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          fetchTypes();
          setEditingType(null);
        }}
        item={editingType}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 16,
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
  listContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  typeCard: {
    backgroundColor: colors.white,
    padding: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 10,
  },
  cardLabels: {
    display: "flex",
    flex: 1,
  },
  label: { fontSize: 12, color: colors.textSecondary },
  mainLabel: { fontSize: 20, fontWeight: 800 },
  button: {
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
