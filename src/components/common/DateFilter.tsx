import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { DateFilterOption } from '../../types';
import { THEME } from '../../constants/theme';

interface Props {
  selected: DateFilterOption;
  onSelect: (option: DateFilterOption) => void;
}

const FILTER_ITEMS: { id: DateFilterOption; label: string }[] = [
  { id: 'all', label: 'All Dates' },
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'past_7_days', label: 'Past 7 Days' },
];

export const DateFilter: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTER_ITEMS.map((item) => {
          const isActive = selected === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => onSelect(item.id)}
              style={[
                styles.chip,
                isActive && styles.activeChip,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isActive && styles.activeChipText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
  },
  scrollContent: {
    paddingVertical: 4,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  activeChip: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.text.secondary,
  },
  activeChipText: {
    color: THEME.colors.text.inverse,
    fontWeight: '600',
  },
});
