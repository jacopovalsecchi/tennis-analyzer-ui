import { Pressable, Text, View } from 'react-native';
import { useLatestResult } from '../../hooks';
import type { VideoResult } from '../../types';
import { formatResultDate } from '../../utils';
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

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Results</Text>
      <Text style={styles.subtitle}>Previous videos</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${result.filename}`}
        onPress={() => onOpenResult(result)}
        style={styles.card}>
        <FilmIcon />
        <View style={styles.cardText}>
          <Text style={styles.filename}>{result.filename}</Text>
          <Text style={styles.date}>{formatResultDate(result.uploadedAt)}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    </View>
  );
}
