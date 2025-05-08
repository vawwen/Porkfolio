import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from '@/components/Button'
import Typo from '@/components/Typo'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useRouter } from 'expo-router'

const Home = () => {
    const router = useRouter()
  return (
    <ScreenWrapper>
      <Text>Home</Text>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({})