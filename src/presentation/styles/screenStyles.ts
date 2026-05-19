import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from './tokens';

export const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  bodyText: {
    ...typography.jokeQuestion,
    color: colors.text,
    textAlign: 'center',
  },
  loadingIndicator: {
    color: colors.buttonPrimary,
  },
});
