import React from 'react';
import { StatusBar } from 'react-native';
import AuthProvider from './contexts/auth-context';
import { Router } from './routes/router';

export default function App() {
  return (
    <AuthProvider>
      <Router />
      <StatusBar />
    </AuthProvider>
  );
}