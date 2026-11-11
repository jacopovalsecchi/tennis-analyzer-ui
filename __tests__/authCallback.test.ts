import { parseAuthCallback } from '../src/auth/callback';

test('ignores urls that are not the app auth redirect', () => {
  expect(parseAuthCallback('https://example.com/callback?code=abc')).toBeNull();
  expect(parseAuthCallback('http://localhost:3000')).toBeNull();
});

test('reads a pkce code from the query', () => {
  expect(
    parseAuthCallback(
      'tennisanalyzer://auth/callback?code=abc&sb_flow_id=flow-1',
    ),
  ).toEqual({
    code: 'abc',
    accessToken: undefined,
    refreshToken: undefined,
    flowId: 'flow-1',
  });
});

test('reads tokens from the hash', () => {
  expect(
    parseAuthCallback(
      'tennisanalyzer://auth/callback#access_token=token&refresh_token=refresh',
    ),
  ).toEqual({
    code: undefined,
    accessToken: 'token',
    refreshToken: 'refresh',
    flowId: undefined,
  });
});

test('turns a cancelled Google redirect into a message', () => {
  expect(
    parseAuthCallback('tennisanalyzer://auth/callback?error=access_denied'),
  ).toEqual({
    error: 'Google sign in was cancelled.',
  });
});

test('keeps an error description from the provider', () => {
  expect(
    parseAuthCallback(
      'tennisanalyzer://auth/callback?error=server_error&error_description=Sign-in+failed',
    ),
  ).toEqual({
    error: 'Sign-in failed',
  });
});
