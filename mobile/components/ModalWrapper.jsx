import { KeyboardAvoidingView } from "react-native";
import { colors } from "@/constants/Theme";
import styles from "../assets/styles/modals.styles";

export default function ModalWrapper({
  style = styles.wrapper,
  children,
  bg = colors.background,
}) {
  return (
    <KeyboardAvoidingView
      style={[styles.wrapper, { backgroundColor: bg }, style && style]}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
