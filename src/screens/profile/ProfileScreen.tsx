import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
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
import { updateProfile } from '../../services';
import type { Profile } from '../../types';
import { styles } from './styles';

const initialProfile: Profile = {
  firstName: 'Alex',
  lastName: 'Carter',
  handedness: 'right',
  backhand: 'one end',
  height: 183,
  weight: 78,
};

const handednessLabel = { left: 'Left', right: 'Right' } as const;

const backhandLabel = { 'one end': 'One end', 'two end': 'Two end' } as const;

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'numeric';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function Dropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
}) {
  const [visible, setVisible] = useState(false);
  const selectedLabel =
    options.find(option => option.value === value)?.label ?? value;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.dropdown} onPress={() => setVisible(true)}>
        <Text style={styles.input}>{selectedLabel}</Text>
        <Text style={styles.chevron}>⌄</Text>
      </Pressable>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            {options.map(option => (
              <Pressable
                key={option.value}
                style={styles.dropdownOption}
                onPress={() => {
                  onChange(option.value);
                  setVisible(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

/** Editable profile: name, handedness, backhand, height, weight and image. */
export function ProfileScreen() {
  const { email, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const setField = <K extends keyof Profile>(field: K, value: Profile[K]) => {
    setProfile(current => ({ ...current, [field]: value }));
    setSaveMessage(null);
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
    setSaving(true);
    setSaveMessage(null);
    try {
      await updateProfile(profile);
      setSaveMessage('Saved');
    } catch {
      setSaveMessage('Unable to save');
    } finally {
      setSaving(false);
    }
  };

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
          value={profile.firstName}
          onChangeText={value => setField('firstName', value)}
        />
        <Field
          label="Last name"
          value={profile.lastName}
          onChangeText={value => setField('lastName', value)}
        />
        <Dropdown
          label="Handedness"
          value={profile.handedness}
          options={[
            { label: handednessLabel.left, value: 'left' },
            { label: handednessLabel.right, value: 'right' },
          ]}
          onChange={value => setField('handedness', value)}
        />
        <Dropdown
          label="Backhand"
          value={profile.backhand}
          options={[
            { label: backhandLabel['one end'], value: 'one end' },
            { label: backhandLabel['two end'], value: 'two end' },
          ]}
          onChange={value => setField('backhand', value)}
        />
        <Field
          label="Height (cm)"
          value={String(profile.height)}
          onChangeText={value => setField('height', Number(value) || 0)}
          keyboardType="numeric"
        />
        <Field
          label="Weight (kg)"
          value={String(profile.weight)}
          onChangeText={value => setField('weight', Number(value) || 0)}
          keyboardType="numeric"
        />
        <Pressable disabled={saving} onPress={save} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving…' : 'Save profile'}
          </Text>
        </Pressable>
        {saveMessage ? (
          <Text
            style={
              saveMessage === 'Unable to save'
                ? styles.saveError
                : styles.saveMessage
            }
          >
            {saveMessage}
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
