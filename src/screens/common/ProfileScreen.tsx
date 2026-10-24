import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { AppHeader } from '../../components/common/AppHeader';
import { RoleBadge } from '../../components/common/RoleBadge';
import { AttendanceStatusBadge } from '../../components/common/AttendanceStatusBadge';
import { LogoutConfirmationModal } from '../../components/common/LogoutConfirmationModal';
import { Ionicons } from '@expo/vector-icons';
import { getLocalDateString } from '../../utils/dateUtils';

export const ProfileScreen: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { getTodayRecord, getUserRecords } = useAttendance();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const todayStr = getLocalDateString();
  const todayRecord = currentUser ? getTodayRecord(currentUser.id) : undefined;
  const currentStatus = todayRecord?.status || 'not_checked_in';
  const myTotalRecords = currentUser ? getUserRecords(currentUser.id).length : 0;

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      setLogoutModalVisible(false);
    }
  };

  const getRoleDisplayName = () => {
    switch (currentUser?.role) {
      case 'admin':
        return 'System Administrator';
      case 'senior_staff':
        return 'Supervisor / Senior Staff';
      case 'staff':
      default:
        return 'Staff Employee';
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Employee Account" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Executive Hero Banner Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {currentUser?.name
                    ? currentUser.name.split(' ').map((n) => n[0]).join('').substring(0, 2)
                    : 'U'}
                </Text>
              </View>
              <View style={styles.onlineDot} />
            </View>

            <View style={styles.heroUserMeta}>
              <Text style={styles.heroName} numberOfLines={1}>
                {currentUser?.name}
              </Text>
              <Text style={styles.heroRoleSub}>{getRoleDisplayName()}</Text>
              <Text style={styles.heroEmail} numberOfLines={1}>
                {currentUser?.email}
              </Text>
            </View>
          </View>

          {/* Quick Metrics Bar inside Hero */}
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>TODAY'S STATUS</Text>
              <View style={{ marginTop: 4 }}>
                <AttendanceStatusBadge status={currentStatus} size="sm" />
              </View>
            </View>

            <View style={styles.heroStatDivider} />

            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>LOGGED SHIFTS</Text>
              <Text style={styles.heroStatValue}>{myTotalRecords} Days</Text>
            </View>
          </View>
        </View>

        {/* Section: Employment Details */}
        <Text style={styles.sectionTitle}>Employment Profile</Text>
        <View style={styles.sectionCard}>
          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="finger-print-outline" size={18} color="#2563EB" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Employee ID</Text>
              <Text style={styles.itemValueMono}>{currentUser?.id}</Text>
            </View>
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="briefcase-outline" size={18} color="#16A34A" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Designation / Title</Text>
              <Text style={styles.itemValue}>{currentUser?.position || 'Operations Staff'}</Text>
            </View>
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: '#FAF5FF' }]}>
              <Ionicons name="business-outline" size={18} color="#9333EA" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Department</Text>
              <Text style={styles.itemValue}>{currentUser?.department || 'Operations'}</Text>
            </View>
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#D97706" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Security Permission Level</Text>
              <View style={{ marginTop: 2 }}>
                {currentUser ? <RoleBadge role={currentUser.role} size="sm" /> : null}
              </View>
            </View>
          </View>
        </View>


        {/* Sign Out Action Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={() => setLogoutModalVisible(true)}
        >
          <Ionicons name="log-out-outline" size={18} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonText}>Sign Out of WorkTrack</Text>
        </TouchableOpacity>

        <Text style={styles.versionLabel}>
          WorkTrack Mobile v1.0.0 • Role-Based Attendance System
        </Text>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        visible={logoutModalVisible}
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutModalVisible(false)}
        isLoading={isLoggingOut}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  /* Hero Card with Deep Navy Tone */
  heroCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#1E3A8A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#93C5FD',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  heroUserMeta: {
    flex: 1,
  },
  heroName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroRoleSub: {
    fontSize: 12,
    color: '#93C5FD',
    fontWeight: '600',
    marginTop: 1,
  },
  heroEmail: {
    fontSize: 11,
    color: '#BFDBFE',
    marginTop: 2,
  },
  heroStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#93C5FD',
    letterSpacing: 0.5,
  },
  heroStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  heroStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  /* Section Grouping */
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  itemValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    marginTop: 1,
  },
  itemValueMono: {
    fontSize: 13,
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600',
    marginTop: 1,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 62,
  },
  /* Logout Action Button */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingVertical: 13,
    marginTop: 4,
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  versionLabel: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
});
