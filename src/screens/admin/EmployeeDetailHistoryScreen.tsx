import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { AppHeader } from '../../components/common/AppHeader';
import { AttendanceRecordCard } from '../../components/common/AttendanceRecordCard';
import { RoleBadge } from '../../components/common/RoleBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { THEME } from '../../constants/theme';
import { canViewEmployeeDetailHistory } from '../../utils/permissions';

/**
 * Shared screen to inspect an employee's full attendance history.
 * Enforces RBAC permissions:
 * - Admin can inspect any employee.
 * - Senior Staff can only inspect Staff employees or themselves.
 */
export const EmployeeDetailHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const userId: string = route.params?.userId;

  const { currentUser, usersMap } = useAuth();
  const { getUserRecords, refreshRecords } = useAttendance();

  const targetUser = usersMap.get(userId);

  // Security check: Verify viewer permissions
  const isAuthorized =
    currentUser &&
    targetUser &&
    canViewEmployeeDetailHistory(currentUser, targetUser) &&
    (currentUser.role === 'admin' || targetUser.role === 'staff' || targetUser.id === currentUser.id);

  if (!isAuthorized || !targetUser) {
    return (
      <View style={styles.container}>
        <AppHeader title="Access Restricted" onBack={() => navigation.goBack()} />
        <EmptyState
          icon="shield-outline"
          title="Access Unauthorized"
          description="You do not have clearance to view this employee's attendance history."
        />
      </View>
    );
  }

  const userRecords = getUserRecords(userId);

  return (
    <View style={styles.container}>
      <AppHeader
        title={`${targetUser.name}'s History`}
        subtitle={`${userRecords.length} recorded entries`}
        onBack={() => navigation.goBack()}
      />

      {/* Target Employee Summary Banner */}
      <View style={styles.profileBanner}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {targetUser.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{targetUser.name}</Text>
            <RoleBadge role={targetUser.role} size="sm" />
          </View>
          <Text style={styles.userEmail}>{targetUser.email}</Text>
          <Text style={styles.userRoleText}>
            {targetUser.position || targetUser.department || 'Employee'} • ID: {targetUser.id}
          </Text>
        </View>
      </View>

      <FlatList
        data={userRecords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onRefresh={refreshRecords}
        refreshing={false}
        renderItem={({ item }) => (
          <AttendanceRecordCard
            record={item}
            user={targetUser}
            showUserInfo={false}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title="No Attendance History"
            description={`No attendance records found for ${targetUser.name}.`}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.card,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: THEME.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.text.primary,
  },
  userEmail: {
    fontSize: 12,
    color: THEME.colors.text.secondary,
    marginBottom: 2,
  },
  userRoleText: {
    fontSize: 11,
    color: THEME.colors.text.tertiary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
