import { Platform } from 'react-native';
import type { Profile, ShotComment, VideoFile, VideoResult } from '../types';
import { setLatestResult } from './latestResult';

export { getLatestResult, setLatestResult, subscribeLatestResult } from './latestResult';

/** Android emulator reaches the host machine at 10.0.2.2. */
//const host = Platform.OS === 'android' ? '10.0.2.2' : '192.168.129.254';
const host = Platform.OS === 'android' ? '10.0.2.2' : '192.168.129.5';
//const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = `http://${host}:3001`;

/** API client for the Node backend. */
export const apiClient = {
  baseUrl: API_BASE_URL,
};

/** Save the profile currently edited in the app. */
export async function updateProfile(profile: Profile): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(payload?.error ?? `Profile update failed (${response.status})`);
  }
}

type AnalysisPayload = {
  filename?: string;
  storedAs?: string;
  uploadedAt?: string;
  strokes?: {
    forehands?: number;
    backhands?: number;
  };
  comments?: ShotComment[];
};

function toResult(payload: AnalysisPayload, fallbackName: string): VideoResult {
  return {
    id: payload.storedAs ?? payload.filename ?? fallbackName,
    filename: payload.filename ?? fallbackName,
    uploadedAt: payload.uploadedAt ?? new Date().toISOString(),
    forehands: payload.strokes?.forehands ?? 0,
    backhands: payload.strokes?.backhands ?? 0,
    overlayUrl: `${API_BASE_URL}/results/latest/overlay`,
    comments: payload.comments ?? [],
  };
}

/** The most recent analyzed upload, if the backend has one. */
export async function fetchLatestResult(): Promise<VideoResult | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/results/latest`);
    if (!response.ok) {
      return null;
    }
    const payload = (await response.json()) as AnalysisPayload;
    if (!payload.filename) {
      return null;
    }
    return toResult(payload, payload.filename);
  } catch {
    return null;
  }
}

/** Upload a local video file to the Node backend. */
export async function uploadVideo(file: VideoFile): Promise<VideoResult> {
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

  const payload = (await response.json()) as AnalysisPayload;
  const result = toResult(payload, file.name);
  setLatestResult(result);
  return result;
}
