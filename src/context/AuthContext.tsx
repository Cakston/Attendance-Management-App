import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  allUsers: User[];
  usersMap: Map<string, User>;
  login: (email: string, password: string) => Promise<{ success: boolean; errorMessage?: string }>;
  logout: () => Promise<void>;
  resetAllData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const allUsers = authService.getAllUsers();
  const usersMap = new Map<string, User>(allUsers.map((u) => [u.id, u]));

  // Restore saved login session on app launch
  useEffect(() => {
    const initAuth = async () => {
      try {
        await storageService.ensureInitialized();
        const savedUser = await authService.restoreSession();
        if (savedUser) {
          const matched = allUsers.find((u) => u.id === savedUser.id) || savedUser;
          setCurrentUser(matched);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      return { success: true };
    }
    return { success: false, errorMessage: res.errorMessage };
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const resetAllData = async () => {
    await storageService.resetAllData();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        allUsers,
        usersMap,
        login,
        logout,
        resetAllData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
