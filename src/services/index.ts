import { Platform } from 'react-native';
import type { VideoFile } from '../types';

/** Android emulator reaches the host machine at 10.0.2.2. */
const host = Platform.OS === 'android' ? '10.0.2.2' : '192.168.129.5';
//const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = `http://${host}:3001`;

/** API client for the Node backend. */
export const apiClient = {
  baseUrl: API_BASE_URL,
};

/** Upload a local video file to the Node backend. */
export async function uploadVideo(file: VideoFile): Promise<void> {
  const body = new FormData();
  body.append('video', {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(payload?.error ?? `Upload failed (${response.status})`);
  }
}
