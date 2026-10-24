import { DUMMY_USERS } from '../data/users';
import { User } from '../types';
import { storageService } from './storageService';

export interface LoginResult {
  success: boolean;
  user?: User;
  errorMessage?: string;
}

/**
 * Authentication service using predefined dummy credentials.
 */
export const authService = {
  // Validate email & password and create local session
  async login(emailInput: string, passwordInput: string): Promise<LoginResult> {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!email) {
      return { success: false, errorMessage: 'Please enter your email address.' };
    }
    if (!password) {
      return { success: false, errorMessage: 'Please enter your password.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, errorMessage: 'Please enter a valid email address.' };
    }

    // Match against predefined dummy accounts
    const match = DUMMY_USERS.find(
      (u) => u.email.toLowerCase() === email && u.password === password
    );

    if (!match) {
      return {
        success: false,
        errorMessage: 'Invalid credentials. Please verify your email and password.',
      };
    }

    // Exclude password before storing session
    const { password: _, ...safeUser } = match;
    await storageService.saveSession(safeUser);

    return { success: true, user: safeUser };
  },

  // Restore saved session on app startup
  async restoreSession(): Promise<User | null> {
    return storageService.getSession();
  },

  // Clear session on logout
  async logout(): Promise<void> {
    await storageService.clearSession();
  },

  // Return all users (without passwords)
  getAllUsers(): User[] {
    return DUMMY_USERS.map(({ password: _, ...user }) => user);
  },

  // Find user by ID
  getUserById(id: string): User | undefined {
    const found = DUMMY_USERS.find((u) => u.id === id);
    if (!found) return undefined;
    const { password: _, ...user } = found;
    return user;
  },
};
