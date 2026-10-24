import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserRole } from '../../types';
import { THEME } from '../../constants/theme';

interface Props {
  role: UserRole;
  size?: 'sm' | 'md';
}

export const RoleBadge: React.FC<Props> = ({ role, size = 'md' }) => {
  const getConfig = () => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          bgColor: THEME.colors.badge.adminBg,
          textColor: THEME.colors.badge.adminText,
        };
      case 'senior_staff':
        return {
          label: 'Senior Staff',
          bgColor: THEME.colors.badge.seniorBg,
          textColor: THEME.colors.badge.seniorText,
        };
      case 'staff':
      default:
        return {
          label: 'Staff',
          bgColor: THEME.colors.badge.staffBg,
          textColor: THEME.colors.badge.staffText,
        };
    }
  };

  const config = getConfig();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bgColor,
          paddingVertical: isSm ? 2 : 4,
          paddingHorizontal: isSm ? 6 : 8,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: config.textColor,
            fontSize: isSm ? 10 : 11,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: THEME.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
