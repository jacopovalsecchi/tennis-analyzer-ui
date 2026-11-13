import { Platform } from 'react-native';
import { BACKEND_URL } from '../config';

/** Android emulator reaches the host machine at 10.0.2.2, not localhost. */
export function apiBaseUrl(): string {
  const url = (BACKEND_URL || 'http://localhost:3001').replace(/\/$/, '');
  if (Platform.OS === 'android') {
    return url
      .replace('://localhost', '://10.0.2.2')
      .replace('://127.0.0.1', '://10.0.2.2');
  }
  return url;
}

export const API_BASE_URL = apiBaseUrl();
