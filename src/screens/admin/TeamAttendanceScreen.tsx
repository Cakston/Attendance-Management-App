import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { AppHeader } from '../../components/common/AppHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { DateFilter } from '../../components/common/DateFilter';
import { AttendanceRecordCard } from '../../components/common/AttendanceRecordCard';
import { EmptyState } from '../../components/common/EmptyState';
import { THEME } from '../../constants/theme';
import { DateFilterOption, UserRole } from '../../types';
import { isToday, isYesterday, isWithinPastDays } from '../../utils/dateUtils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type RoleFilterOption = 'all' | UserRole;

export const TeamAttendanceScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const { usersMap } = useAuth();
  const { records, refreshRecords } = useAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilterOption>('all');

  const filteredRecords = records.filter((rec) => {
    const owner = usersMap.get(rec.userId);

    // Filter by name or email keyword
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      const userName = owner?.name.toLowerCase() || '';
      const userEmail = owner?.email.toLowerCase() || '';
      if (!userName.includes(query) && !userEmail.includes(query)) {
        return false;
      }
    }

    // Filter by role
    if (roleFilter !== 'all' && owner?.role !== roleFilter) {
      return false;
    }

    // Filter by date option
    if (dateFilter === 'today' && !isToday(rec.date)) return false;
    if (dateFilter === 'yesterday' && !isYesterday(rec.date)) return false;
    if (dateFilter === 'past_7_days' && !isWithinPastDays(rec.date, 7)) return false;

    return true;
  });

  const hasActiveFilters = searchQuery.trim() !== '' || dateFilter !== 'all' || roleFilter !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setDateFilter('all');
    setRoleFilter('all');
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Team Attendance Records"
        subtitle={`Total records: ${filteredRecords.length} / ${records.length}`}
      />

      <View style={styles.filterSection}>
        {/* Search Input */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by employee name..."
          onClear={() => setSearchQuery('')}
        />

        {/* Date Filter Chips */}
        <DateFilter selected={dateFilter} onSelect={setDateFilter} />

        {/* Admin Role Filter Row */}
        <View style={styles.roleFilterRow}>
          <Text style={styles.filterLabel}>Role:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roleChips}>
            {(['all', 'admin', 'senior_staff', 'staff'] as RoleFilterOption[]).map((r) => {
              const isSelected = roleFilter === r;
              const labels: Record<RoleFilterOption, string> = {
                all: 'All Roles',
                admin: 'Admin',
                senior_staff: 'Senior Staff',
                staff: 'Staff',
              };
              return (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRoleFilter(r)}
                  style={[styles.roleChip, isSelected && styles.roleChipActive]}
                >
                  <Text style={[styles.roleChipText, isSelected && styles.roleChipTextActive]}>
                    {labels[r]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Clear Filters Button if any filter active */}
        {hasActiveFilters ? (
          <TouchableOpacity style={styles.clearBar} onPress={clearAllFilters} activeOpacity={0.7}>
            <Ionicons name="filter-circle-outline" size={14} color={THEME.colors.primaryLight} />
            <Text style={styles.clearBarText}>Reset all active filters</Text>
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
                navigation.navigate('EmployeeDetailHistory', { userId: item.userId });
              }}
            />
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No Attendance Records Found"
            description={
              hasActiveFilters
                ? 'Try adjusting or resetting your search keywords, role, or date filters.'
                : 'No records exist in the system yet.'
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
  roleFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.text.secondary,
    marginRight: 8,
  },
  roleChips: {
    flexDirection: 'row',
    gap: 6,
  },
  roleChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  roleChipActive: {
    backgroundColor: THEME.colors.primaryLight,
    borderColor: THEME.colors.primaryLight,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.text.secondary,
  },
  roleChipTextActive: {
    color: THEME.colors.text.inverse,
    fontWeight: '700',
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
