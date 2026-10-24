import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const LogoutConfirmationModal: React.FC<Props> = ({
  visible,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="log-out-outline" size={28} color={THEME.colors.status.error} />
          </View>
          <Text style={styles.title}>Sign Out</Text>
          <Text style={styles.description}>
            Are you sure you want to log out of your session? You will be redirected to the sign-in screen.
          </Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onCancel}
              disabled={isLoading}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <View style={styles.btnWrapper}>
              <PrimaryButton
                title="Log Out"
                variant="danger"
                onPress={onConfirm}
                isLoading={isLoading}
                size="md"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.xl,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    ...THEME.shadows.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.status.errorBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: THEME.spacing.xl,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: THEME.borderRadius.md,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.text.secondary,
  },
  btnWrapper: {
    flex: 1,
  },
});
