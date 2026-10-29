import type { VideoResult } from '../types';

/** Bundled overlay until the backend has a real upload. */
const sampleResult: VideoResult = {
  id: 'sample-overlay',
  filename: 'sample_overlay.mp4',
  uploadedAt: '2026-10-28T09:39:00.000Z',
  forehands: 2,
  backhands: 1,
  overlayUrl: null,
};

let latest = sampleResult;
const listeners = new Set<() => void>();

export function getLatestResult(): VideoResult {
  return latest;
}

export function setLatestResult(result: VideoResult): void {
  latest = result;
  listeners.forEach(listener => listener());
}

export function subscribeLatestResult(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
