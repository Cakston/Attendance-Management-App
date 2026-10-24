# Attendance Management App

A mobile attendance app built with React Native, Expo, TypeScript, and AsyncStorage.

## Features

- Three roles: Admin, Senior Staff, and Staff.
- Check-in and check-out.
- View attendance history.
- Search and filter attendance records.
- Role-based access permissions.
- Local data storage without a backend.
- Sample attendance data for testing.

## Requirements

- Node.js 18 or higher
- npm
- Android Studio or Expo Go

## Installation

1. Open the project folder.

```bash
cd "Attendance Management App"
```

2. Install dependencies.

```bash
npm install
```

3. Start the application.

```bash
npx expo start
```

4. Open the app using Expo Go or an Android emulator.

## Available Commands

| Command | Purpose |
|---|---|
| `npm start` | Start the Expo server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS (macOS required) |
| `npm run web` | Run in a web browser |
| `npm run type-check` | Check TypeScript errors |
| `npm run test:logic` | Run business logic tests |

## Project Structure

```text
attendance-management-app/
├── assets/                 # App icons, splash screens, and images
├── scripts/                # Automated verification scripts (verify-attendance-logic.ts)
├── src/
│   ├── components/
│   │   └── common/         # 13 Reusable UI components (buttons, badges, inputs, modals)
│   ├── constants/          # Theme tokens (colors, typography, spacing, shadows)
│   ├── context/            # React Context state (AuthContext, AttendanceContext)
│   ├── data/               # Predefined dummy users and seed attendance logs
│   ├── navigation/         # Role-based navigators (Root, Auth, Admin, SeniorStaff, Staff)
│   ├── screens/
│   │   ├── admin/          # AdminDashboard, TeamAttendance, UserManagement, History
│   │   ├── senior/         # SeniorStaffDashboard, StaffAttendance, History
│   │   ├── staff/          # StaffDashboard, MyHistory
│   │   ├── auth/           # LoginScreen with 1-tap quick role pills
│   │   └── common/         # ProfileScreen & Account settings
│   ├── services/           # authService, attendanceService, storageService
│   ├── types/              # TypeScript interfaces and navigation param lists
│   └── utils/              # dateUtils, RBAC permissions, Android backHandler
├── App.tsx                 # Application root entry point with context providers
├── app.json                # Expo project configuration
├── package.json            # Dependencies and npm scripts
└── tsconfig.json           # TypeScript compiler configuration
```


## Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@test.com` | `Admin@123` |
| Senior Staff | `senior@test.com` | `Senior@123` |
| Staff | `staff@test.com` | `Staff@123` |

You can also use the quick role selection buttons on the login screen.

## Testing the Three Roles

### 1. Admin

1. Log in using the Admin account.
2. Check the dashboard and company attendance statistics.
3. Open the Attendance screen to view all employees' records.
4. Test role filters, date filters, and search.
5. Open the Employees screen to view employee details and attendance history.
6. Test personal check-in and check-out.

**Expected result:** Admin can view attendance records for all three roles.

### 2. Senior Staff

1. Log in using the Senior Staff account.
2. Check the dashboard and personal attendance options.
3. Open Staff Attendance.
4. Test search and date filters.
5. Open a Staff member's attendance history.
6. Check My History.

**Expected result:** Senior Staff can view Staff records only, not Admin or other Senior Staff records.

### 3. Staff

1. Log in using the Staff account.
2. Check in and verify the updated status.
3. Check out and verify shift completion.
4. Open My History to view attendance records.
5. Check that Team Attendance and Employee Directory are unavailable.

**Expected result:** Staff can access only their own attendance information.

## Validation Tests

Verify that the app:

- Prevents duplicate check-ins.
- Prevents check-out before check-in.
- Prevents multiple check-ins in one day.
- Rejects invalid login credentials.
- Blocks unauthorized access to attendance records.
- Saves attendance data locally.

Run the automated tests:

```bash
npm run test:logic
```

## Technology Stack

- React Native
- Expo
- TypeScript
- AsyncStorage
- React Navigation

**Note:** This application uses local storage and does not require a backend server.