import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Video, { type ReactVideoSource } from 'react-native-video';
import { ShotTimeline } from '../../components/ShotTimeline';
import { API_BASE_URL } from '../../services';
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
  const [duration, setDuration] = useState<number>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandedShots, setExpandedShots] = useState<Set<string>>(new Set());
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
            onLoad={({ duration: loadedDuration }) => setDuration(loadedDuration)}
            onError={() => setFailed(true)}
          />
        ) : null}
        {failed || !source ? (
          <Text style={styles.error}>Could not play the overlay video.</Text>
        ) : null}
      </View>
      <ScrollView style={styles.recapScroll} contentContainerStyle={styles.recapContent}>
        <Text style={styles.recap}>Recap</Text>
        <ShotTimeline comments={result.comments ?? []} duration={duration} />
        <View style={styles.countGrid}>
          <View style={styles.countCard}>
            <Text style={styles.countLabel}>Forehand</Text>
            <View style={styles.countValueRow}>
              <RacketIcon />
              <Text style={styles.countValue}>{result.forehands}</Text>
            </View>
          </View>
          <View style={styles.countCard}>
            <Text style={styles.countLabel}>Backhand</Text>
            <View style={styles.countValueRow}>
              <RacketIcon />
              <Text style={styles.countValue}>{result.backhands}</Text>
            </View>
          </View>
        </View>
        {(result.comments ?? []).map(shot => (
          (() => {
            const shotKey = `${shot.time}-${shot.arm}-${shot.label}`;
            const expanded = expandedShots.has(shotKey);

            return (
              <View key={shotKey} style={styles.shotCard}>
                <View style={styles.shotHeader}>
                  {shot.imageUrl ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Open frame for ${shot.label}`}
                      onPress={() =>
                        setSelectedImage(`${API_BASE_URL}${shot.imageUrl}`)
                      }
                    >
                      <Image
                        source={{ uri: `${API_BASE_URL}${shot.imageUrl}` }}
                        style={styles.shotImage}
                        resizeMode="contain"
                      />
                    </Pressable>
                  ) : null}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} ${shot.label}`}
                    accessibilityState={{ expanded }}
                    onPress={() => {
                      setExpandedShots(previous => {
                        const next = new Set(previous);
                        if (next.has(shotKey)) {
                          next.delete(shotKey);
                        } else {
                          next.add(shotKey);
                        }
                        return next;
                      });
                    }}
                    style={styles.shotContent}
                  >
                    <Text style={styles.commentLabel}>Time</Text>
                    <Text style={styles.commentValue}>{shot.time}s</Text>
                    <Text style={styles.commentLabel}>Label</Text>
                    <Text style={styles.commentValue}>{shot.label}</Text>
                  </Pressable>
                </View>
                {expanded ? (
                  <View style={styles.commentContent}>
                    <Text style={styles.commentLabel}>Comment</Text>
                    <Text style={styles.comment}>{shot.comment}</Text>
                  </View>
                ) : null}
              </View>
            );
          })()
        ))}
      </ScrollView>
      <Modal
        visible={selectedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.imageModal}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close image"
            onPress={() => setSelectedImage(null)}
            style={styles.imageModalBackdrop}
          />
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close image"
            onPress={() => setSelectedImage(null)}
            style={styles.closeImage}
          >
            <Text style={styles.closeImageText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

function RacketIcon() {
  return (
    <Image
      source={require('../../assets/tennis-racket.png')}
      style={styles.racketIcon}
      resizeMode="contain"
      accessibilityLabel="Tennis racket"
    />
  );
}
