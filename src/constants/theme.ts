export const THEME = {
  colors: {
    primary: '#1E3A8A', // Deep navy
    primaryLight: '#2563EB', // Royal blue
    primaryDark: '#0F172A', // Slate dark
    primaryGhost: '#EFF6FF', // Soft blue tint

    background: '#F8FAFC', // Crisp light background
    card: '#FFFFFF', // Card surface
    border: '#E2E8F0', // Card and separator border
    borderSubtle: '#F1F5F9',

    text: {
      primary: '#0F172A', // Dark slate header & body
      secondary: '#475569', // Muted text
      tertiary: '#94A3B8', // Placeholder / captions
      inverse: '#FFFFFF',
    },

    status: {
      completed: '#16A34A', // Green (checked_out)
      completedBg: '#DCFCE7',
      completedBorder: '#86EFAC',

      inProgress: '#D97706', // Amber (checked_in)
      inProgressBg: '#FEF3C7',
      inProgressBorder: '#FDE68A',

      notStarted: '#64748B', // Neutral grey (not_checked_in)
      notStartedBg: '#F1F5F9',
      notStartedBorder: '#CBD5E1',

      error: '#DC2626', // Red (validation / error)
      errorBg: '#FEE2E2',
      errorBorder: '#FCA5A5',
    },

    badge: {
      adminBg: '#EDE9FE',
      adminText: '#6D28D9',
      seniorBg: '#E0F2FE',
      seniorText: '#0369A1',
      staffBg: '#F1F5F9',
      staffText: '#334155',
    },
  },

  typography: {
    titleLarge: {
      fontSize: 22,
      fontWeight: '700' as const,
      lineHeight: 28,
    },
    titleMedium: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    titleSmall: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22,
    },
    bodyLarge: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
    label: {
      fontSize: 11,
      fontWeight: '600' as const,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
    full: 9999,
  },

  shadows: {
    sm: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};
