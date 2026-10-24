import { User } from '../types';
import { Ionicons } from '@expo/vector-icons';

/**
 * Predefined dummy accounts for company assessment.
 * Role credentials:
 * - Admin: admin@test.com / Admin@123
 * - Senior Staff: senior@test.com / Senior@123
 * - Staff: staff@test.com / Staff@123
 */
export const DUMMY_USERS: User[] = [
  // Admin accounts
  {
    id: 'ADM-001',
    name: 'Sarah Jenkins',
    email: 'admin@test.com',
    password: 'Admin@123',
    role: 'admin',
    department: 'Operations',
    position: 'Operations Director',
  },
  {
    id: 'ADM-002',
    name: 'David Miller',
    email: 'david.miller@test.com',
    password: 'Admin@123',
    role: 'admin',
    department: 'People Operations',
    position: 'HR Administrator',
  },

  // Senior Staff accounts
  {
    id: 'SNR-001',
    name: 'Rachel Torres',
    email: 'senior@test.com',
    password: 'Senior@123',
    role: 'senior_staff',
    department: 'Engineering',
    position: 'Engineering Team Lead',
  },
  {
    id: 'SNR-002',
    name: 'Marcus Vance',
    email: 'marcus.vance@test.com',
    password: 'Senior@123',
    role: 'senior_staff',
    department: 'Product',
    position: 'Senior Technical Lead',
  },

  // Staff accounts
  {
    id: 'STF-001',
    name: 'Alex Carter',
    email: 'staff@test.com',
    password: 'Staff@123',
    role: 'staff',
    department: 'Engineering',
    position: 'Full Stack Engineer',
  },
  {
    id: 'STF-002',
    name: 'Elena Rostova',
    email: 'elena.rostova@test.com',
    password: 'Staff@123',
    role: 'staff',
    department: 'Design',
    position: 'UI/UX Designer',
  },
  {
    id: 'STF-003',
    name: 'Liam Patel',
    email: 'liam.patel@test.com',
    password: 'Staff@123',
    role: 'staff',
    department: 'Quality Assurance',
    position: 'QA Automation Engineer',
  },
  {
    id: 'STF-004',
    name: 'Sophia Chen',
    email: 'sophia.chen@test.com',
    password: 'Staff@123',
    role: 'staff',
    department: 'Engineering',
    position: 'Associate Mobile Developer',
  },
];

export interface DemoPreset {
  roleLabel: string;
  shortLabel: string;
  email: string;
  password: string;
  role: 'admin' | 'senior_staff' | 'staff';
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// Quick demo login accounts
export const DEMO_PRESETS: DemoPreset[] = [
  {
    roleLabel: 'Staff',
    shortLabel: 'Staff',
    icon: 'person-outline',
    email: 'staff@test.com',
    password: 'Staff@123',
    role: 'staff',
    name: 'Alex Carter',
    description: 'Personal check-in/out & own history',
  },
  {
    roleLabel: 'Senior Staff',
    shortLabel: 'Senior',
    icon: 'shield-outline',
    email: 'senior@test.com',
    password: 'Senior@123',
    role: 'senior_staff',
    name: 'Rachel Torres',
    description: 'Staff-only oversight & personal check-in',
  },
  {
    roleLabel: 'Admin',
    shortLabel: 'Admin',
    icon: 'key-outline',
    email: 'admin@test.com',
    password: 'Admin@123',
    role: 'admin',
    name: 'Sarah Jenkins',
    description: 'Full visibility, user management & team reports',
  },
];
