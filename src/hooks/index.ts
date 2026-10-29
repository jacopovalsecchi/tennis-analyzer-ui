import { useEffect, useState } from 'react';
import {
  fetchLatestResult,
  getLatestResult,
  setLatestResult,
  subscribeLatestResult,
} from '../services';
import type { VideoResult } from '../types';

/** The single result row: the last upload, or the bundled overlay before that. */
export function useLatestResult(): VideoResult {
  const [result, setResult] = useState(getLatestResult);

  useEffect(() => subscribeLatestResult(() => setResult(getLatestResult())), []);

  useEffect(() => {
    let cancelled = false;
    fetchLatestResult().then(remote => {
      if (!cancelled && remote) {
        setLatestResult(remote);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return result;
}
