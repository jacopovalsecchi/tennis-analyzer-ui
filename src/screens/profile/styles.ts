import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  content: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  field: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    fontSize: 17,
    padding: 0,
    color: '#111',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chevron: {
    fontSize: 22,
    color: '#666',
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
    backgroundColor: '#E6E8EC',
  },
  avatarPlaceholderText: {
    color: '#666',
    fontSize: 14,
  },
  editImage: {
    color: '#3E7A57',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  dropdownMenu: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  dropdownOption: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  dropdownOptionText: {
    fontSize: 17,
    color: '#111',
  },
  saveButton: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#3E7A57',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveMessage: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
});
