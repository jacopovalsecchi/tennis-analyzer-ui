import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F1F4F8',
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  content: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#15283F',
    marginBottom: 20,
  },
  titleWithEmail: {
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6D7C8E',
    marginBottom: 20,
  },
  loading: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6D7C8E',
    marginBottom: 16,
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
  avatarButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  avatarPlaceholder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DEE5ED',
  },
  avatarPlaceholderText: {
    color: '#6D7C8E',
    fontSize: 14,
    fontWeight: '400',
  },
  editImage: {
    color: '#3A6B9C',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  saveButton: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#3A6B9C',
  },
  saveButtonDisabled: {
    opacity: 0.55,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveMessage: {
    marginTop: 12,
    textAlign: 'center',
    color: '#556678',
    fontSize: 14,
  },
  saveError: {
    marginTop: 12,
    textAlign: 'center',
    color: '#9C3D32',
    fontSize: 15,
  },
  logoutButton: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 14,
  },
  logoutText: {
    color: '#3A6B9C',
    fontSize: 14,
    fontWeight: '600',
  },
});
