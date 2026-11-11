import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../auth/AuthProvider';
import {
  AuthScreen,
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

/** Signed-out users see sign in. A session opens the app on Profile. */
export function AppNavigator() {
  const { status, configured } = useAuth();

  if (!configured) {
    return <AuthScreen />;
  }
  if (status === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#3A6B9C" />
      </View>
    );
  }
  if (status === 'signedOut') {
    return <AuthScreen />;
  }
  return <MainTabs />;
}

function MainTabs() {
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
                  style={styles.tab}
                >
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F4F8',
  },
  root: {
    flex: 1,
    backgroundColor: '#F1F4F8',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D5DEE8',
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
    backgroundColor: '#3A6B9C',
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
    color: '#6D7C8E',
  },
  tabSelected: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A6B9C',
  },
});
