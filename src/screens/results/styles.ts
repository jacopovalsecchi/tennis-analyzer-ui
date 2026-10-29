import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F5F7',
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#243038',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8B919A',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F9',
    borderWidth: 1,
    borderColor: '#E6E8EC',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  film: {
    width: 28,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#5C6570',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    alignItems: 'center',
  },
  filmEdge: {
    width: 2,
    height: 12,
    borderRadius: 1,
    backgroundColor: '#5C6570',
  },
  cardText: {
    flex: 1,
  },
  filename: {
    fontSize: 16,
    fontWeight: '500',
    color: '#243038',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8B919A',
  },
  chevron: {
    fontSize: 22,
    fontWeight: '400',
    color: '#9AA1A9',
  },
});
