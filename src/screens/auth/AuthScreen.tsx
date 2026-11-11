import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../../auth/AuthProvider';
import { messageFromUnknown } from '../../auth/errors';
import { styles } from './styles';

type Mode = 'signIn' | 'signUp';

function Field({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoComplete,
  textContentType,
  onSubmitEditing,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'default';
  autoComplete?: 'email' | 'current-password' | 'new-password';
  textContentType?: 'emailAddress' | 'password' | 'newPassword';
  onSubmitEditing?: () => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoComplete={autoComplete}
        textContentType={textContentType}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
}

/** Email, password, and Google sign-in. A session replaces this screen with the app. */
export function AuthScreen() {
  const {
    configured,
    redirectError,
    clearRedirectError,
    signIn,
    signUp,
    signInWithGoogle,
  } = useAuth();
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState<'form' | 'google' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setNotice(null);
    clearRedirectError();
  };

  const submit = async () => {
    const nextEmail = email.trim().toLowerCase();
    if (!nextEmail) {
      setNotice(null);
      setError('Enter an email.');
      return;
    }
    if (!password) {
      setNotice(null);
      setError('Enter a password.');
      return;
    }
    if (mode === 'signUp' && password.length < 6) {
      setNotice(null);
      setError('Use at least 6 characters.');
      return;
    }

    setBusy('form');
    clearMessages();
    try {
      if (mode === 'signUp') {
        const result = await signUp(nextEmail, password);
        if (result === 'confirm-email') {
          setNotice('Check your email to confirm the account, then sign in.');
          setMode('signIn');
        }
      } else {
        await signIn(nextEmail, password);
      }
    } catch (caught) {
      setError(messageFromUnknown(caught));
    } finally {
      setBusy(null);
    }
  };

  const google = async () => {
    setBusy('google');
    clearMessages();
    try {
      await signInWithGoogle();
    } catch (caught) {
      setError(messageFromUnknown(caught));
    } finally {
      setBusy(null);
    }
  };

  const switchMode = () => {
    setMode(current => (current === 'signIn' ? 'signUp' : 'signIn'));
    clearMessages();
  };

  if (!configured) {
    return (
      <View style={styles.screen}>
        <View style={styles.content}>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>
            Add SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in .env, then reload
            the app.
          </Text>
        </View>
      </View>
    );
  }

  const shownError = error ?? redirectError;
  const signingIn = mode === 'signIn';

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {signingIn ? 'Sign in' : 'Create account'}
        </Text>
        <Text style={styles.subtitle}>
          {signingIn
            ? 'Use your email or Google to open your profile.'
            : 'Create an account with email. You may need to confirm it before signing in.'}
        </Text>
        <Field
          label="Email"
          value={email}
          onChangeText={value => {
            setEmail(value);
            clearMessages();
          }}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <Field
          label="Password"
          value={password}
          onChangeText={value => {
            setPassword(value);
            clearMessages();
          }}
          secureTextEntry
          autoComplete={signingIn ? 'current-password' : 'new-password'}
          textContentType={signingIn ? 'password' : 'newPassword'}
          onSubmitEditing={submit}
        />
        <Pressable
          disabled={busy !== null}
          onPress={submit}
          style={[
            styles.primaryButton,
            busy ? styles.primaryButtonDisabled : null,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {busy === 'form'
              ? signingIn
                ? 'Signing in…'
                : 'Creating account…'
              : signingIn
              ? 'Sign in'
              : 'Create account'}
          </Text>
        </Pressable>
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        {shownError ? <Text style={styles.error}>{shownError}</Text> : null}
        <Pressable
          disabled={busy !== null}
          onPress={google}
          style={[styles.textButton, styles.googleButton]}
        >
          <Text style={styles.textButtonLabel}>
            {busy === 'google' ? 'Opening Google…' : 'Continue with Google'}
          </Text>
        </Pressable>
        <Pressable
          disabled={busy !== null}
          onPress={switchMode}
          style={styles.textButton}
        >
          <Text style={styles.textButtonLabel}>
            {signingIn ? 'Create an account' : 'Sign in'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
