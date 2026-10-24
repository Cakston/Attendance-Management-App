import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  bgTint?: string;
}

export const SummaryCard: React.FC<Props> = ({
  title,
  value,
  subtitle,
  icon,
  color = THEME.colors.primary,
  bgTint = THEME.colors.primaryGhost,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.iconContainer, { backgroundColor: bgTint }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.sm,
    flex: 1,
    minWidth: 140,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: THEME.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.colors.text.primary,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.text.secondary,
  },
  subtitle: {
    fontSize: 11,
    color: THEME.colors.text.tertiary,
    marginTop: 2,
  },
});
