import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AttendanceRecord, User } from '../../types';
import { THEME } from '../../constants/theme';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';
import { RoleBadge } from './RoleBadge';
import { formatDateReadable, formatTimeReadable, isToday } from '../../utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  record: AttendanceRecord;
  user?: User;
  showUserInfo?: boolean;
  onPress?: () => void;
}

export const AttendanceRecordCard: React.FC<Props> = ({
  record,
  user,
  showUserInfo = false,
  onPress,
}) => {
  const isRecordToday = isToday(record.date);

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {formatDateReadable(record.date)}
          </Text>
          {isRecordToday ? (
            <View style={styles.todayPill}>
              <Text style={styles.todayPillText}>TODAY</Text>
            </View>
          ) : null}
        </View>

        <AttendanceStatusBadge status={record.status} size="sm" />
      </View>

      {showUserInfo && user ? (
        <View style={styles.userSection}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>
              {user.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
            </Text>
          </View>
          <View style={styles.userInfoCol}>
            <Text style={styles.userName} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={styles.userDept} numberOfLines={1}>
              {user.position || user.department || user.email}
            </Text>
          </View>
          <RoleBadge role={user.role} size="sm" />
        </View>
      ) : null}

      <View style={styles.timeDetailsRow}>
        <View style={styles.timeBlock}>
          <View style={styles.timeLabelRow}>
            <Ionicons name="log-in-outline" size={13} color={THEME.colors.status.inProgress} />
            <Text style={styles.timeLabel}>Check In</Text>
          </View>
          <Text style={styles.timeValue}>{formatTimeReadable(record.checkInTime)}</Text>
        </View>

        <View style={styles.timeDivider} />

        <View style={styles.timeBlock}>
          <View style={styles.timeLabelRow}>
            <Ionicons name="log-out-outline" size={13} color={THEME.colors.status.completed} />
            <Text style={styles.timeLabel}>Check Out</Text>
          </View>
          <Text style={styles.timeValue}>{formatTimeReadable(record.checkOutTime)}</Text>
        </View>
      </View>

      {onPress ? (
        <View style={styles.footerRow}>
          <Text style={styles.viewDetailsText}>View Employee History</Text>
          <Ionicons name="chevron-forward" size={14} color={THEME.colors.primaryLight} />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.text.primary,
  },
  todayPill: {
    backgroundColor: THEME.colors.primaryGhost,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  todayPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.primaryLight,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
    marginBottom: THEME.spacing.sm,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarInitials: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  userInfoCol: {
    flex: 1,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.text.primary,
  },
  userDept: {
    fontSize: 11,
    color: THEME.colors.text.tertiary,
  },
  timeDetailsRow: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.sm,
    alignItems: 'center',
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  timeLabel: {
    fontSize: 11,
    color: THEME.colors.text.secondary,
    marginLeft: 4,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.text.primary,
  },
  timeDivider: {
    width: 1,
    height: 24,
    backgroundColor: THEME.colors.border,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: THEME.spacing.sm,
    paddingTop: 6,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primaryLight,
    marginRight: 2,
  },
});
