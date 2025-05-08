import { Link, useRouter } from "expo-router";
import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/Theme';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const welcome = () => {
  const router = useRouter()
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
          <Typo color={colors.error}>(TEMP) Skip to App</Typo>
        </TouchableOpacity>
        {/* Login button & image */}
        <TouchableOpacity onPress={() => router.push('/(auth)')} style={styles.loginButton}>
          <Typo fontWeight={500}> Log In </Typo>
        </TouchableOpacity>

        <Image
          source={require("../assets/images/logo-1.png")}
          style={styles.welcomeImage}
          resizeMode='contain' />
      </View>

       {/* footer */}
       <View style={styles.footer}>
        <View style={{ alignItems: "center" }}>
            <Typo size={30} fontWeight={"800"}>
                Porkfolio
            </Typo>
        </View>

        <View style={{ alignItems: "center", gap: 2 }}>
            <Typo size={17} color={colors.textSecondary}>
                An app to help you track and
            </Typo>
            <Typo size={17} color={colors.textSecondary}>
                manage your finances
            </Typo>
        </View>

        <View style={styles.buttonContainer}>
            <Button onPress={() => router.push('/(auth)/signup')}>
              <Typo fontWeight={600}> Get Started </Typo>
            </Button>
        </View>
    </View>
    </ScreenWrapper>
  )
}

export default welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    alignSelf: "center",
    marginTop: verticalScale(100),
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.cardBackground,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    elevation: 10,
  },
  buttonContainer: {
      width: '100%',
      paddingHorizontal: spacingX._25,
  }
});
