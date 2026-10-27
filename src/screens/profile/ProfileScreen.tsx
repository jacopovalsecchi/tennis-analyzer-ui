import { Text, View } from 'react-native';
import type { Profile } from '../../types';
import { styles } from './styles';

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
