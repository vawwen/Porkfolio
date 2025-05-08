import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { BackButtonProps } from '@/types'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { verticalScale } from '@/utils/styling'
import { colors } from '@/constants/Theme'

const BackButton = ({
    style,
    iconSize = 26,
}: BackButtonProps) => {
    const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()} style={[styles.button]}>
        <Ionicons name="arrow-back" size={verticalScale(iconSize)} color={colors.black} />
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({
    button: {

    }
})