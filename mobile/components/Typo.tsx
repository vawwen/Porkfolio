import { colors } from '@/constants/Theme';
import { TypoProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

const Typo = ({
  size,
  color = colors.textPrimary,
  fontWeight = '400',
  children,
  style,
  textProps = {},
}: TypoProps) => {
  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
  };

  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;

const styles = StyleSheet.create({});