import { useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '../../auth/AuthProvider';
import { messageFromUnknown } from '../../auth/errors';
import { BinaryToggle } from '../../components';
import {
  emptyProfileForm,
  fetchOwnProfile,
  profileValidationMessage,
  updateProfile,
} from '../../services';
import type { BackhandStyle, Handedness, Profile } from '../../types';
import { styles } from './styles';

type Notice = { tone: 'success' | 'error'; text: string };

const handednessOptions: readonly [
  { label: string; value: Handedness },
  { label: string; value: Handedness },
] = [
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
];

const backhandOptions: readonly [
  { label: string; value: BackhandStyle },
  { label: string; value: BackhandStyle },
] = [
  { label: 'One-handed', value: 'one-handed' },
  { label: 'Two-handed', value: 'two-handed' },
];

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  editable = true,
  testID,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'numeric';
  editable?: boolean;
  testID?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        testID={testID}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );
}

/** Editable profile: name, handedness, backhand, height, weight and image. */
export function ProfileScreen() {
  const { email, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile>(emptyProfileForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    let active = true;
    fetchOwnProfile()
      .then(loaded => {
        if (active && loaded) {
          setProfile(current => ({ ...loaded, imageUri: current.imageUri }));
        }
      })
      .catch(caught => {
        if (active) {
          setNotice({ tone: 'error', text: messageFromUnknown(caught) });
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const setField = <K extends keyof Profile>(field: K, value: Profile[K]) => {
    setProfile(current => ({ ...current, [field]: value }));
    setNotice(null);
  };

  const chooseImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });
    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setField('imageUri', uri);
    }
  };

  const logOut = async () => {
    setLoggingOut(true);
    setLogoutError(null);
    try {
      await signOut();
    } catch (caught) {
      setLogoutError(messageFromUnknown(caught));
    } finally {
      setLoggingOut(false);
    }
  };

  const save = async () => {
    if (savingRef.current || loading) {
      return;
    }
    const problem = profileValidationMessage(profile);
    if (problem) {
      setNotice({ tone: 'error', text: problem });
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setNotice(null);
    try {
      const saved = await updateProfile(profile);
      setProfile(saved);
      setNotice({ tone: 'success', text: 'Profile saved' });
    } catch (caught) {
      setNotice({ tone: 'error', text: messageFromUnknown(caught) });
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const busy = loading || saving;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, email ? styles.titleWithEmail : null]}>
          Profile
        </Text>
        {email ? <Text style={styles.email}>{email}</Text> : null}
        {loading ? <Text style={styles.loading}>Loading profile…</Text> : null}
        <Pressable onPress={chooseImage} style={styles.avatarButton}>
          {profile.imageUri ? (
            <Image source={{ uri: profile.imageUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>Add photo</Text>
            </View>
          )}
          <Text style={styles.editImage}>Edit photo</Text>
        </Pressable>
        <Field
          label="First name"
          testID="first-name"
          value={profile.firstName}
          editable={!busy}
          onChangeText={value => setField('firstName', value)}
        />
        <Field
          label="Last name"
          testID="last-name"
          value={profile.lastName}
          editable={!busy}
          onChangeText={value => setField('lastName', value)}
        />
        <BinaryToggle
          label="Handedness"
          testID="handedness"
          value={profile.handedness}
          disabled={busy}
          options={handednessOptions}
          onChange={value => setField('handedness', value)}
        />
        <BinaryToggle
          label="Backhand"
          testID="backhand-style"
          value={profile.backhandStyle}
          disabled={busy}
          options={backhandOptions}
          onChange={value => setField('backhandStyle', value)}
        />
        <Field
          label="Height (cm)"
          testID="height"
          value={profile.height}
          editable={!busy}
          onChangeText={value => setField('height', value)}
          keyboardType="numeric"
        />
        <Field
          label="Weight (kg)"
          testID="weight"
          value={profile.weight}
          editable={!busy}
          onChangeText={value => setField('weight', value)}
          keyboardType="numeric"
        />
        <Pressable
          testID="save-profile"
          disabled={busy}
          accessibilityState={{ disabled: busy }}
          onPress={save}
          style={[styles.saveButton, busy ? styles.saveButtonDisabled : null]}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving…' : 'Save profile'}
          </Text>
        </Pressable>
        {notice ? (
          <Text
            testID="profile-notice"
            style={
              notice.tone === 'error' ? styles.saveError : styles.saveMessage
            }
          >
            {notice.text}
          </Text>
        ) : null}
        <Pressable
          disabled={loggingOut}
          onPress={logOut}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>
            {loggingOut ? 'Logging out…' : 'Log out'}
          </Text>
        </Pressable>
        {logoutError ? (
          <Text style={styles.saveError}>{logoutError}</Text>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
