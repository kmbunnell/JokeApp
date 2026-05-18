export const colors = {
  background: '#FFFFFF',
  text: '#000000',
  buttonPrimary: '#007AFF',
  buttonSecondary: '#6C757D',
  buttonText: '#FFFFFF',
} as const;

export const spacing = {
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const typography = {
  jokeQuestion: { fontSize: 28, fontWeight: '700' as const, lineHeight: 38 },
  button: { fontSize: 17, fontWeight: '600' as const },
} as const;
