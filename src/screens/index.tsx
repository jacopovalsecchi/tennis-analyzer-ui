import { StyleSheet, Text, View } from 'react-native';
import type { Profile } from '../types';

const sampleProfile: Profile = {
  firstName: 'Alex',
  lastName: 'Carter',
  handedness: 'right',
  backhand: 'one-handed',
  height: 183,
  weight: 78,
};

const handednessLabel = {
  left: 'Left-handed',
  right: 'Right-handed',
} as const;

const backhandLabel = {
  'one-handed': 'One-handed',
  'two-handed': 'Two-handed',
} as const;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

/** Profile: name, handedness, backhand, height, weight. */
export function ProfileScreen() {
  const profile = sampleProfile;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Profile</Text>
      <Field label="First name" value={profile.firstName} />
      <Field label="Last name" value={profile.lastName} />
      <Field label="Handedness" value={handednessLabel[profile.handedness]} />
      <Field label="Backhand" value={backhandLabel[profile.backhand]} />
      <Field label="Height" value={`${profile.height} cm`} />
      <Field label="Weight" value={`${profile.weight} kg`} />
    </View>
  );
}

/** Pick a video and send it to the backend. */
export function VideoUploadScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Video upload</Text>
      <Text style={styles.body}>Choose a video and send it to the backend.</Text>
    </View>
  );
}

/** Stroke count, type, and judgment. */
export function ResultsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Results</Text>
      <Text style={styles.body}>
        Stroke count, type, and a judgment for each stroke.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  field: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 17,
  },
});
