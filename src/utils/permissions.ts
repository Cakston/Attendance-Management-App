import { AttendanceRecord, User, UserRole } from '../types';

/**
 * Centralized Role-Based Access Control (RBAC) service.
 * Enforces security invariants at data-selection and navigation levels.
 */

export const canViewUserList = (role: UserRole): boolean => {
  return role === 'admin';
};

export const canViewAttendanceReports = (role: UserRole): boolean => {
  return role === 'admin' || role === 'senior_staff';
};

export const canViewEmployeeDetailHistory = (viewer: User, targetUser: User): boolean => {
  if (viewer.role === 'admin') return true;
  if (viewer.role === 'senior_staff') {
    // Senior Staff can view any Staff member's history, or their own
    return targetUser.role === 'staff' || targetUser.id === viewer.id;
  }
  // Staff can only view their own
  return viewer.id === targetUser.id;
};

export const canViewAttendanceRecord = (viewer: User, record: AttendanceRecord, recordOwner: User | undefined): boolean => {
  if (!recordOwner) return false;
  if (viewer.role === 'admin') return true;
  if (viewer.role === 'senior_staff') {
    // Senior staff can view staff records and their own records
    return recordOwner.role === 'staff' || recordOwner.id === viewer.id;
  }
  // Staff can only view their own records
  return recordOwner.id === viewer.id;
};

/**
 * Returns the list of users visible to currentUser.
 * - Admin: all users
 * - Senior Staff: staff members only (for oversight lists)
 * - Staff: only themselves
 */
export const getVisibleUsers = (currentUser: User, allUsers: User[]): User[] => {
  if (currentUser.role === 'admin') {
    return allUsers;
  }
  if (currentUser.role === 'senior_staff') {
    return allUsers.filter((u) => u.role === 'staff');
  }
  return allUsers.filter((u) => u.id === currentUser.id);
};

/**
 * Returns filtered attendance records strictly visible to currentUser.
 * - Admin: view all records
 * - Senior Staff: view Staff members' records ONLY (explicitly excludes Admin and other Senior Staff)
 * - Staff: view only their own records
 */
export const getVisibleAttendanceRecords = (
  currentUser: User,
  records: AttendanceRecord[],
  usersMap: Map<string, User>
): AttendanceRecord[] => {
  if (currentUser.role === 'admin') {
    return records;
  }

  if (currentUser.role === 'senior_staff') {
    return records.filter((rec) => {
      const owner = usersMap.get(rec.userId);
      // Senior staff team view must only see staff records
      return owner?.role === 'staff';
    });
  }

  // Staff role: strictly their own
  return records.filter((rec) => rec.userId === currentUser.id);
};
