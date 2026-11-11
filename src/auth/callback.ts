import type { SupabaseClient } from '@supabase/supabase-js';
import { AUTH_REDIRECT_URL } from '../config';
import { messageFromAuthError } from './errors';

export type AuthCallback = {
  code?: string;
  accessToken?: string;
  refreshToken?: string;
  flowId?: string;
  error?: string;
};

const handledUrls = new Set<string>();
let pendingFlowId: string | null = null;

export function rememberFlowId(flowId: string | null | undefined) {
  pendingFlowId = flowId ?? null;
}

export function parseAuthCallback(url: string): AuthCallback | null {
  if (!url.startsWith(AUTH_REDIRECT_URL)) {
    return null;
  }

  const hashIndex = url.indexOf('#');
  const queryIndex = url.indexOf('?');
  const queryEnd =
    hashIndex >= 0 && hashIndex > queryIndex ? hashIndex : undefined;
  const query = queryIndex >= 0 ? url.slice(queryIndex + 1, queryEnd) : '';
  const hash = hashIndex >= 0 ? url.slice(hashIndex + 1) : '';
  const params = new URLSearchParams(query);
  for (const [key, value] of new URLSearchParams(hash)) {
    if (!params.has(key)) {
      params.set(key, value);
    }
  }

  if (params.get('error') === 'access_denied') {
    return { error: 'Google sign in was cancelled.' };
  }

  const description = params.get('error_description');
  if (description) {
    return { error: description.replace(/\+/g, ' ') };
  }

  const error = params.get('error');
  if (error) {
    return { error };
  }

  return {
    code: params.get('code') ?? undefined,
    accessToken: params.get('access_token') ?? undefined,
    refreshToken: params.get('refresh_token') ?? undefined,
    flowId: params.get('sb_flow_id') ?? undefined,
  };
}

export async function completeAuthRedirect(
  client: SupabaseClient,
  url: string,
): Promise<void> {
  const callback = parseAuthCallback(url);
  if (!callback || handledUrls.has(url)) {
    return;
  }
  handledUrls.add(url);

  try {
    if (callback.error) {
      throw new Error(callback.error);
    }
    if (callback.code) {
      const flowId = callback.flowId || pendingFlowId || undefined;
      const { error } = await client.auth.exchangeCodeForSession(
        callback.code,
        flowId ? { flowId } : undefined,
      );
      if (error) {
        throw new Error(messageFromAuthError(error));
      }
      pendingFlowId = null;
      return;
    }
    if (callback.accessToken && callback.refreshToken) {
      const { error } = await client.auth.setSession({
        access_token: callback.accessToken,
        refresh_token: callback.refreshToken,
      });
      if (error) {
        throw new Error(messageFromAuthError(error));
      }
    }
  } catch (error) {
    handledUrls.delete(url);
    throw error;
  }
}
