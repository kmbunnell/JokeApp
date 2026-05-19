import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../styles/tokens';

export const styles = StyleSheet.create({
  questionText: {
    ...typography.jokeQuestion,
    color: colors.text,
    textAlign: 'center',
  },
  buttonBar: {
    padding: spacing.md,
    gap: spacing.md,
  },
  button: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: colors.buttonSecondary,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    ...typography.button,
    color: colors.buttonText,
  },
});
