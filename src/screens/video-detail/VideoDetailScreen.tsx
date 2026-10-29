import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Video, { type ReactVideoSource } from 'react-native-video';
import type { VideoResult } from '../../types';
import { styles } from './styles';

function overlaySource(result: VideoResult): ReactVideoSource | null {
  if (result.overlayUrl) {
    return { uri: result.overlayUrl };
  }
  const bundled = Image.resolveAssetSource(
    require('../../assets/sample_overlay.mp4'),
  );
  if (!bundled?.uri) {
    return null;
  }
  return { uri: bundled.uri };
}

/** Overlay video on top, forehand and backhand counts below. */
export function VideoDetailScreen({
  result,
  onBack,
}: {
  result: VideoResult;
  onBack: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const source = overlaySource(result);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
          onPress={onBack}
          style={styles.back}>
          <Text style={styles.backChevron}>‹</Text>
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>
          {result.filename}
        </Text>
      </View>
      <View style={styles.playerCard}>
        {source ? (
          <Video
            key={result.id}
            source={source}
            style={styles.video}
            controls
            paused={false}
            resizeMode="contain"
            ignoreSilentSwitch="ignore"
            onError={() => setFailed(true)}
          />
        ) : null}
        {failed || !source ? (
          <Text style={styles.error}>Could not play the overlay video.</Text>
        ) : null}
      </View>
      <Text style={styles.recap}>Recap</Text>
      <View style={styles.countCard}>
        <Text style={styles.countLabel}>Forehand</Text>
        <Text style={styles.countValue}>{result.forehands}</Text>
      </View>
      <View style={styles.countCard}>
        <Text style={styles.countLabel}>Backhand</Text>
        <Text style={styles.countValue}>{result.backhands}</Text>
      </View>
    </View>
  );
}
