import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import SignUpScreen from './screens/login/signup_screen';

export default function App() {
  return (
    <View style={style.container}>
      <SignUpScreen></SignUpScreen>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    backgroundColor: "#232323",
    height: Dimensions.get('window').height,
  }
})