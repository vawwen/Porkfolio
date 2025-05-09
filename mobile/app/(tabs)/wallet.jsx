import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, spacingX, spacingY, radius } from '@/constants/Theme';
import { verticalScale } from '@/utils/styling';
import Typo from '@/components/Typo';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

const wallet = () => {
  const router = useRouter()
  const getTotalBalance = () => {
    return 0;
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Balance */}
        <View style={styles.balanceView}>
          <View style={{alignItems: "center"}}>
            <Typo size={45} fontWeight={"500"}>
              ${getTotalBalance()?.toFixed(2)}
            </Typo>
            <Typo size={16} color={colors.secondary}>
              Total Balance
            </Typo>
          </View>
        </View>

        {/* Wallet */}
        <View style={styles.wallets}>
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={"500"}>
              My wallets
            </Typo>
            <TouchableOpacity style={styles.circleStyle} onPress={() => router.push("/(modals)/walletModal")}>
              <Ionicons
                name='add-outline'
                color= {colors.white}
                size={verticalScale(25)}
              />
            </TouchableOpacity>
          </View>
        </View>


      </View>
    </ScreenWrapper>
  )
}

export default wallet

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  balanceView: {
    height: verticalScale(160),
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  wallets: {
    flex: 1,
    backgroundColor: colors.neutralLight,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
  circleStyle: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(20), 
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
})