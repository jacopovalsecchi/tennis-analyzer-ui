import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  ProfileScreen,
  ResultsScreen,
  VideoUploadScreen,
} from '../screens';

const tabs = [
  { key: 'profile', label: 'Profile', Screen: ProfileScreen },
  { key: 'upload', label: 'Upload', Screen: VideoUploadScreen },
  { key: 'results', label: 'Results', Screen: ResultsScreen },
] as const;

type TabKey = (typeof tabs)[number]['key'];

/** Stack and tab navigator setup. */
export function AppNavigator() {
  const [tab, setTab] = useState<TabKey>('profile');
  const current = tabs.find(item => item.key === tab) ?? tabs[0];
  const Screen = current.Screen;

  return (
    <View style={styles.root}>
      <Screen />
      <View style={styles.bar}>
        {tabs.map(item => {
          const selected = item.key === tab;
          return (
            <Pressable
              key={item.key}
              onPress={() => setTab(item.key)}
              style={styles.tab}>
              <Text style={selected ? styles.tabSelected : styles.tabLabel}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  tabLabel: {
    fontSize: 14,
    color: '#666',
  },
  tabSelected: {
    fontSize: 14,
    fontWeight: '700',
  },
});
