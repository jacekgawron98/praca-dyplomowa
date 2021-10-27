import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import AuthProvider from './contexts/auth-context';
import { Router } from './routes/router';
import SignInScreen from './screens/login/signin_screen';
import 'dotenv/config'

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}