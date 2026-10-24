import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
};

export type AdminTabParamList = {
  AdminDashboard: undefined;
  TeamAttendance: undefined;
  UserManagement: undefined;
  AdminProfile: undefined;
};

export type AdminStackParamList = {
  AdminTabs: NavigatorScreenParams<AdminTabParamList>;
  EmployeeDetailHistory: { userId: string };
};

export type SeniorStaffTabParamList = {
  SeniorDashboard: undefined;
  StaffAttendance: undefined;
  SeniorMyHistory: undefined;
  SeniorProfile: undefined;
};

export type SeniorStaffStackParamList = {
  SeniorTabs: NavigatorScreenParams<SeniorStaffTabParamList>;
  StaffDetailHistory: { userId: string };
};

export type StaffTabParamList = {
  StaffDashboard: undefined;
  StaffMyHistory: undefined;
  StaffProfile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  AdminRoot: NavigatorScreenParams<AdminStackParamList>;
  SeniorStaffRoot: NavigatorScreenParams<SeniorStaffStackParamList>;
  StaffRoot: NavigatorScreenParams<StaffTabParamList>;
};
