import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StaffTabParamList } from '../types/navigation';
import { StaffDashboardScreen } from '../screens/staff/StaffDashboardScreen';
import { MyHistoryScreen } from '../screens/staff/MyHistoryScreen';
import { ProfileScreen } from '../screens/common/ProfileScreen';
import { THEME } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator<StaffTabParamList>();

export const StaffNavigator: React.FC = () => {
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
        name="StaffDashboard"
        component={StaffDashboardScreen}
        options={{
          tabBarLabel: 'Attendance',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="finger-print-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StaffMyHistory"
        component={MyHistoryScreen}
        options={{
          tabBarLabel: 'My History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StaffProfile"
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
