import { AttendanceRecord } from '../types';
import { getLocalDateString, getYesterdayDateString } from '../utils/dateUtils';

/**
 * Generates initial seed attendance records.
 * Note: Alex Carter (STF-001) is not checked in today so the interviewer can test Check In immediately.
 */
export const getInitialAttendanceRecords = (): AttendanceRecord[] => {
  const today = getLocalDateString();
  const yesterday = getYesterdayDateString();

  const d2 = new Date();
  d2.setDate(d2.getDate() - 2);
  const twoDaysAgo = getLocalDateString(d2);

  const d3 = new Date();
  d3.setDate(d3.getDate() - 3);
  const threeDaysAgo = getLocalDateString(d3);

  return [
    // Today: Senior Staff 1 (Rachel Torres) - Checked in
    {
      id: `rec_snr1_${today}`,
      userId: 'SNR-001',
      date: today,
      checkInTime: `${today}T08:52:10.000Z`,
      checkOutTime: null,
      status: 'checked_in',
    },
    // Today: Staff 2 (Elena Rostova) - Completed shift
    {
      id: `rec_stf2_${today}`,
      userId: 'STF-002',
      date: today,
      checkInTime: `${today}T09:05:14.000Z`,
      checkOutTime: `${today}T17:15:22.000Z`,
      status: 'checked_out',
    },
    // Today: Staff 3 (Liam Patel) - Checked in
    {
      id: `rec_stf3_${today}`,
      userId: 'STF-003',
      date: today,
      checkInTime: `${today}T09:18:45.000Z`,
      checkOutTime: null,
      status: 'checked_in',
    },
    // Today: Staff 4 (Sophia Chen) - Completed shift
    {
      id: `rec_stf4_${today}`,
      userId: 'STF-004',
      date: today,
      checkInTime: `${today}T08:45:00.000Z`,
      checkOutTime: `${today}T16:50:30.000Z`,
      status: 'checked_out',
    },
    // Today: Admin (Sarah Jenkins) - Checked in
    {
      id: `rec_adm1_${today}`,
      userId: 'ADM-001',
      date: today,
      checkInTime: `${today}T08:30:00.000Z`,
      checkOutTime: null,
      status: 'checked_in',
    },

    // Yesterday Records (For testing date filters and historical views)
    {
      id: `rec_stf1_${yesterday}`,
      userId: 'STF-001',
      date: yesterday,
      checkInTime: `${yesterday}T09:02:11.000Z`,
      checkOutTime: `${yesterday}T17:34:09.000Z`,
      status: 'checked_out',
    },
    {
      id: `rec_stf2_${yesterday}`,
      userId: 'STF-002',
      date: yesterday,
      checkInTime: `${yesterday}T09:12:00.000Z`,
      checkOutTime: `${yesterday}T17:05:00.000Z`,
      status: 'checked_out',
    },
    {
      id: `rec_snr1_${yesterday}`,
      userId: 'SNR-001',
      date: yesterday,
      checkInTime: `${yesterday}T08:45:00.000Z`,
      checkOutTime: `${yesterday}T18:00:00.000Z`,
      status: 'checked_out',
    },
    {
      id: `rec_adm1_${yesterday}`,
      userId: 'ADM-001',
      date: yesterday,
      checkInTime: `${yesterday}T08:20:00.000Z`,
      checkOutTime: `${yesterday}T17:40:00.000Z`,
      status: 'checked_out',
    },

    // 2 & 3 Days Ago (Alex Carter's history)
    {
      id: `rec_stf1_${twoDaysAgo}`,
      userId: 'STF-001',
      date: twoDaysAgo,
      checkInTime: `${twoDaysAgo}T09:10:00.000Z`,
      checkOutTime: `${twoDaysAgo}T17:45:00.000Z`,
      status: 'checked_out',
    },
    {
      id: `rec_stf1_${threeDaysAgo}`,
      userId: 'STF-001',
      date: threeDaysAgo,
      checkInTime: `${threeDaysAgo}T08:55:00.000Z`,
      checkOutTime: `${threeDaysAgo}T17:15:00.000Z`,
      status: 'checked_out',
    },
  ];
};
