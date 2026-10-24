import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { AdminNavigator } from './AdminNavigator';
import { SeniorStaffNavigator } from './SeniorStaffNavigator';
import { StaffNavigator } from './StaffNavigator';
import { LoadingScreen } from '../components/common/LoadingScreen';

export const RootNavigator: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Restoring session..." />;
  }

  return (
    <NavigationContainer>
      {!currentUser && <AuthNavigator />}
      {currentUser?.role === 'admin' && <AdminNavigator />}
      {currentUser?.role === 'senior_staff' && <SeniorStaffNavigator />}
      {currentUser?.role === 'staff' && <StaffNavigator />}
    </NavigationContainer>
  );
};
