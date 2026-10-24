import React, { createContext, useContext, useEffect, useState } from 'react';
import { AttendanceRecord, AttendanceSummaryStats, StaffSummaryStats } from '../types';
import { attendanceService } from '../services/attendanceService';
import { useAuth } from './AuthContext';
import { getLocalDateString } from '../utils/dateUtils';

interface AttendanceContextType {
  records: AttendanceRecord[];
  isLoading: boolean;
  checkIn: (userId: string) => Promise<{ success: boolean; errorMessage?: string }>;
  checkOut: (userId: string) => Promise<{ success: boolean; errorMessage?: string }>;
  getTodayRecord: (userId: string) => AttendanceRecord | undefined;
  getUserRecords: (userId: string) => AttendanceRecord[];
  adminStats: AttendanceSummaryStats;
  seniorStaffStats: StaffSummaryStats;
  refreshRecords: () => Promise<void>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { allUsers } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load persisted attendance records from AsyncStorage
  const loadRecords = async () => {
    try {
      const data = await attendanceService.getAllRecords();
      setRecords(data);
    } catch (err) {
      console.error('Failed to load records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // Check In handler
  const checkIn = async (userId: string) => {
    const res = await attendanceService.checkIn(userId);
    if (res.success && res.record) {
      // Update local state immediately so UI refreshes without manual reload
      setRecords((prev) => {
        const withoutOld = prev.filter((r) => r.id !== res.record!.id);
        return [res.record!, ...withoutOld];
      });
      return { success: true };
    }
    return { success: false, errorMessage: res.errorMessage };
  };

  // Check Out handler
  const checkOut = async (userId: string) => {
    const res = await attendanceService.checkOut(userId);
    if (res.success && res.record) {
      setRecords((prev) =>
        prev.map((r) => (r.id === res.record!.id ? res.record! : r))
      );
      return { success: true };
    }
    return { success: false, errorMessage: res.errorMessage };
  };

  // Get user record for today
  const getTodayRecord = (userId: string): AttendanceRecord | undefined => {
    const today = getLocalDateString();
    return records.find((r) => r.userId === userId && r.date === today);
  };

  // Get historical records for a user (latest first)
  const getUserRecords = (userId: string): AttendanceRecord[] => {
    return records
      .filter((r) => r.userId === userId)
      .sort((a, b) => b.date.localeCompare(a.date));
  };

  // Dynamic dashboard stats computed directly from state
  const staffUsers = allUsers.filter((u) => u.role === 'staff');
  const adminStats = attendanceService.calculateAdminStats(allUsers, records);
  const seniorStaffStats = attendanceService.calculateSeniorStaffStats(staffUsers, records);

  return (
    <AttendanceContext.Provider
      value={{
        records,
        isLoading,
        checkIn,
        checkOut,
        getTodayRecord,
        getUserRecords,
        adminStats,
        seniorStaffStats,
        refreshRecords: loadRecords,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = (): AttendanceContextType => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
