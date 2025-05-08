import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors, spacingY } from '@/constants/Theme'
import { ModelWrapperProps } from '@/types';

const ModalWrapper = ({
    style,
    children,
    bg = colors.background
}: ModelWrapperProps) => {
  return (
    <View style={[styles.container, {backgroundColor: bg}, style && style]}>
      {children}
    </View>
  )
}

export default ModalWrapper

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS == 'ios'? spacingY._15: 50,
        paddingBottom: Platform.OS == 'ios'? spacingY._20: spacingY._10,
    }
})