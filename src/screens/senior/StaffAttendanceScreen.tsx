import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { AppHeader } from '../../components/common/AppHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { DateFilter } from '../../components/common/DateFilter';
import { AttendanceRecordCard } from '../../components/common/AttendanceRecordCard';
import { EmptyState } from '../../components/common/EmptyState';
import { THEME } from '../../constants/theme';
import { DateFilterOption } from '../../types';
import { isToday, isYesterday, isWithinPastDays } from '../../utils/dateUtils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SeniorStaffStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

export const StaffAttendanceScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<SeniorStaffStackParamList>>();
  const { usersMap } = useAuth();
  const { records, refreshRecords } = useAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');

  // Strict Senior Staff Security Invariant: Only staff records, NO admins and NO other senior staff
  const filteredRecords = records.filter((rec) => {
    const owner = usersMap.get(rec.userId);
    if (owner?.role !== 'staff') return false;

    // Search by staff name or email
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      const userName = owner?.name.toLowerCase() || '';
      const userEmail = owner?.email.toLowerCase() || '';
      if (!userName.includes(query) && !userEmail.includes(query)) {
        return false;
      }
    }

    // Date filter
    if (dateFilter === 'today' && !isToday(rec.date)) return false;
    if (dateFilter === 'yesterday' && !isYesterday(rec.date)) return false;
    if (dateFilter === 'past_7_days' && !isWithinPastDays(rec.date, 7)) return false;

    return true;
  });

  const hasActiveFilters = searchQuery.trim() !== '' || dateFilter !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setDateFilter('all');
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Staff Attendance Records"
        subtitle={`Showing ${filteredRecords.length} staff entries`}
      />

      <View style={styles.filterSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search staff by name or email..."
          onClear={() => setSearchQuery('')}
        />

        <DateFilter selected={dateFilter} onSelect={setDateFilter} />

        {hasActiveFilters ? (
          <TouchableOpacity style={styles.clearBar} onPress={clearAllFilters} activeOpacity={0.7}>
            <Ionicons name="filter-circle-outline" size={14} color={THEME.colors.primaryLight} />
            <Text style={styles.clearBarText}>Reset active filters</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={filteredRecords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onRefresh={refreshRecords}
        refreshing={false}
        renderItem={({ item }) => {
          const owner = usersMap.get(item.userId);
          return (
            <AttendanceRecordCard
              record={item}
              user={owner}
              showUserInfo={true}
              onPress={() => {
                navigation.navigate('StaffDetailHistory', { userId: item.userId });
              }}
            />
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No Staff Records Found"
            description={
              hasActiveFilters
                ? 'No staff members match the selected search or date criteria.'
                : 'No staff attendance records logged yet.'
            }
            actionLabel={hasActiveFilters ? 'Clear Filters' : undefined}
            onAction={hasActiveFilters ? clearAllFilters : undefined}
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
  filterSection: {
    backgroundColor: THEME.colors.card,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  clearBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    marginTop: 4,
  },
  clearBarText: {
    fontSize: 12,
    color: THEME.colors.primaryLight,
    fontWeight: '600',
    marginLeft: 4,
  },
  listContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 40,
  },
});
