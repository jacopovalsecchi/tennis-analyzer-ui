import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  ProfileScreen,
  ResultsScreen,
  VideoDetailScreen,
  VideoUploadScreen,
} from '../screens';
import type { VideoResult } from '../types';

const tabs = [
  { key: 'profile', label: 'Profile', Screen: ProfileScreen },
  { key: 'upload', label: 'Upload', Screen: VideoUploadScreen },
  { key: 'results', label: 'Results', Screen: ResultsScreen },
] as const;

type TabKey = (typeof tabs)[number]['key'];

/** Stack and tab navigator setup. */
export function AppNavigator() {
  const [tab, setTab] = useState<TabKey>('profile');
  const [openResult, setOpenResult] = useState<VideoResult | null>(null);
  const showDetail = tab === 'results' && openResult !== null;

  return (
    <View style={styles.root}>
      {showDetail && openResult ? (
        <VideoDetailScreen
          result={openResult}
          onBack={() => setOpenResult(null)}
        />
      ) : (
        <>
          {tab === 'profile' ? <ProfileScreen /> : null}
          {tab === 'upload' ? <VideoUploadScreen /> : null}
          {tab === 'results' ? (
            <ResultsScreen onOpenResult={setOpenResult} />
          ) : null}
          <View style={styles.bar}>
            {tabs.map(item => {
              const selected = item.key === tab;
              return (
                <Pressable
                  key={item.key}
                  onPress={() => {
                    setOpenResult(null);
                    setTab(item.key);
                  }}
                  style={styles.tab}>
                  <View style={selected ? styles.dot : styles.dotHidden} />
                  <Text style={selected ? styles.tabSelected : styles.tabLabel}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E6E8EC',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3E7A57',
  },
  dotHidden: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8B919A',
  },
  tabSelected: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3E7A57',
  },
});
