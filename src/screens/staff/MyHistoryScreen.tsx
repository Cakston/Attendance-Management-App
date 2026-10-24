import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { AppHeader } from '../../components/common/AppHeader';
import { AttendanceRecordCard } from '../../components/common/AttendanceRecordCard';
import { EmptyState } from '../../components/common/EmptyState';
import { THEME } from '../../constants/theme';

export const MyHistoryScreen: React.FC = () => {
  const { currentUser } = useAuth();
  const { getUserRecords, refreshRecords } = useAttendance();

  const myRecords = currentUser ? getUserRecords(currentUser.id) : [];

  return (
    <View style={styles.container}>
      <AppHeader
        title="My Attendance History"
        subtitle={`${myRecords.length} recorded entries`}
      />

      <FlatList
        data={myRecords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onRefresh={refreshRecords}
        refreshing={false}
        renderItem={({ item }) => (
          <AttendanceRecordCard
            record={item}
            user={currentUser ?? undefined}
            showUserInfo={false}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title="No Attendance History"
            description="You have not logged any check-ins yet. Check in on the Dashboard to start tracking your work hours."
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
  listContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 40,
  },
});
