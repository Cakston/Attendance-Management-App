export type UserRole = 'admin' | 'senior_staff' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department?: string;
  position?: string;
}

export type AttendanceStatus = 'not_checked_in' | 'checked_in' | 'checked_out';

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD (local calendar day)
  checkInTime: string | null; // ISO 8601 string or null
  checkOutTime: string | null; // ISO 8601 string or null
  status: AttendanceStatus;
}

export interface AttendanceSummaryStats {
  totalEmployees: number;
  totalStaff: number;
  totalSeniorStaff: number;
  checkedInToday: number;
  notCheckedInToday: number;
}

export interface StaffSummaryStats {
  totalStaff: number;
  staffCheckedInToday: number;
  staffNotCheckedInToday: number;
}

export type DateFilterOption = 'all' | 'today' | 'yesterday' | 'past_7_days';
