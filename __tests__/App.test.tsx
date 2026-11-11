/**
 * @format
 */

import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import { AuthProvider } from '../src/auth/AuthProvider';
import { AuthScreen } from '../src/screens/auth/AuthScreen';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

test('shows sign in when there is no session', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <AuthProvider>
        <AuthScreen />
      </AuthProvider>,
    );
  });
  await ReactTestRenderer.act(async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
  });

  const labels = renderer!.root
    .findAllByType(Text)
    .map(node => node.props.children)
    .flat();

  expect(labels).toContain('Sign in');
  expect(labels).toContain('Continue with Google');
});
