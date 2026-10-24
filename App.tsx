import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { AttendanceProvider } from './src/context/AttendanceContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AttendanceProvider>
          <StatusBar barStyle="dark-content" />
          <RootNavigator />
        </AttendanceProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
