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
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { THEME } from '../../constants/theme';
import { getLocalDateString, formatTimeReadable, formatDateReadable } from '../../utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StaffTabParamList } from '../../types/navigation';
import { useAndroidBackHandler } from '../../utils/useAndroidBackHandler';

export const StaffDashboardScreen: React.FC = () => {
  const isFocused = useIsFocused();
  useAndroidBackHandler(isFocused);

  const navigation = useNavigation<BottomTabNavigationProp<StaffTabParamList>>();
  const { currentUser } = useAuth();
  const { getTodayRecord, checkIn, checkOut, refreshRecords } = useAttendance();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const todayStr = getLocalDateString();
  const todayRecord = currentUser ? getTodayRecord(currentUser.id) : undefined;
  const currentStatus = todayRecord?.status || 'not_checked_in';

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
        title="Dashboard"
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
            <View style={styles.userMeta}>
              <Text style={styles.userName}>{currentUser?.name}</Text>
              <Text style={styles.userRoleText}>
                {currentUser?.position || currentUser?.department || 'Staff Employee'}
              </Text>
            </View>
            <AttendanceStatusBadge status={currentStatus} size="sm" />
          </View>

          {/* Large Primary Action Button */}
          <View style={styles.actionArea}>
            {currentStatus === 'not_checked_in' ? (
              <PrimaryButton
                title="Check In"
                onPress={handleCheckIn}
                isLoading={actionLoading}
                size="lg"
                icon="finger-print-outline"
                style={styles.checkInBtn}
              />
            ) : currentStatus === 'checked_in' ? (
              <PrimaryButton
                title="Check Out"
                onPress={handleCheckOut}
                isLoading={actionLoading}
                variant="danger"
                size="lg"
                icon="log-out-outline"
                style={styles.checkOutBtn}
              />
            ) : (
              <View style={styles.completedCard}>
                <Ionicons name="checkmark-circle" size={18} color={THEME.colors.status.completed} />
                <Text style={styles.completedCardText}>Shift Completed for Today</Text>
              </View>
            )}
          </View>

          {/* Simple Inline Timestamps */}
          <View style={styles.timeSummaryRow}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeTag}>Check In</Text>
              <Text style={styles.timeText}>
                {formatTimeReadable(todayRecord?.checkInTime ?? null)}
              </Text>
            </View>

            <View style={styles.timeSeparator} />

            <View style={styles.timeColumn}>
              <Text style={styles.timeTag}>Check Out</Text>
              <Text style={styles.timeText}>
                {formatTimeReadable(todayRecord?.checkOutTime ?? null)}
              </Text>
            </View>
          </View>
        </View>

        {/* 2. History Shortcut */}
        <TouchableOpacity
          style={styles.historyBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('StaffMyHistory')}
        >
          <View style={styles.historyBtnLeft}>
            <Ionicons name="time-outline" size={18} color={THEME.colors.primaryLight} style={{ marginRight: 10 }} />
            <Text style={styles.historyBtnText}>View My Attendance History</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={THEME.colors.text.tertiary} />
        </TouchableOpacity>
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
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 14,
    ...THEME.shadows.sm,
  },
  punchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userMeta: {
    flex: 1,
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.text.primary,
  },
  userRoleText: {
    fontSize: 12,
    color: THEME.colors.text.secondary,
    marginTop: 2,
  },
  actionArea: {
    marginBottom: 16,
  },
  checkInBtn: {
    minHeight: 52,
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    justifyContent: 'center',
  },
  checkOutBtn: {
    minHeight: 52,
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
    borderRadius: 12,
    justifyContent: 'center',
  },
  completedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.status.completedBg,
    borderRadius: 12,
    height: 48,
    gap: 6,
  },
  completedCardText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.status.completed,
  },
  timeSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
  },
  timeColumn: {
    alignItems: 'center',
    flex: 1,
  },
  timeTag: {
    fontSize: 11,
    color: THEME.colors.text.secondary,
    marginBottom: 2,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.text.primary,
  },
  timeSeparator: {
    width: 1,
    height: 28,
    backgroundColor: THEME.colors.border,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  historyBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.text.primary,
  },
});
