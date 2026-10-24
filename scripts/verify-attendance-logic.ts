import { DUMMY_USERS } from '../src/data/users';
import { canViewUserList, canViewEmployeeDetailHistory, getVisibleAttendanceRecords, getVisibleUsers } from '../src/utils/permissions';
import { attendanceService } from '../src/services/attendanceService';
import { authService } from '../src/services/authService';
import { getLocalDateString } from '../src/utils/dateUtils';
import { AttendanceRecord, User } from '../src/types';

async function runTests() {
  console.log('--- STARTING VERIFICATION TEST SUITE ---');
  let failures = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`✅ PASS: ${msg}`);
    } else {
      console.error(`❌ FAIL: ${msg}`);
      failures++;
    }
  }

  // 1. Predefined Credentials Verification
  const adminLogin = await authService.login('admin@test.com', 'Admin@123');
  assert(adminLogin.success && adminLogin.user?.role === 'admin', 'Admin login succeeds with Admin@123');

  const seniorLogin = await authService.login('senior@test.com', 'Senior@123');
  assert(seniorLogin.success && seniorLogin.user?.role === 'senior_staff', 'Senior Staff login succeeds with Senior@123');

  const staffLogin = await authService.login('staff@test.com', 'Staff@123');
  assert(staffLogin.success && staffLogin.user?.role === 'staff', 'Staff login succeeds with Staff@123');

  const invalidLogin = await authService.login('staff@test.com', 'WrongPass');
  assert(!invalidLogin.success, 'Invalid credentials rejected');

  const emptyLogin = await authService.login('', '');
  assert(!emptyLogin.success, 'Empty fields rejected');

  // 2. RBAC Permissions Verification
  const adminUser = adminLogin.user!;
  const seniorUser = seniorLogin.user!;
  const staffUser = staffLogin.user!;

  assert(canViewUserList(adminUser.role) === true, 'Admin can view user list');
  assert(canViewUserList(seniorUser.role) === false, 'Senior Staff CANNOT view user list');
  assert(canViewUserList(staffUser.role) === false, 'Staff CANNOT view user list');

  assert(canViewEmployeeDetailHistory(adminUser, staffUser) === true, 'Admin can view Staff history');
  assert(canViewEmployeeDetailHistory(adminUser, seniorUser) === true, 'Admin can view Senior Staff history');
  assert(canViewEmployeeDetailHistory(seniorUser, staffUser) === true, 'Senior Staff can view Staff history');
  assert(canViewEmployeeDetailHistory(seniorUser, adminUser) === false, 'Senior Staff CANNOT view Admin history');
  assert(canViewEmployeeDetailHistory(staffUser, seniorUser) === false, 'Staff CANNOT view Senior Staff history');

  // Test visible records filtering
  const usersMap = new Map<string, User>();
  DUMMY_USERS.forEach((u) => usersMap.set(u.id, u));

  const sampleRecords: AttendanceRecord[] = [
    { id: '1', userId: adminUser.id, date: '2026-10-23', checkInTime: '2026-10-23T08:00:00Z', checkOutTime: null, status: 'checked_in' },
    { id: '2', userId: seniorUser.id, date: '2026-10-23', checkInTime: '2026-10-23T08:30:00Z', checkOutTime: null, status: 'checked_in' },
    { id: '3', userId: staffUser.id, date: '2026-10-23', checkInTime: '2026-10-23T09:00:00Z', checkOutTime: null, status: 'checked_in' },
  ];

  const adminVisible = getVisibleAttendanceRecords(adminUser, sampleRecords, usersMap);
  assert(adminVisible.length === 3, 'Admin sees all 3 records (Admin, Senior, Staff)');

  const seniorVisible = getVisibleAttendanceRecords(seniorUser, sampleRecords, usersMap);
  assert(seniorVisible.length === 1 && seniorVisible[0].userId === staffUser.id, 'Senior Staff ONLY sees Staff records (Admin and other Senior excluded)');

  const staffVisible = getVisibleAttendanceRecords(staffUser, sampleRecords, usersMap);
  assert(staffVisible.length === 1 && staffVisible[0].userId === staffUser.id, 'Staff ONLY sees their own records');

  // 3. Dynamic Stats Calculation
  const adminStats = attendanceService.calculateAdminStats(DUMMY_USERS, sampleRecords, '2026-10-23');
  assert(adminStats.totalEmployees === DUMMY_USERS.length, `Admin total employees matches repository (${DUMMY_USERS.length})`);
  assert(adminStats.checkedInToday === 3, 'Admin checkedInToday calculates 3 checked in users');

  const staffUsers = DUMMY_USERS.filter((u) => u.role === 'staff');
  const seniorStats = attendanceService.calculateSeniorStaffStats(staffUsers, sampleRecords, '2026-10-23');
  assert(seniorStats.totalStaff === staffUsers.length, `Senior total staff matches staff repository (${staffUsers.length})`);
  assert(seniorStats.staffCheckedInToday === 1, 'Senior staffCheckedInToday calculates 1 checked in staff member');

  // 4. Attendance Mutation Invariants
  const testUserId = 'STF-001'; // Alex Carter (starts with no today record in seed)

  // Invariant: Cannot check out before checking in
  const earlyCheckOut = await attendanceService.checkOut(testUserId);
  assert(!earlyCheckOut.success, 'Reject checkout when not checked in yet');

  // Invariant: Successful check-in
  const firstCheckIn = await attendanceService.checkIn(testUserId);
  assert(firstCheckIn.success && firstCheckIn.record?.status === 'checked_in', 'Successful check-in marks status as checked_in');

  // Invariant: Duplicate check-in rejected
  const duplicateCheckIn = await attendanceService.checkIn(testUserId);
  assert(!duplicateCheckIn.success, 'Duplicate check-in on same calendar day rejected');

  // Invariant: Successful check-out
  const firstCheckOut = await attendanceService.checkOut(testUserId);
  assert(firstCheckOut.success && firstCheckOut.record?.status === 'checked_out', 'Successful check-out marks status as checked_out');

  // Invariant: Duplicate check-out rejected
  const duplicateCheckOut = await attendanceService.checkOut(testUserId);
  assert(!duplicateCheckOut.success, 'Duplicate check-out on same calendar day rejected');

  console.log(`--- TEST SUITE COMPLETE. Total Failures: ${failures} ---`);
  if (failures > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
