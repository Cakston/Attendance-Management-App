import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SeniorStaffTabParamList, SeniorStaffStackParamList } from '../types/navigation';
import { SeniorStaffDashboardScreen } from '../screens/senior/SeniorStaffDashboardScreen';
import { StaffAttendanceScreen } from '../screens/senior/StaffAttendanceScreen';
import { StaffDetailHistoryScreen } from '../screens/senior/StaffDetailHistoryScreen';
import { MyHistoryScreen } from '../screens/staff/MyHistoryScreen';
import { ProfileScreen } from '../screens/common/ProfileScreen';
import { THEME } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator<SeniorStaffTabParamList>();
const Stack = createNativeStackNavigator<SeniorStaffStackParamList>();

const SeniorStaffTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: THEME.colors.primaryLight,
        tabBarInactiveTintColor: THEME.colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: THEME.colors.card,
          borderTopColor: THEME.colors.border,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="SeniorDashboard"
        component={SeniorStaffDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StaffAttendance"
        component={StaffAttendanceScreen}
        options={{
          tabBarLabel: 'Staff Logs',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SeniorMyHistory"
        component={MyHistoryScreen}
        options={{
          tabBarLabel: 'My History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SeniorProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const SeniorStaffNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SeniorTabs" component={SeniorStaffTabs} />
      <Stack.Screen
        name="StaffDetailHistory"
        component={StaffDetailHistoryScreen}
        options={{ presentation: 'card' }}
      />
    </Stack.Navigator>
  );
};
