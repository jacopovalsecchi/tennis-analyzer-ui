import { Image, Pressable, Text, View } from 'react-native';
import { useLatestResult } from '../../hooks';
import { API_BASE_URL } from '../../services';
import type { VideoResult } from '../../types';
import { formatResultDateTime } from '../../utils';
import { styles } from './styles';

function FilmIcon() {
  return (
    <View style={styles.film}>
      <View style={styles.filmEdge} />
      <View style={styles.filmEdge} />
    </View>
  );
}

/** Previous videos. One row, always the last upload. */
export function ResultsScreen({
  onOpenResult,
}: {
  onOpenResult: (result: VideoResult) => void;
}) {
  const result = useLatestResult();
  const thumbnailPath = result.comments?.find(comment => comment.imageUrl)?.imageUrl;
  const thumbnailUrl = thumbnailPath
    ? `${API_BASE_URL}${thumbnailPath}`
    : null;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Results</Text>
      <Text style={styles.subtitle}>Previous videos</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${result.filename}`}
        onPress={() => onOpenResult(result)}
        style={styles.card}>
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <FilmIcon />
          </View>
        )}
        <View style={styles.cardText}>
          <Text style={styles.filename}>{result.filename}</Text>
          <Text style={styles.date}>{formatResultDateTime(result.uploadedAt)}</Text>
          <Text style={styles.counts}>
            <Text style={styles.countsIcon}>◉</Text>{' '}
            {result.forehands} Forehands • {result.backhands} Backhands
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    </View>
  );
}
