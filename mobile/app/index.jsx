import { colors } from '@/constants/Theme';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

const index = () => {
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
            router.push('/(auth)/welcome')
        }, 500);
    }, []);

  return (
    <View style={styles.container}>
        <Image 
            style = {styles.logo}
            resizeMode= "contain"
            source = {require("../assets/images/i.png")}
        />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    logo: {
        height: "20%",
        aspectRatio: 1,
    }
});