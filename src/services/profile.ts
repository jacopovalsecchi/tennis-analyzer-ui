import { messageFromUnknown } from '../auth/errors';
import type { BackhandStyle, Handedness, Profile } from '../types';
import { API_BASE_URL } from './apiBase';
import { getSupabase } from './supabase';

const HEIGHT_MIN = 50;
const HEIGHT_MAX = 300;
const WEIGHT_MIN = 20;
const WEIGHT_MAX = 500;

type ProfileBody = {
  first_name: string;
  last_name: string;
  height: number;
  weight: number;
  handedness: Handedness;
  backhand_style: BackhandStyle;
};

type ProfileRow = {
  first_name?: unknown;
  last_name?: unknown;
  height?: unknown;
  weight?: unknown;
  handedness?: unknown;
  backhand_style?: unknown;
};

const emptyProfile: Profile = {
  firstName: '',
  lastName: '',
  handedness: '',
  backhandStyle: '',
  height: '',
  weight: '',
};

export function emptyProfileForm(): Profile {
  return { ...emptyProfile };
}

function parseMeasure(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d+(?:[.,]\d+)?$/.test(trimmed)) {
    return null;
  }
  const number = Number(trimmed.replace(',', '.'));
  return Number.isFinite(number) ? number : null;
}

function formatMeasure(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === 'string') {
    const parsed = parseMeasure(value);
    return parsed === null ? '' : String(parsed);
  }
  return '';
}

function textField(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function checkedMeasure(
  value: string,
  name: string,
  unit: string,
  min: number,
  max: number,
): { error: string } | { value: number } {
  const parsed = parseMeasure(value);
  if (parsed === null) {
    return { error: `Enter a numeric ${name} in ${unit}.` };
  }
  if (parsed < min || parsed > max) {
    const label = `${name[0].toUpperCase()}${name.slice(1)}`;
    return { error: `${label} must be between ${min} and ${max} ${unit}.` };
  }
  return { value: parsed };
}

function profileBody(
  profile: Profile,
): { error: string } | { body: ProfileBody } {
  if (!profile.firstName.trim()) {
    return { error: 'Enter a first name.' };
  }
  if (!profile.lastName.trim()) {
    return { error: 'Enter a last name.' };
  }
  const height = checkedMeasure(
    profile.height,
    'height',
    'cm',
    HEIGHT_MIN,
    HEIGHT_MAX,
  );
  if ('error' in height) {
    return height;
  }
  const weight = checkedMeasure(
    profile.weight,
    'weight',
    'kg',
    WEIGHT_MIN,
    WEIGHT_MAX,
  );
  if ('error' in weight) {
    return weight;
  }
  if (profile.handedness !== 'left' && profile.handedness !== 'right') {
    return { error: 'Choose left or right handedness.' };
  }
  if (
    profile.backhandStyle !== 'one-handed' &&
    profile.backhandStyle !== 'two-handed'
  ) {
    return { error: 'Choose a one-handed or two-handed backhand.' };
  }

  return {
    body: {
      first_name: profile.firstName.trim(),
      last_name: profile.lastName.trim(),
      height: height.value,
      weight: weight.value,
      handedness: profile.handedness,
      backhand_style: profile.backhandStyle,
    },
  };
}

/** Client-side check before PATCH /profile. Null means the form can be saved. */
export function profileValidationMessage(profile: Profile): string | null {
  const result = profileBody(profile);
  return 'error' in result ? result.error : null;
}

export function profileFromRow(row: ProfileRow, imageUri?: string): Profile {
  const handedness: Profile['handedness'] =
    row.handedness === 'left' || row.handedness === 'right'
      ? row.handedness
      : '';
  const backhandStyle: Profile['backhandStyle'] =
    row.backhand_style === 'one-handed' || row.backhand_style === 'two-handed'
      ? row.backhand_style
      : '';

  return {
    firstName: textField(row.first_name),
    lastName: textField(row.last_name),
    handedness,
    backhandStyle,
    height: formatMeasure(row.height),
    weight: formatMeasure(row.weight),
    imageUri,
  };
}

async function requireSession(action: 'save' | 'load'): Promise<{
  accessToken: string;
  userId: string;
}> {
  const { data, error } = await getSupabase().auth.getSession();
  if (error) {
    throw new Error(messageFromUnknown(error));
  }
  const accessToken = data.session?.access_token?.trim();
  const userId = data.session?.user?.id;
  if (!accessToken || !userId) {
    throw new Error(
      action === 'save'
        ? 'Sign in again to save your profile.'
        : 'Sign in again to load your profile.',
    );
  }
  return { accessToken, userId };
}

async function errorMessage(response: Response): Promise<string> {
  const payload = (await response.json().catch(() => null)) as {
    error?: unknown;
    message?: unknown;
  } | null;
  if (typeof payload?.error === 'string' && payload.error.trim()) {
    return payload.error.trim();
  }
  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message.trim();
  }
  return `Profile update failed (${response.status})`;
}

/** The signed-in user's row in public.profiles, or null when no row exists yet. */
export async function fetchOwnProfile(): Promise<Profile | null> {
  const { userId } = await requireSession('load');
  const { data, error } = await getSupabase()
    .schema('public')
    .from('profiles')
    .select('first_name, last_name, height, weight, handedness, backhand_style')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    return null;
  }
  return profileFromRow(data);
}

/** Persist the six profile fields with the current Supabase access token. */
export async function updateProfile(profile: Profile): Promise<Profile> {
  const parsed = profileBody(profile);
  if ('error' in parsed) {
    throw new Error(parsed.error);
  }
  const { accessToken } = await requireSession('save');

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsed.body),
    });
  } catch {
    throw new Error('Could not reach the server.');
  }

  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }

  const payload = (await response.json().catch(() => null)) as {
    profile?: ProfileRow;
  } | null;
  if (!payload?.profile) {
    throw new Error('Profile update failed');
  }
  return profileFromRow(payload.profile, profile.imageUri);
}
