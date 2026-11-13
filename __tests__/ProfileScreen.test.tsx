import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { ProfileScreen } from '../src/screens/profile/ProfileScreen';
import { API_BASE_URL } from '../src/services/apiBase';
import { getSupabase } from '../src/services/supabase';

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(async () => ({})),
}));

jest.mock('../src/auth/AuthProvider', () => ({
  useAuth: () => ({
    email: 'mario@example.com',
    signOut: jest.fn(async () => undefined),
  }),
}));

jest.mock('../src/services/supabase', () => ({
  getSupabase: jest.fn(),
}));

const storedRow = {
  first_name: 'Mario',
  last_name: 'Rossi',
  height: 180,
  weight: 75,
  handedness: 'right',
  backhand_style: 'two-handed',
};

const savedRow = {
  ...storedRow,
  id: 'user-1',
  updated_at: '2026-11-11T12:00:00.000Z',
};

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

describe('ProfileScreen', () => {
  const getSession = jest.fn();
  const maybeSingle = jest.fn();
  const eq = jest.fn(() => ({ maybeSingle }));
  const select = jest.fn(() => ({ eq }));
  const from = jest.fn(() => ({ select }));
  const schema = jest.fn(() => ({ from }));
  let fetchMock: jest.Mock;

  beforeEach(() => {
    getSession.mockReset();
    getSession.mockResolvedValue({
      data: {
        session: {
          access_token: 'session-token',
          user: { id: 'user-1' },
        },
      },
      error: null,
    });
    maybeSingle.mockReset();
    maybeSingle.mockResolvedValue({ data: storedRow, error: null });
    eq.mockImplementation(() => ({ maybeSingle }));
    select.mockImplementation(() => ({ eq }));
    from.mockImplementation(() => ({ select }));
    schema.mockImplementation(() => ({ from }));
    (getSupabase as jest.Mock).mockReturnValue({
      auth: { getSession },
      schema,
    });
    fetchMock = installFetch(
      jest.fn(async () => jsonResponse(200, { profile: savedRow })),
    );
  });

  async function renderScreen() {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<ProfileScreen />);
    });
    return renderer;
  }

  function value(
    renderer: ReactTestRenderer.ReactTestRenderer,
    testID: string,
  ) {
    return renderer.root.findByProps({ testID }).props.value as string;
  }

  function labels(renderer: ReactTestRenderer.ReactTestRenderer) {
    return renderer.root
      .findAllByType(Text)
      .map(node => node.props.children)
      .flat()
      .filter((child): child is string => typeof child === 'string');
  }

  async function type(
    renderer: ReactTestRenderer.ReactTestRenderer,
    testID: string,
    text: string,
  ) {
    await ReactTestRenderer.act(async () => {
      renderer.root.findByProps({ testID }).props.onChangeText(text);
    });
  }

  function pressable(
    renderer: ReactTestRenderer.ReactTestRenderer,
    testID: string,
  ) {
    const match = renderer.root
      .findAll(node => node.props?.testID === testID)
      .find(node => typeof node.props.onPress === 'function');
    if (!match) {
      throw new Error(`Missing pressable ${testID}`);
    }
    return match;
  }

  async function choose(
    renderer: ReactTestRenderer.ReactTestRenderer,
    optionID: string,
  ) {
    await ReactTestRenderer.act(async () => {
      pressable(renderer, optionID).props.onPress();
    });
  }

  test('fills the form from the signed-in profile', async () => {
    const renderer = await renderScreen();

    expect(value(renderer, 'first-name')).toBe('Mario');
    expect(value(renderer, 'last-name')).toBe('Rossi');
    expect(value(renderer, 'height')).toBe('180');
    expect(value(renderer, 'weight')).toBe('75');
    expect(labels(renderer)).toEqual(
      expect.arrayContaining(['Right', 'Two-handed', 'mario@example.com']),
    );
    expect(schema).toHaveBeenCalledWith('public');
    expect(eq).toHaveBeenCalledWith('id', 'user-1');
  });

  test('Save profile sends every field and then shows success', async () => {
    const renderer = await renderScreen();
    await type(renderer, 'first-name', 'Maria');
    await type(renderer, 'last-name', 'Bianchi');
    await type(renderer, 'height', '181');
    await type(renderer, 'weight', '70');
    await choose(renderer, 'handedness-left');
    await choose(renderer, 'backhand-style-one-handed');

    let resolveFetch: (response: Response) => void = () => undefined;
    fetchMock.mockImplementation(
      () =>
        new Promise(resolve => {
          resolveFetch = resolve;
        }),
    );

    const button = () => pressable(renderer, 'save-profile');
    await ReactTestRenderer.act(async () => {
      button().props.onPress();
      button().props.onPress();
    });

    expect(button().props.disabled).toBe(true);
    expect(labels(renderer)).toContain('Saving…');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/profile`, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer session-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: 'Maria',
        last_name: 'Bianchi',
        height: 181,
        weight: 70,
        handedness: 'left',
        backhand_style: 'one-handed',
      }),
    });

    await ReactTestRenderer.act(async () => {
      resolveFetch(
        jsonResponse(200, {
          profile: {
            ...savedRow,
            first_name: 'Maria',
            last_name: 'Bianchi',
            height: 181,
            weight: 70,
            handedness: 'left',
            backhand_style: 'one-handed',
          },
        }),
      );
    });

    expect(button().props.disabled).toBe(false);
    expect(labels(renderer)).toContain('Profile saved');
    expect(value(renderer, 'first-name')).toBe('Maria');
  });

  test('keeps the form and shows the backend error when save fails', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(400, { error: 'Invalid authentication token' }),
    );
    const renderer = await renderScreen();
    await type(renderer, 'weight', '82');

    await ReactTestRenderer.act(async () => {
      pressable(renderer, 'save-profile').props.onPress();
    });

    expect(labels(renderer)).toContain('Invalid authentication token');
    expect(value(renderer, 'first-name')).toBe('Mario');
    expect(value(renderer, 'last-name')).toBe('Rossi');
    expect(value(renderer, 'height')).toBe('180');
    expect(value(renderer, 'weight')).toBe('82');
    expect(labels(renderer)).toEqual(
      expect.arrayContaining(['Right', 'Two-handed']),
    );
  });

  test('blocks save and keeps typed values when a name is missing', async () => {
    const renderer = await renderScreen();
    await type(renderer, 'first-name', '   ');
    fetchMock.mockClear();

    await ReactTestRenderer.act(async () => {
      pressable(renderer, 'save-profile').props.onPress();
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(labels(renderer)).toContain('Enter a first name.');
    expect(value(renderer, 'first-name')).toBe('   ');
    expect(value(renderer, 'last-name')).toBe('Rossi');
  });
});
