import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { AppHeader } from '../../components/common/AppHeader';
import { AttendanceStatusBadge } from '../../components/common/AttendanceStatusBadge';
import { RoleBadge } from '../../components/common/RoleBadge';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { THEME } from '../../constants/theme';
import { getLocalDateString, formatTimeReadable, formatDateReadable, isToday } from '../../utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SeniorStaffStackParamList } from '../../types/navigation';
import { useAndroidBackHandler } from '../../utils/useAndroidBackHandler';

export const SeniorStaffDashboardScreen: React.FC = () => {
  const isFocused = useIsFocused();
  useAndroidBackHandler(isFocused);

  const navigation = useNavigation<NativeStackNavigationProp<SeniorStaffStackParamList>>();
  const { currentUser, usersMap } = useAuth();
  const {
    records,
    seniorStaffStats,
    getTodayRecord,
    checkIn,
    checkOut,
    refreshRecords,
  } = useAttendance();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const todayStr = getLocalDateString();
  const myTodayRecord = currentUser ? getTodayRecord(currentUser.id) : undefined;
  const myStatus = myTodayRecord?.status || 'not_checked_in';

  // Strict Senior Staff RBAC: Only staff records from today
  const todayStaffRecords = records.filter((rec) => {
    if (!isToday(rec.date)) return false;
    const owner = usersMap.get(rec.userId);
    return owner?.role === 'staff';
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshRecords();
    setIsRefreshing(false);
  };

  const handleCheckIn = async () => {
    if (!currentUser) return;
    setActionLoading(true);
    const res = await checkIn(currentUser.id);
    setActionLoading(false);
    if (!res.success) {
      Alert.alert('Error', res.errorMessage);
    }
  };

  const handleCheckOut = async () => {
    if (!currentUser) return;
    setActionLoading(true);
    const res = await checkOut(currentUser.id);
    setActionLoading(false);
    if (!res.success) {
      Alert.alert('Error', res.errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Supervisor Dashboard"
        subtitle={formatDateReadable(todayStr)}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* 1. TOP ITEM: Check In / Check Out Card immediately visible on Home Page */}
        <View style={styles.punchCard}>
          <View style={styles.punchHeader}>
            <View style={styles.punchInfo}>
              <Text style={styles.punchTitle}>Today's Attendance</Text>
              <Text style={styles.punchSubtitle}>
                {myTodayRecord?.checkInTime
                  ? `In: ${formatTimeReadable(myTodayRecord.checkInTime)}${
                      myTodayRecord.checkOutTime
                        ? `  •  Out: ${formatTimeReadable(myTodayRecord.checkOutTime)}`
                        : ''
                    }`
                  : 'You have not checked in yet today'}
              </Text>
            </View>
            <AttendanceStatusBadge status={myStatus} size="sm" />
          </View>

          {myStatus === 'not_checked_in' ? (
            <PrimaryButton
              title="Check In"
              onPress={handleCheckIn}
              isLoading={actionLoading}
              icon="finger-print-outline"
              size="lg"
              style={styles.checkInBtn}
            />
          ) : myStatus === 'checked_in' ? (
            <PrimaryButton
              title="Check Out"
              onPress={handleCheckOut}
              isLoading={actionLoading}
              variant="danger"
              icon="log-out-outline"
              size="lg"
              style={styles.checkOutBtn}
            />
          ) : (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={18} color={THEME.colors.status.completed} />
              <Text style={styles.completedText}>Shift Completed for Today</Text>
            </View>
          )}
        </View>

        {/* 2. Staff Team Metrics Bar */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{seniorStaffStats.totalStaff}</Text>
            <Text style={styles.statLabel}>Staff Team</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: THEME.colors.status.completed }]}>
              {seniorStaffStats.staffCheckedInToday}
            </Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: THEME.colors.status.inProgress }]}>
              {seniorStaffStats.staffNotCheckedInToday}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* 3. Today's Staff Activity */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Today's Staff Logs ({todayStaffRecords.length})</Text>
          <TouchableOpacity onPress={() => (navigation as any).navigate('StaffAttendance')}>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        {todayStaffRecords.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No staff members checked in yet today.</Text>
          </View>
        ) : (
          <View style={styles.activityCard}>
            {todayStaffRecords.map((rec, index) => {
              const owner = usersMap.get(rec.userId);
              const isLast = index === todayStaffRecords.length - 1;

              return (
                <TouchableOpacity
                  key={rec.id}
                  activeOpacity={0.7}
                  onPress={() => {
                    navigation.navigate('StaffDetailHistory', { userId: rec.userId });
                  }}
                  style={[styles.activityRow, !isLast && styles.activityRowBorder]}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {owner?.name
                        ? owner.name.split(' ').map((n) => n[0]).join('').substring(0, 2)
                        : 'U'}
                    </Text>
                  </View>

                  <View style={styles.activityInfo}>
                    <View style={styles.activityNameRow}>
                      <Text style={styles.activityName} numberOfLines={1}>
                        {owner?.name || 'Staff Member'}
                      </Text>
                      {owner ? <RoleBadge role={owner.role} size="sm" /> : null}
                    </View>
                    <Text style={styles.activityTime}>
                      In: {formatTimeReadable(rec.checkInTime)}
                      {rec.checkOutTime ? `  •  Out: ${formatTimeReadable(rec.checkOutTime)}` : ''}
                    </Text>
                  </View>

                  <Ionicons name="chevron-forward" size={16} color={THEME.colors.text.tertiary} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  /* Top Check In / Check Out Card */
  punchCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 14,
    ...THEME.shadows.sm,
  },
  punchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  punchInfo: {
    flex: 1,
    marginRight: 8,
  },
  punchTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.text.primary,
  },
  punchSubtitle: {
    fontSize: 12,
    color: THEME.colors.text.secondary,
    marginTop: 2,
  },
  checkInBtn: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
  },
  checkOutBtn: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
    justifyContent: 'center',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.status.completedBg,
    borderRadius: 10,
    height: 44,
    gap: 6,
  },
  completedText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.status.completed,
  },
  /* 3-Metric Overview Bar */
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 20,
    ...THEME.shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.text.primary,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.text.secondary,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statDivider: {
    width: 1,
    height: 26,
    backgroundColor: THEME.colors.border,
  },
  /* Section Header */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.text.primary,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primaryLight,
  },
  /* Activity List Card */
  activityCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    overflow: 'hidden',
    ...THEME.shadows.sm,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  activityRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: THEME.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  activityInfo: {
    flex: 1,
    marginRight: 8,
  },
  activityNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.text.primary,
  },
  activityTime: {
    fontSize: 11,
    color: THEME.colors.text.secondary,
  },
  emptyCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: THEME.colors.text.tertiary,
  },
});
