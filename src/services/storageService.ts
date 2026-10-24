import AsyncStorage from '@react-native-async-storage/async-storage';
import { AttendanceRecord, User } from '../types';
import { getInitialAttendanceRecords } from '../data/attendance';

const SESSION_KEY = '@attendance_session';
const RECORDS_KEY = '@attendance_records';

// Legacy ID migration map
const LEGACY_ID_MAP: Record<string, string> = {
  usr_adm_001: 'ADM-001',
  usr_adm_002: 'ADM-002',
  usr_snr_001: 'SNR-001',
  usr_snr_002: 'SNR-002',
  usr_stf_001: 'STF-001',
  usr_stf_002: 'STF-002',
  usr_stf_003: 'STF-003',
  usr_stf_004: 'STF-004',
};

// In-memory fallback for test runners / non-native environments
const memoryStore = new Map<string, string>();

const getItem = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return memoryStore.get(key) ?? null;
  }
};

const setItem = async (key: string, value: string): Promise<void> => {
  memoryStore.set(key, value);
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    // Uses memoryStore in headless Node environments
  }
};

const removeItem = async (key: string): Promise<void> => {
  memoryStore.delete(key);
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Uses memoryStore in headless Node environments
  }
};

/**
 * Storage service for local session and attendance persistence using AsyncStorage.
 */
export const storageService = {
  // Save active user session
  async saveSession(user: User): Promise<void> {
    await setItem(SESSION_KEY, JSON.stringify(user));
  },

  // Read saved session (auto-migrating legacy IDs if present)
  async getSession(): Promise<User | null> {
    const data = await getItem(SESSION_KEY);
    if (!data) return null;
    try {
      const user = JSON.parse(data) as User;
      if (user?.id && LEGACY_ID_MAP[user.id]) {
        user.id = LEGACY_ID_MAP[user.id];
        await setItem(SESSION_KEY, JSON.stringify(user));
      }
      return user;
    } catch {
      return null;
    }
  },

  // Clear session on logout
  async clearSession(): Promise<void> {
    await removeItem(SESSION_KEY);
  },

  // Read attendance records (auto-migrating legacy IDs or seeding initial records)
  async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    const data = await getItem(RECORDS_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasLegacy = parsed.some((r: any) => typeof r.userId === 'string' && r.userId.startsWith('usr_'));
          if (!hasLegacy) {
            return parsed as AttendanceRecord[];
          }
          const migrated = parsed.map((r: any) => ({
            ...r,
            userId: LEGACY_ID_MAP[r.userId] || r.userId,
          }));
          await setItem(RECORDS_KEY, JSON.stringify(migrated));
          return migrated;
        }
      } catch {
        // Fall back to seed records below
      }
    }
    const initial = getInitialAttendanceRecords();
    await setItem(RECORDS_KEY, JSON.stringify(initial));
    return initial;
  },

  // Save updated records
  async saveAttendanceRecords(records: AttendanceRecord[]): Promise<void> {
    await setItem(RECORDS_KEY, JSON.stringify(records));
  },
};
