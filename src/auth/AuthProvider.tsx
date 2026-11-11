import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Linking } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { AUTH_REDIRECT_URL } from '../config';
import { getSupabase, supabase } from '../services/supabase';
import { completeAuthRedirect, rememberFlowId } from './callback';
import { messageFromAuthError, messageFromUnknown } from './errors';

type AuthStatus = 'loading' | 'signedIn' | 'signedOut';

type AuthContextValue = {
  status: AuthStatus;
  configured: boolean;
  email: string | null;
  redirectError: string | null;
  clearRedirectError: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<'signed-in' | 'confirm-email'>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(
    supabase ? 'loading' : 'signedOut',
  );
  const [session, setSession] = useState<Session | null>(null);
  const [redirectError, setRedirectError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      return;
    }
    const client = supabase;
    let active = true;

    const apply = (next: Session | null) => {
      if (!active) {
        return;
      }
      setSession(next);
      setStatus(next ? 'signedIn' : 'signedOut');
    };

    client.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          apply(null);
          return;
        }
        apply(data.session);
      })
      .catch(() => apply(null));

    const { data } = client.auth.onAuthStateChange((_event, next) => {
      apply(next);
    });

    const onUrl = (url: string | null | undefined) => {
      if (!url) {
        return;
      }
      completeAuthRedirect(client, url).catch(error => {
        if (active) {
          setRedirectError(messageFromUnknown(error));
        }
      });
    };

    const subscription = Linking.addEventListener('url', event => {
      onUrl(event.url);
    });
    Promise.resolve()
      .then(() => Linking.getInitialURL())
      .then(onUrl)
      .catch(() => undefined);

    return () => {
      active = false;
      data.subscription.unsubscribe();
      subscription.remove();
    };
  }, []);

  const clearRedirectError = useCallback(() => {
    setRedirectError(null);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await getSupabase().auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error(messageFromAuthError(error));
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { data, error } = await getSupabase().auth.signUp({
      email,
      password,
      options: { emailRedirectTo: AUTH_REDIRECT_URL },
    });
    if (error) {
      throw new Error(messageFromAuthError(error));
    }
    if (!data.session) {
      const identities = data.user?.identities;
      if (Array.isArray(identities) && identities.length === 0) {
        throw new Error('An account with this email already exists.');
      }
      return 'confirm-email' as const;
    }
    return 'signed-in' as const;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { data, error } = await getSupabase().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: AUTH_REDIRECT_URL,
        skipBrowserRedirect: true,
      },
    });
    if (error) {
      throw new Error(messageFromAuthError(error));
    }
    if (!data.url) {
      throw new Error('Could not start Google sign in.');
    }
    rememberFlowId(data.flowId);
    await Linking.openURL(data.url);
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await getSupabase().auth.signOut();
    if (error) {
      throw new Error(messageFromAuthError(error));
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      configured: supabase !== null,
      email: session?.user.email ?? null,
      redirectError,
      clearRedirectError,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    }),
    [
      status,
      session,
      redirectError,
      clearRedirectError,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}
