import type { Profile } from '../src/types';
import { API_BASE_URL } from '../src/services/apiBase';
import {
  fetchOwnProfile,
  profileValidationMessage,
  updateProfile,
} from '../src/services/profile';
import { getSupabase } from '../src/services/supabase';

jest.mock('../src/services/supabase', () => ({
  getSupabase: jest.fn(),
}));

const validProfile: Profile = {
  firstName: ' Mario ',
  lastName: ' Rossi ',
  handedness: 'right',
  backhandStyle: 'two-handed',
  height: '180',
  weight: '75,5',
  imageUri: 'file:///photo.jpg',
};

const savedRow = {
  id: 'user-1',
  first_name: 'Mario',
  last_name: 'Rossi',
  height: 180,
  weight: 75.5,
  handedness: 'right',
  backhand_style: 'two-handed',
  updated_at: '2026-11-11T12:00:00.000Z',
};

function session(accessToken: string | null = 'session-token') {
  return {
    data: {
      session:
        accessToken === null
          ? null
          : { access_token: accessToken, user: { id: 'user-1' } },
    },
    error: null,
  };
}

function installFetch(mock: jest.Mock): jest.Mock {
  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    writable: true,
    value: mock,
  });
  return mock;
}

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe('profileValidationMessage', () => {
  test('accepts the six fields the profile route stores', () => {
    expect(profileValidationMessage(validProfile)).toBeNull();
  });

  test('rejects empty names, non-numeric measures, and unknown choices', () => {
    expect(profileValidationMessage({ ...validProfile, firstName: '  ' })).toBe(
      'Enter a first name.',
    );
    expect(profileValidationMessage({ ...validProfile, lastName: '' })).toBe(
      'Enter a last name.',
    );
    expect(profileValidationMessage({ ...validProfile, height: 'tall' })).toBe(
      'Enter a numeric height in cm.',
    );
    expect(profileValidationMessage({ ...validProfile, weight: '' })).toBe(
      'Enter a numeric weight in kg.',
    );
    expect(profileValidationMessage({ ...validProfile, height: '49' })).toBe(
      'Height must be between 50 and 300 cm.',
    );
    expect(profileValidationMessage({ ...validProfile, weight: '501' })).toBe(
      'Weight must be between 20 and 500 kg.',
    );
    expect(profileValidationMessage({ ...validProfile, handedness: '' })).toBe(
      'Choose left or right handedness.',
    );
    expect(
      profileValidationMessage({ ...validProfile, backhandStyle: '' }),
    ).toBe('Choose a one-handed or two-handed backhand.');
  });
});

describe('updateProfile', () => {
  const getSession = jest.fn();
  let fetchMock: jest.Mock;

  beforeEach(() => {
    getSession.mockReset();
    getSession.mockResolvedValue(session());
    (getSupabase as jest.Mock).mockReturnValue({
      auth: { getSession },
    });
    fetchMock = installFetch(jest.fn());
  });

  test('sends PATCH /profile with the Supabase access token and all six fields', async () => {
    fetchMock = installFetch(
      jest.fn(async () => jsonResponse(200, { profile: savedRow })),
    );

    const saved = await updateProfile(validProfile);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/profile`, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer session-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: 'Mario',
        last_name: 'Rossi',
        height: 180,
        weight: 75.5,
        handedness: 'right',
        backhand_style: 'two-handed',
      }),
    });
    expect(saved).toMatchObject({
      firstName: 'Mario',
      lastName: 'Rossi',
      height: '180',
      weight: '75.5',
      handedness: 'right',
      backhandStyle: 'two-handed',
      imageUri: 'file:///photo.jpg',
    });
  });

  test('does not call the backend without an access token', async () => {
    getSession.mockResolvedValue(session(null));

    await expect(updateProfile(validProfile)).rejects.toThrow(
      'Sign in again to save your profile.',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('does not call the backend when the form is invalid', async () => {
    await expect(
      updateProfile({ ...validProfile, firstName: '' }),
    ).rejects.toThrow('Enter a first name.');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('surfaces the backend error message', async () => {
    installFetch(
      jest.fn(async () =>
        jsonResponse(400, {
          error: 'height must be a number between 50 and 300',
        }),
      ),
    );

    await expect(updateProfile(validProfile)).rejects.toThrow(
      'height must be a number between 50 and 300',
    );
  });

  test('reports that the server could not be reached', async () => {
    installFetch(
      jest.fn(async () => {
        throw new TypeError('Network request failed');
      }),
    );

    await expect(updateProfile(validProfile)).rejects.toThrow(
      'Could not reach the server.',
    );
  });
});

describe('fetchOwnProfile', () => {
  const getSession = jest.fn();
  const maybeSingle = jest.fn();
  const eq = jest.fn(() => ({ maybeSingle }));
  const select = jest.fn(() => ({ eq }));
  const from = jest.fn(() => ({ select }));
  const schema = jest.fn(() => ({ from }));

  beforeEach(() => {
    getSession.mockReset();
    getSession.mockResolvedValue(session());
    maybeSingle.mockReset();
    eq.mockImplementation(() => ({ maybeSingle }));
    select.mockImplementation(() => ({ eq }));
    from.mockImplementation(() => ({ select }));
    schema.mockImplementation(() => ({ from }));
    (getSupabase as jest.Mock).mockReturnValue({
      auth: { getSession },
      schema,
    });
  });

  test('reads public.profiles for the signed-in user', async () => {
    maybeSingle.mockResolvedValue({
      data: {
        first_name: 'Mario',
        last_name: 'Rossi',
        height: '181.50',
        weight: 70,
        handedness: 'left',
        backhand_style: 'one-handed',
      },
      error: null,
    });

    await expect(fetchOwnProfile()).resolves.toEqual({
      firstName: 'Mario',
      lastName: 'Rossi',
      height: '181.5',
      weight: '70',
      handedness: 'left',
      backhandStyle: 'one-handed',
    });
    expect(schema).toHaveBeenCalledWith('public');
    expect(from).toHaveBeenCalledWith('profiles');
    expect(select).toHaveBeenCalledWith(
      'first_name, last_name, height, weight, handedness, backhand_style',
    );
    expect(eq).toHaveBeenCalledWith('id', 'user-1');
  });

  test('returns null when the user has no profile row yet', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });
    await expect(fetchOwnProfile()).resolves.toBeNull();
  });

  test('returns the Supabase error message', async () => {
    maybeSingle.mockResolvedValue({
      data: null,
      error: { message: 'permission denied for table profiles' },
    });
    await expect(fetchOwnProfile()).rejects.toThrow(
      'permission denied for table profiles',
    );
  });
});
