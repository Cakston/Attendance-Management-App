import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { THEME } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  style,
}) => {
  const getButtonStyles = (): { btn: ViewStyle; text: TextStyle; iconColor: string } => {
    switch (variant) {
      case 'secondary':
        return {
          btn: {
            backgroundColor: THEME.colors.primaryGhost,
            borderColor: THEME.colors.primaryLight,
          },
          text: { color: THEME.colors.primaryLight },
          iconColor: THEME.colors.primaryLight,
        };
      case 'outline':
        return {
          btn: {
            backgroundColor: 'transparent',
            borderColor: THEME.colors.border,
          },
          text: { color: THEME.colors.text.secondary },
          iconColor: THEME.colors.text.secondary,
        };
      case 'danger':
        return {
          btn: {
            backgroundColor: THEME.colors.status.error,
            borderColor: THEME.colors.status.error,
          },
          text: { color: THEME.colors.text.inverse },
          iconColor: THEME.colors.text.inverse,
        };
      case 'primary':
      default:
        return {
          btn: {
            backgroundColor: THEME.colors.primary,
            borderColor: THEME.colors.primary,
          },
          text: { color: THEME.colors.text.inverse },
          iconColor: THEME.colors.text.inverse,
        };
    }
  };

  const { btn, text, iconColor } = getButtonStyles();
  const isLg = size === 'lg';
  const isDisabled = disabled || isLoading;
  const flatStyle = StyleSheet.flatten(style);
  const hasCustomHeight = flatStyle?.height !== undefined || flatStyle?.minHeight !== undefined;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        btn,
        {
          minHeight: isLg ? 52 : 44,
          paddingVertical: hasCustomHeight ? 6 : (isLg ? 14 : 10),
          paddingHorizontal: isLg ? 20 : 16,
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={text.color} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon ? (
            <Ionicons
              name={icon}
              size={isLg ? 20 : 18}
              color={iconColor}
              style={styles.icon}
            />
          ) : null}
          <Text
            numberOfLines={1}
            style={[
              styles.textBase,
              text,
              { fontSize: isLg ? 15 : 14 },
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  textBase: {
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
});
