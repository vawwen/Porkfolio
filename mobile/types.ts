// import { Firestore, Timestamp } from "firebase/firestore";
import React, { ReactNode } from "react";
import {
    TextProps,
    TextStyle,
    TouchableOpacityProps,
    ViewStyle,
} from "react-native";

export type ScreenWrapperProps = {
  style?: ViewStyle;
  children: ReactNode;
};

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children?: any | null;
  style?: TextStyle;
  textProps?: TextProps;
}

export interface CustomButtonProps extends TouchableOpacityProps {
  style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  children: React.ReactNode;
}

export type BackButtonProps = {
  style?: ViewStyle;
  iconSize?: number;
}

export type HeaderProps ={
  title?: string;
  style?: ViewStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export type AccountOptionType = {
  title: string;
  icon: React.ReactNode;
  routeName?: any;
}

export type ModelWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  bg?: string;
}

export type UserDataType = {
  name: string,
  image?: any,
}