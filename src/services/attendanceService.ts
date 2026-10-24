import { AttendanceRecord, AttendanceSummaryStats, StaffSummaryStats, User } from '../types';
import { getLocalDateString } from '../utils/dateUtils';
import { storageService } from './storageService';

export interface AttendanceMutationResult {
  success: boolean;
  record?: AttendanceRecord;
  errorMessage?: string;
}

/**
 * Core attendance logic and invariants:
 * - One record per user per local calendar day (YYYY-MM-DD)
 * - Prevents duplicate check-ins
 * - Prevents check-out before check-in
 * - Prevents duplicate check-outs
 */
export const attendanceService = {
  // Load all records from local storage
  async getAllRecords(): Promise<AttendanceRecord[]> {
    return storageService.getAttendanceRecords();
  },

  // Find today's attendance record for a user
  getTodayRecordForUser(
    records: AttendanceRecord[],
    userId: string,
    targetDate: string = getLocalDateString()
  ): AttendanceRecord | undefined {
    return records.find((rec) => rec.userId === userId && rec.date === targetDate);
  },

  // Check In for today
  async checkIn(userId: string): Promise<AttendanceMutationResult> {
    const today = getLocalDateString();
    const records = await storageService.getAttendanceRecords();

    // Invariant: check for existing record today
    const existing = records.find((r) => r.userId === userId && r.date === today);

    if (existing) {
      if (existing.status === 'checked_in') {
        return { success: false, errorMessage: 'You have already checked in for today.' };
      }
      if (existing.status === 'checked_out') {
        return {
          success: false,
          errorMessage: 'You have already checked out for today. Multiple check-ins per day are not permitted.',
        };
      }
    }

    const nowIso = new Date().toISOString();
    const newRecord: AttendanceRecord = {
      id: existing?.id || `rec_${userId}_${today}_${Date.now()}`,
      userId,
      date: today,
      checkInTime: nowIso,
      checkOutTime: null,
      status: 'checked_in',
    };

    // Replace if updating, or prepend latest record
    const updatedRecords = existing
      ? records.map((r) => (r.id === existing.id ? newRecord : r))
      : [newRecord, ...records];

    await storageService.saveAttendanceRecords(updatedRecords);

    return { success: true, record: newRecord };
  },

  // Check Out for today
  async checkOut(userId: string): Promise<AttendanceMutationResult> {
    const today = getLocalDateString();
    const records = await storageService.getAttendanceRecords();

    const existing = records.find((r) => r.userId === userId && r.date === today);

    // Invariant: cannot check out before checking in
    if (!existing || existing.status === 'not_checked_in' || !existing.checkInTime) {
      return {
        success: false,
        errorMessage: 'Cannot check out before checking in. Please check in first.',
      };
    }

    // Invariant: cannot check out twice
    if (existing.status === 'checked_out' && existing.checkOutTime) {
      return {
        success: false,
        errorMessage: 'You have already checked out for today. Duplicate checkout is not permitted.',
      };
    }

    const nowIso = new Date().toISOString();
    const updatedRecord: AttendanceRecord = {
      ...existing,
      checkOutTime: nowIso,
      status: 'checked_out',
    };

    const updatedRecords = records.map((r) => (r.id === existing.id ? updatedRecord : r));
    await storageService.saveAttendanceRecords(updatedRecords);

    return { success: true, record: updatedRecord };
  },

  // Dynamic statistics calculation for Admin Dashboard
  calculateAdminStats(
    allUsers: User[],
    records: AttendanceRecord[],
    todayDate: string = getLocalDateString()
  ): AttendanceSummaryStats {
    const totalEmployees = allUsers.length;
    const totalStaff = allUsers.filter((u) => u.role === 'staff').length;
    const totalSeniorStaff = allUsers.filter((u) => u.role === 'senior_staff').length;

    // Users with an active or completed shift today
    const checkedInUserIds = new Set(
      records
        .filter((r) => r.date === todayDate && (r.status === 'checked_in' || r.status === 'checked_out'))
        .map((r) => r.userId)
    );

    const checkedInToday = allUsers.filter((u) => checkedInUserIds.has(u.id)).length;
    const notCheckedInToday = Math.max(0, totalEmployees - checkedInToday);

    return {
      totalEmployees,
      totalStaff,
      totalSeniorStaff,
      checkedInToday,
      notCheckedInToday,
    };
  },

  // Dynamic statistics calculation for Senior Staff Dashboard (Staff only)
  calculateSeniorStaffStats(
    staffUsers: User[],
    records: AttendanceRecord[],
    todayDate: string = getLocalDateString()
  ): StaffSummaryStats {
    const totalStaff = staffUsers.length;
    const staffIds = new Set(staffUsers.map((u) => u.id));

    const staffCheckedInIds = new Set(
      records
        .filter(
          (r) =>
            r.date === todayDate &&
            staffIds.has(r.userId) &&
            (r.status === 'checked_in' || r.status === 'checked_out')
        )
        .map((r) => r.userId)
    );

    const staffCheckedInToday = staffCheckedInIds.size;
    const staffNotCheckedInToday = Math.max(0, totalStaff - staffCheckedInToday);

    return {
      totalStaff,
      staffCheckedInToday,
      staffNotCheckedInToday,
    };
  },
};
