import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { AppHeader } from '../../components/common/AppHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { RoleBadge } from '../../components/common/RoleBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { THEME } from '../../constants/theme';
import { canViewUserList } from '../../utils/permissions';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

export const UserManagementScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const { currentUser, allUsers } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Strict RBAC check
  if (!currentUser || !canViewUserList(currentUser.role)) {
    return (
      <View style={styles.container}>
        <AppHeader title="Access Denied" />
        <EmptyState
          icon="shield-outline"
          title="Unauthorized Access"
          description="Only administrators with elevated security clearance can access the User Directory."
        />
      </View>
    );
  }

  const filteredUsers = !searchQuery.trim()
    ? allUsers
    : allUsers.filter((u) => {
        const query = searchQuery.trim().toLowerCase();
        return (
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.role.toLowerCase().includes(query) ||
          (u.department && u.department.toLowerCase().includes(query))
        );
      });

  return (
    <View style={styles.container}>
      <AppHeader
        title="Employee Directory"
        subtitle={`Total registered accounts: ${allUsers.length}`}
      />

      <View style={styles.searchHeader}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, email, department..."
          onClear={() => setSearchQuery('')}
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.userCard}
            onPress={() => {
              navigation.navigate('EmployeeDetailHistory', { userId: item.id });
            }}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
              </Text>
            </View>

            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <RoleBadge role={item.role} size="sm" />
              </View>
              <Text style={styles.email} numberOfLines={1}>
                {item.email}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.department}>
                  {item.position || item.department || 'General Staff'}
                </Text>
                <Text style={styles.userIdText}>ID: {item.id}</Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color={THEME.colors.text.tertiary} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="No Employees Found"
            description="No employee records matched your search query."
            actionLabel="Reset Search"
            onAction={() => setSearchQuery('')}
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
  searchHeader: {
    backgroundColor: THEME.colors.card,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  listContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.md,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  userInfo: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  email: {
    fontSize: 13,
    color: THEME.colors.text.secondary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  department: {
    fontSize: 11,
    color: THEME.colors.text.tertiary,
    fontWeight: '500',
  },
  userIdText: {
    fontSize: 10,
    color: THEME.colors.text.tertiary,
    fontFamily: 'monospace',
  },
});
