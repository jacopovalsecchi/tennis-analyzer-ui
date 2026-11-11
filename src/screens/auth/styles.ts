import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F1F4F8',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#15283F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '400',
    color: '#556678',
    marginBottom: 20,
  },
  field: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D5DEE8',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#6D7C8E',
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    padding: 0,
    color: '#15283F',
  },
  primaryButton: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#3A6B9C',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  notice: {
    marginTop: 12,
    textAlign: 'center',
    color: '#556678',
    fontSize: 14,
    lineHeight: 21,
  },
  error: {
    marginTop: 12,
    textAlign: 'center',
    color: '#9C3D32',
    fontSize: 15,
    lineHeight: 21,
  },
  textButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  googleButton: {
    marginTop: 12,
  },
  textButtonLabel: {
    color: '#3A6B9C',
    fontSize: 14,
    fontWeight: '600',
  },
});
